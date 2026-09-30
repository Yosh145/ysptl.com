const PROJECTS = [
  {
    name: 'HyprHelp',
    repo: 'https://github.com/yosh145/HyprHelp',
    lang: 'Python',
    stars: 6,
    featured: true,
    desc: 'A Hyprland help menu surfacing keybinds and more.',
    tags: ['Python', 'Linux', 'Hyprland']
  },


  {
    name: 'reshown',
    repo: 'https://github.com/Yosh145/reshown',
    lang: 'Rust',
    stars: 0,
    featured: false,
    desc: 'Show tracker in built in egui and Rust. Tracks not just shows, but whatever episodes/movies you watch.',
    tags: ['Rust', 'egui', 'movies', 'database', 'cli']
  },

  {
    name: 'MSP430 Morse Code Communicator',
    repo: 'https://github.com/yosh145/msp430-morse-code-decoder',
    lang: 'C',
    stars: 0,
    featured: false,
    desc: 'Real-time Morse communicator on the MSP430FR6989: takes terminal input over UART, decodes each letter live, and drives the result to an LED and an audible buzzer.',
    tags: ['C', 'MSP430', 'UART', 'Real-time', 'Embedded']
  },
  {
    name: 'USFMH — Smart Audio EQ Headset',
    repo: 'https://github.com/yosh145/USFMH',
    lang: 'C',
    stars: 0,
    featured: true,
    desc: 'Senior Project (2025): a smart audio equalizer headset — embedded firmware driving real-time DSP and audio output on custom hardware.',
    tags: ['C', 'Embedded', 'DSP', 'Hardware', 'Senior Project']
  },
  {
    name: 'KDE Dial Lockscreen',
    repo: 'https://github.com/yosh145/KDE-Dial-Lockscreen',
    lang: 'QML',
    stars: 0,
    featured: false,
    desc: 'An i3lock-style dial lockscreen for KDE Plasma, built in QML.',
    tags: ['QML', 'KDE', 'Linux', 'UI']
  }, {
    name: 'and 20+ MORE...',
    repo: 'https://github.com/Yosh145?tab=repositories',
    lang: '',
    featured: false,
    desc: 'Check out my full list of repos here!',
    tags: []
  },

];

const LANG_COLORS = {
  C: '#555555', Rust: '#dea584', Python: '#3572A5', QML: '#44a51c',
  Lua: '#000080', JavaScript: '#f1e05a', HTML: '#e34c26', 'C++': '#f34b7d'
};

// sanitize text for card html
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// build project cards and inject into grid
function renderProjects() {
  document.getElementById('project-grid').innerHTML = PROJECTS.map(p => `
    <a class="project-card${p.featured ? ' featured' : ''}" href="${p.repo}" target="_blank" rel="noopener">
      <div class="card-top">
        <span class="lang"><span class="lang-dot" style="background:${LANG_COLORS[p.lang] || '#888'}"></span>${esc(p.lang)}</span>
        ${p.featured ? '<span class="featured-badge">★ Featured</span>'
      : (p.stars > 0 ? `<span class="stars"><i class="fa-regular fa-star"></i>${p.stars}</span>` : '')}
      </div>
      <h2>${esc(p.name)}</h2>
      <p>${esc(p.desc)}</p>
      <div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <span class="card-link"><i class="fa-brands fa-github"></i> View on GitHub →</span>
    </a>`).join('');
}

document.addEventListener('DOMContentLoaded', renderProjects);
