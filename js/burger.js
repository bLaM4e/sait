'use strict'

const menuMini = document.querySelector('.burger');
menuMini.addEventListener('click', () => {
    menuMini.toggleAttribute('active');
    document.querySelector('.navbar').toggleAttribute('active');
    document.body.toggleAttribute('lock');
});
