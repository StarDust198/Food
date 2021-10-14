const axios = require('axios').default;

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

export default cards;