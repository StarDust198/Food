function slider({next, prev, totalCounter, currentCounter, slidePack, wrapper, field}) {
    const sliderNext = document.querySelector(next),
          sliderPrev = document.querySelector(prev),
          sliderTotal = document.querySelector(totalCounter),
          sliderCurrent = document.querySelector(currentCounter),   
          slides = document.querySelectorAll(slidePack),
          slidesWrapper = document.querySelector(wrapper),
          slidesField = document.querySelector(field),
          
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
    dotsField.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slidesWrapper.style.position = 'relative';
    slidesWrapper.append(dotsField);

    sliderTotal.textContent = getZero(slides.length);        // initial slider setup 
    slides.forEach(slide => {
        slide.style.width = width;                           // force proper width
        const dot = document.createElement('li');            // create indicators
        dot.classList.add('dot');
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
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