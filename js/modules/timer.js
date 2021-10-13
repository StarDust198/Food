function timer() {
    const deadline = '2021-12-15';

    const getTimeRemaining = function(endTime) {
    const t = Date.parse(endTime) - Date.parse(new Date());

    return {
        'total': t,
        days: Math.floor(t / (1000 * 60 * 60 * 24)),
        hours: Math.floor(t / (1000 * 60 * 60) % 24),
        minutes: Math.floor(t / (1000 * 60) % 60),
        seconds: Math.floor(t / 1000 % 60)
    };
    };

    const getZero = num => num < 10 ? `0${num}` : `${num}`;

    const setClock = function(selector, endTime) {
    const timer = document.querySelector(selector),
            timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock () {
        let t = getTimeRemaining(endTime);

        timer.querySelector('#days').textContent = getZero(t.days);
        timer.querySelector('#hours').textContent = getZero(t.hours);
        timer.querySelector('#minutes').textContent = getZero(t.minutes);
        timer.querySelector('#seconds').textContent = getZero(t.seconds);

        if (t.total <= 0) {
            clearInterval(timeInterval);
        }
    }
    };

    setClock('.timer', deadline);
}

module.exports = timer;