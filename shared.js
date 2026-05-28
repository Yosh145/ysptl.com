/* clock + home bar navigation */

document.addEventListener('DOMContentLoaded', () => {
    // clock
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        function updateTime() {
            timeDisplay.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        }
        updateTime();
        setInterval(updateTime, 1000);
    }

    // send back to index
    const homeBar = document.getElementById('home-bar');
    if (window.location.pathname.indexOf('index') === -1) {
        const goHome = () => { window.location.href = 'index.html'; };
        if (homeBar) homeBar.addEventListener('click', goHome);

        const homeZone = document.getElementById('home-zone');
        if (homeZone && window.matchMedia('(max-width: 860px)').matches) {
            homeZone.style.pointerEvents = 'auto';
            homeZone.addEventListener('click', goHome);
        }
    }
});
