(() => {
  const APP_NAMES = ['resume', 'projects', 'toolbox'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const wins = {};
  let current = null;
  let openedInPage = false;
  let closeRequested = false;
  let lastOrigin = null;
  let queue = Promise.resolve();

  function enqueue(fn) {
    queue = queue.then(fn).catch(err => console.error(err));
    return queue;
  }

  // button click
  function initParts() {
    document.querySelectorAll('.part').forEach(part => {
      const release = () => part.classList.remove('pressed');
      part.addEventListener('pointerdown', () => part.classList.add('pressed'));
      part.addEventListener('pointerup', release);
      part.addEventListener('pointerleave', release);
      part.addEventListener('pointercancel', release);
      part.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        part.classList.add('pressed');
        setTimeout(release, 120);
      });
      part.addEventListener('click', () => { lastOrigin = part; });
    });
  }

  function originPoint(el) {
    const m = 20;
    if (!el) return { x: innerWidth / 2, y: innerHeight - m };
    const r = el.getBoundingClientRect();
    return {
      x: Math.min(Math.max(r.left + r.width / 2, m), innerWidth - m),
      y: Math.min(Math.max(r.top + r.height / 2, m), innerHeight - m),
    };
  }

  function stopAnimations(dlg) {
    dlg.querySelectorAll('.win-scrim, .win-frame, .win-bar, .win-body, .win-flash')
      .forEach(el => el.getAnimations().forEach(a => a.cancel()));
  }

  // crt on off animation
  function crt(dlg, originEl, on) {
    stopAnimations(dlg);
    const scrim = dlg.querySelector('.win-scrim');
    const frame = dlg.querySelector('.win-frame');
    const flash = dlg.querySelector('.win-flash');
    const content = [dlg.querySelector('.win-bar'), dlg.querySelector('.win-body')];

    if (reduceMotion.matches) {
      const opts = { duration: 150, easing: 'ease', direction: on ? 'normal' : 'reverse', fill: 'forwards' };
      return Promise.all([scrim, frame].map(el => el.animate([{ opacity: 0 }, { opacity: 1 }], opts).finished));
    }

    const r = frame.getBoundingClientRect();
    const o = originPoint(originEl);
    const at = `${o.x - (r.left + r.width / 2)}px, ${o.y - (r.top + r.height / 2)}px`;
    const home = '0px, 0px';
    const tf = (t, sx, sy) => `translate(${t}) scale(${sx}, ${sy})`;
    const anims = [];

    if (on) {
      const opts = { duration: 700 };
      anims.push(frame.animate([
        { transform: tf(at, 0.04, 0.006), opacity: 0, offset: 0, easing: 'ease-out' },
        { transform: tf(at, 0.04, 0.006), opacity: 1, offset: 0.06, easing: 'cubic-bezier(.3, 0, .2, 1)' },
        { transform: tf(home, 0.04, 0.006), opacity: 1, offset: 0.35, easing: 'cubic-bezier(.2, .9, .3, 1)' },
        { transform: tf(home, 1, 0.006), opacity: 1, offset: 0.55, easing: 'cubic-bezier(.2, .9, .25, 1.1)' },
        { transform: tf(home, 1, 1.02), opacity: 1, offset: 0.85, easing: 'ease-out' },
        { transform: tf(home, 1, 1), opacity: 1, offset: 1 },
      ], opts));
      anims.push(flash.animate([
        { opacity: 1, offset: 0 }, { opacity: 1, offset: 0.55 }, { opacity: 0.85, offset: 0.7 }, { opacity: 0, offset: 0.9 }, { opacity: 0, offset: 1 },
      ], opts));
      content.forEach(el => anims.push(el.animate([
        { opacity: 0, offset: 0 }, { opacity: 0, offset: 0.7 }, { opacity: 0.6, offset: 0.78 }, { opacity: 0.25, offset: 0.84 }, { opacity: 1, offset: 1 },
      ], opts)));
      anims.push(scrim.animate([{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 1 }], opts));
    } else {
      const opts = { duration: 420, fill: 'forwards' };
      anims.push(frame.animate([
        { transform: tf(home, 1, 1), opacity: 1, offset: 0, easing: 'cubic-bezier(.5, 0, .8, .4)' },
        { transform: tf(home, 1, 0.006), opacity: 1, offset: 0.4, easing: 'cubic-bezier(.4, 0, .6, 1)' },
        { transform: tf(home, 0.04, 0.006), opacity: 1, offset: 0.62, easing: 'cubic-bezier(.5, 0, .75, 0)' },
        { transform: tf(at, 0.04, 0.006), opacity: 1, offset: 0.92 },
        { transform: tf(at, 0.01, 0.004), opacity: 0, offset: 1 },
      ], opts));
      anims.push(flash.animate([{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1 }], opts));
      content.forEach(el => anims.push(el.animate([{ opacity: 1 }, { opacity: 0, offset: 0.2 }, { opacity: 0 }], opts)));
      anims.push(scrim.animate([{ opacity: 1 }, { opacity: 0 }], opts));
    }
    return Promise.all(anims.map(a => a.finished));
  }

  // open modal window and trigger crt turn-on effect
  async function openWindow(name) {
    const dlg = wins[name];
    dlg._origin = (lastOrigin && lastOrigin.dataset.app === name)
      ? lastOrigin
      : document.querySelector(`.part[data-app="${name}"]`);
    lastOrigin = null;
    current = name;
    closeRequested = false;
    document.documentElement.classList.add('win-open');
    dlg.showModal();
    const app = window.APPS && window.APPS[name];
    if (app && app.onOpen) app.onOpen();
    await crt(dlg, dlg._origin, true);
  }

  // play crt collapse animation and close modal
  async function closeWindow() {
    const name = current;
    if (!name) return;
    const dlg = wins[name];
    current = null;
    if (dlg.open) {
      await crt(dlg, dlg._origin, false);
      dlg.close();
    }
  }

  // parse hash and switch active modal
  function route() {
    const name = location.hash.slice(1);
    enqueue(async () => {
      if (current && current !== name) await closeWindow();
      if (APP_NAMES.includes(name) && current !== name) await openWindow(name);
    });
  }

  // close modal and sync back history state
  function requestClose() {
    if (!current || closeRequested) return;
    closeRequested = true;
    if (openedInPage) {
      history.back();
    } else {
      history.replaceState(null, '', location.pathname + location.search);
      route();
    }
  }

  // register modal event listeners and hash watcher
  function initWindows() {
    APP_NAMES.forEach(name => {
      const dlg = wins[name] = document.getElementById('win-' + name);
      dlg.querySelector('.win-close').addEventListener('click', requestClose);
      dlg.querySelector('.win-scrim').addEventListener('click', requestClose);
      dlg.addEventListener('cancel', e => {
        e.preventDefault();
        requestClose();
      });
      dlg.addEventListener('close', () => {
        stopAnimations(dlg);
        if (!document.querySelector('dialog.win[open]')) document.documentElement.classList.remove('win-open');
        if (dlg._origin) dlg._origin.focus({ preventScroll: true });
        if (current === name) {
          current = null;
          if (location.hash === '#' + name) {
            closeRequested = true;
            if (openedInPage) history.back();
            else history.replaceState(null, '', location.pathname + location.search);
          }
        }
      });
    });

    window.addEventListener('hashchange', () => {
      openedInPage = true;
      route();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initParts();
    initWindows();
    if (APP_NAMES.includes(location.hash.slice(1))) route();
  });
})();
