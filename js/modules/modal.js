function openModal(modalSelector, modalTimerId) {
  const modal = document.querySelector(modalSelector);

  modal.classList.remove('hide');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  clearInterval(modalTimerId);
}

function closeModal(modalSelector) {
  const modal = document.querySelector(modalSelector);

  modal.classList.remove('show');
  modal.classList.add('hide');
  document.body.style.overflow = '';
}

function modal(modalSelector, modalBtnSelector, modalTimerId) {
    const modalBtns = document.querySelectorAll(modalBtnSelector),
          modal = document.querySelector(modalSelector), 
          showModalByScroll = function() {
            if (window.pageYOffset + document.documentElement.clientHeight + 1 >= 
                document.documentElement.scrollHeight) {
                    openModal(modalSelector, modalTimerId);
                    window.removeEventListener('scroll', showModalByScroll);
                    clearInterval(modalTimerId);
            }
          };

    modalBtns.forEach(btn => btn.addEventListener('click', () => openModal(modalSelector, modalTimerId)));

    modal.addEventListener('click', (e) => {
        if (e.target && (e.target.classList.contains('modal') || e.target.hasAttribute('data-close'))) {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    window.addEventListener('scroll', () => {
      showModalByScroll();
    });
}

export default modal;
export {openModal, closeModal};