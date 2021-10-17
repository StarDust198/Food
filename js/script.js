'use strict';

import "core-js/stable";
import "regenerator-runtime/runtime";
import 'dom-node-polyfills';
require('es6-promise').polyfill();
import 'whatwg-fetch';
import 'formdata-polyfill';

import tabs from './modules/tabs';
import modal from './modules/modal';
import timer from './modules/timer';
import cards from './modules/cards';
import calc from './modules/calc';
import forms from './modules/forms';
import slider from './modules/slider';
import {openModal} from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 300000),
          deadline = '2021-12-15';

    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    modal('.modal', '[data-modal]', modalTimerId);
    timer('.timer', deadline);
    cards();
    calc();
    forms('form', '.modal', modalTimerId);
    slider({
        next: '.offer__slider-next',
        prev: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        slidePack: '.offer__slide',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
});