function slider({container, next, prev, totalCounter, currentCounter, slidePack, wrapper, field}) {
    const sliderTab = document.querySelector(container),
          sliderNext = sliderTab.querySelector(next),
          sliderPrev = sliderTab.querySelector(prev),
          sliderTotal = sliderTab.querySelector(totalCounter),
          sliderCurrent = sliderTab.querySelector(currentCounter),   
          slides = sliderTab.querySelectorAll(slidePack),
          slidesWrapper = sliderTab.querySelector(wrapper),
          slidesField = sliderTab.querySelector(field),
          
          width = window.getComputedStyle(slidesWrapper).width,
          dots = [],
          getZero = num => num < 10 ? `0${num}` : `${num}`;
  
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

export default slider;