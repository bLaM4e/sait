'use strict';

const gallery = {
    settings: {
        galleryWrapperPreview: '.license',
        openGalleryWrapperClass: '.galleryWrapper',
        openGalleryScreenClass: '.galleryWrapper__screen',
        openGalleryCloseBtnClass: '.galleryWrapper__close',
        openGalleryImg: '.galleryWrapper__image',
        openGallerySrc: 'images/license/max/Lic_2021_Pril_1_1.jpg',
    },

    init() {
        const userSettings = {};
        Object.assign(this.settings, userSettings);

        document.querySelector(`${this.settings.galleryWrapperPreview}`)
            .addEventListener('click', event => {
                this.openImgMax(event.target)
                this.close();
            });
    },

    openImgMax(element) {
        if (element.tagName !== 'IMG') return;

        document.querySelector(`${this.settings.openGalleryImg}`)
            .src = element.dataset.full_image_url;

        document.querySelector(`${this.settings.openGalleryWrapperClass}`)
            .classList.add('galleryWrapper__active');
    },

    close() {
        document.querySelector(`${this.settings.openGalleryCloseBtnClass}`)
            .addEventListener('click', event => {
                event.target.parentElement.classList.remove('galleryWrapper__active');
            });
    }
}

gallery.init();
