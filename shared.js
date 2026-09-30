document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        // tick status bar clock every sec
        function updateTime() {
            timeDisplay.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        }
        updateTime();
        setInterval(updateTime, 1000);
    }

    const homeBar = document.getElementById('home-bar');
    if (window.location.pathname.indexOf('index') === -1) {
        // bounce back to root if we're on a subpage
        const goHome = () => { window.location.href = 'index.html'; };
        if (homeBar) homeBar.addEventListener('click', goHome);

        const homeZone = document.getElementById('home-zone');
        if (homeZone && window.matchMedia('(max-width: 860px)').matches) {
            homeZone.style.pointerEvents = 'auto';
            homeZone.addEventListener('click', goHome);
        }
    }
});
