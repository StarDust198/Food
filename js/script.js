'use strict';

window.addEventListener('DOMContentLoaded', () => {

    // tabs
    
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    const hideTabContent = function () {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach (item => {
            item.classList.remove('tabheader__item_active');
        });
    };

    const showTabContent = function (i = 0) {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'fade');
        tabs[i].classList.add('tabheader__item_active');
    };

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (item === e.target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    // timer

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

    // modal

    const modalBtns = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalClose = modal.querySelector('[data-close]'),
          openModal = function() {
            modal.classList.remove('hide');
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            // clearInterval(modalTimerId);
          },
          closeModal = function() {
            modal.classList.remove('show');
            modal.classList.add('hide');
            document.body.style.overflow = '';
          },
        //   modalTimerId = setTimeout(openModal, 60000),
          showModalByScroll = function() {
            if (window.pageYOffset + document.documentElement.clientHeight >= 
                document.documentElement.scrollHeight) {
                    openModal();
                    window.removeEventListener('scroll', showModalByScroll);
                    // clearInterval(modalTimerId);
            }
          };

    modalBtns.forEach(btn => btn.addEventListener('click', openModal));

    modal.addEventListener('click', (e) => {
        if (e.target && (e.target.classList.contains('modal') || e.target == modalClose)) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    window.addEventListener('scroll', showModalByScroll);

    // cards

    document.querySelector('.menu__field .container').innerHTML = '';

    const cardsDB = [
        {
            img: 'img/tabs/vegy.jpg',
            alt: 'vegy',
            header: 'Меню "Фитнес"',
            text: 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих ' +
            'овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый ' + 
            'продукт с оптимальной ценой и высоким качеством!',
            price: 229
        },
        {
            img: 'img/tabs/elite.jpg',
            alt: 'elite',
            header: 'Меню “Премиум”',
            text: 'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и ' + 
            'качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное ' +
            'меню без похода в ресторан!',
            price: 550
        },
        {
            img: 'img/tabs/post.jpg',
            alt: 'post',
            header: 'Меню "Постное"',
            text: 'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие ' +
            'продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, ' +
            'правильное количество белков за счет тофу и импортных вегетарианских стейков.',
            price: 430
        }
    ];

    class MenuCard {
        constructor(img, alt, header, text, price, parentSelector, ...classes) {
            this.img = img;
            this.alt = alt;
            this.header = header;
            this.text = text;
            this.price = price;
            this.transfer = 27;
            // this.changeToUAH();
            this.parent = document.querySelector(parentSelector);
            this.classes = classes.length > 0 ? classes : ['menu__item'];
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        createCard() {
            const card = document.createElement('div');
            card.classList.add(...this.classes);

            card.innerHTML = `
                <img src="${this.img}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.header}</h3>
                <div class="menu__item-descr">${this.text}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;

            this.parent.append(card);
        }
    }

    for (let i in cardsDB) {
        const {img, alt, header, text, price} = cardsDB[i];
        new MenuCard(img, alt, header, text, price, '.menu__field .container').createCard();
    }

    // forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key) {
                object[key] = value;
            });

            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                } else {
                    statusMessage.textContent = message.failure;
                }
            });
        });
    }
});