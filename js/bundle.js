/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

function calc() {
    const result = document.querySelector('.calculating__result span');
    let sex = localStorage.getItem('sex') || 'female',
        height = localStorage.getItem('height'),
        weight = localStorage.getItem('weight'),
        age = localStorage.getItem('age'),
        ratio = localStorage.getItem('ratio') || 1.375;
    

    const calcTotal = function () {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = ((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio).toFixed(0);
        } else {
            result.textContent = ((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio).toFixed(0);
        }
    };

    calcTotal();

    const getStaticInfo = function(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            if (elem.getAttribute('data-ratio') == ratio) {
                elem.classList.add(activeClass);
            } else if (elem.getAttribute('id') === sex) {
                elem.classList.add(activeClass);
            }

            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    };

    getStaticInfo('#gender', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

    const getDynamicInfo = function(selector) {
        const input = document.querySelector(selector);

        input.value = localStorage.getItem(input.getAttribute('id'));

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = '';
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    localStorage.setItem('height', height);
                    break;
                case 'weight':
                    weight = +input.value;
                    localStorage.setItem('weight', weight);
                    break;
                case 'age':
                    age = +input.value;
                    localStorage.setItem('age', age);
                    break;
            }

            calcTotal();
        });
    };

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
}

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {
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

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price).createCard();
            });
        })
        .catch(error => {
            console.log(error);
        });
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() { 
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'icons/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

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
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
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
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {
    const sliderTab = document.querySelector('.offer__slider'),
          sliderNext = sliderTab.querySelector('.offer__slider-next'),
          sliderPrev = sliderTab.querySelector('.offer__slider-prev'),
          sliderTotal = sliderTab.querySelector('#total'),
          sliderCurrent = sliderTab.querySelector('#current'),   
          slides = sliderTab.querySelectorAll('.offer__slide'),
          slidesWrapper = sliderTab.querySelector('.offer__slider-wrapper'),
          slidesField = sliderTab.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width,
          dots = [];
  
    let slideIndex = Math.floor(1 + Math.random()*slides.length);

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';

    const dotsField = document.createElement('ol');           // create indicators field
    dotsField.classList.add('carousel-indicators');
    slidesWrapper.style.position = 'relative';
    slidesWrapper.append(dotsField);

    sliderTotal.textContent = getZero(slides.length);        // initial slider setup 
    slides.forEach(slide => {
        slide.style.width = width;                           // force proper width
        const dot = document.createElement('li');            // create indicators
        dot.classList.add('dot');
        dotsField.append(dot);
        dots.push(dot);
    });

    const moveSlide = () => {
        slideIndex > slides.length ? slideIndex = 1         // check if index's correct
            : slideIndex === 0 ? slideIndex = slides.length : slideIndex;
        sliderCurrent.textContent = getZero(slideIndex);
        dots.forEach((dot, i) => i === slideIndex - 1 ? dot.style.opacity = 1 : dot.style.opacity = 0.5);
        slidesField.style.transform = `translateX(${0 - 100/slides.length * (slideIndex - 1)}%)`;
    };

    moveSlide();

    dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        slideIndex = i+1;
        moveSlide();
    });
    });

    sliderNext.addEventListener('click', () => {
        slideIndex++;
        moveSlide();
    });

    sliderPrev.addEventListener('click', () => {
        slideIndex--;
        moveSlide();
    });
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
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
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/


window.addEventListener('DOMContentLoaded', () => {
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
          modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
          timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
          cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
          calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js"),
          forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
          slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");

    tabs();
    modal();
    timer();
    cards();
    calc();
    forms();
    slider();
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map