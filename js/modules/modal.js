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