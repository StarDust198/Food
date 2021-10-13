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