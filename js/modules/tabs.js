function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, aciveClass) {
    const tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);

    const hideTabContent = function () {
    tabsContent.forEach(item => {
        item.classList.add('hide');
        item.classList.remove('show', 'fade');
    });

    tabs.forEach (item => {
        item.classList.remove(aciveClass);
    });
    };

    const showTabContent = function (i = 0) {
    tabsContent[i].classList.remove('hide');
    tabsContent[i].classList.add('show', 'fade');
    tabs[i].classList.add(aciveClass);
    };

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains(tabsSelector.slice(1))) {
        tabs.forEach((item, i) => {
            if (item === e.target) {
                hideTabContent();
                showTabContent(i);
            }
        });
    }
    });
}

export default tabs;