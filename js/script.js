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
        if (e.target && (e.target.classList.contains('modal') || e.target.hasAttribute('data-close'))) {
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

    class MenuCard {
        constructor(img, alt, header, text, price, parentSelector, ...classes) {
            this.img = img;
            this.alt = alt;
            this.header = header;
            this.text = text;
            this.price = price;
            this.transfer = 27;
            this.changeToUAH();
            this.parent = document.querySelector(parentSelector ? parentSelector : '.menu__field .container');
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

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price).createCard();
            });
        })
        .catch(error => {
            console.log(error);
        });

/*     getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price).createCard();
            });
        }); */

    // forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'icons/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const obj = Object.fromEntries(formData.entries());

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            axios.post('http://localhost:3000/requests', obj)
                .then(response => {
                    console.log(response);
                    showThanksModal(message.success);
                    form.reset();
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });

/*             postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    form.reset();
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                }); */
        });
    }

    function showThanksModal(msg) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.remove('show');
        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${msg}</div>
            </div>
        `;

        modal.append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.remove('hide');
            prevModalDialog.classList.add('show');
            closeModal();
        }, 4000);
    }

    // slider

    const sliderTab = document.querySelector('.offer__slider'),
        sliderNext = sliderTab.querySelector('.offer__slider-next'),
        sliderPrev = sliderTab.querySelector('.offer__slider-prev'),
        sliderTotal = sliderTab.querySelector('#total'),
        sliderCurrent = sliderTab.querySelector('#current'),   
        slides = sliderTab.querySelectorAll('.offer__slide');
        
    const showSlide = index => {
        slides.forEach(slide => slide.style.display = 'none');
        slides[index].style.display = 'block';
    };
    
    const showNextSlide = () => {
        +sliderCurrent.textContent + 1 > slides.length ? sliderCurrent.textContent = '01' 
            : sliderCurrent.textContent = getZero((+sliderCurrent.textContent) + 1);        
        showSlide(+sliderCurrent.textContent - 1);
    };

    const showPrevSlide = () => {
        +sliderCurrent.textContent - 1 === 0 ? sliderCurrent.textContent = getZero(slides.length) 
            : sliderCurrent.textContent = getZero((+sliderCurrent.textContent) - 1);        
        showSlide(+sliderCurrent.textContent - 1);
    };
    
    sliderNext.addEventListener('click', () => {
        showNextSlide();
    });

    sliderPrev.addEventListener('click', () => {
        showPrevSlide();
    });

    // initial slider setup
    sliderTotal.textContent = getZero(slides.length);
    sliderCurrent.textContent = getZero(Math.floor(1 + Math.random()*slides.length));
    showSlide(+sliderCurrent.textContent - 1);
});