'use strict';

const blockNews = {
    init() {
        const news = document.querySelector('.news');

        news.addEventListener('click', event => {
            if (event.target.classList[0] !== 'news_title') return;

            event.target.classList.toggle('news_active');

            const accordionElement = event.target.nextElementSibling;

            if (![...accordionElement.classList].includes('news_text_open')) {
                this.visibleOk(accordionElement);
            } else {
                this.visibleNo(accordionElement);
            }

            this.once(news, event);
        });
    },

    visibleOk(element) {
        element.classList.add('news_text_open');

        element.style.height = 'auto';

        const height = element.clientHeight + 'px';

        element.style.height = '0px';
        setTimeout(() => element.style.height = height,
            0);
    },

    visibleNo(element) {
        element.style.height = '0px';
        setTimeout(() => element.classList.remove('news_text_open'),
            500);
    },

    once(element, event) {
        if (![...element.classList].includes('one')) return;

        const newsTitleAll = document.querySelectorAll('.news_active');
        const newsTextAll = document.querySelectorAll('.news_text_open');

        console.log(newsTitleAll)

        for (let i = 0; i < newsTitleAll.length; i++) {
            const el = newsTitleAll[i];
            if (event.target === el) continue;

            if (el.classList.length === 2) {
                el.classList.remove('news_active');
                this.visibleNo(newsTextAll[i]);
            }
        }
    },
}

blockNews.init();
