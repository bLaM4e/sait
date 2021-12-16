'use strict';

const selectMenu = {
	selectItems: document.querySelectorAll('.form_select'),

	init() {
		for (let i = 0; i < this.selectItems.length; i++) {
			const selectBlock = this.selectItems[i];
			let dropOut = this.selectItems[i].nextElementSibling;
			let activeClass = '';

			selectBlock.addEventListener('click', () => {
				activeClass = this.classSelection(i);

				if (![...dropOut.classList].includes('form_active')) {
					this.addActiveClass(dropOut, selectBlock, activeClass);
				} else {
					this.removeActiveClass(dropOut, selectBlock, activeClass);
				}
			});
		}
	},

	classSelection(idx) {
		if (idx === 0) return 'out_ul_active1';
		
		return 'out_ul_active2';
	},

	addActiveClass(dropOut, selectBlock, activeClass) {
		dropOut.classList.add('form_active');
		selectBlock.childNodes[3].classList.add('form_arrow_active');

		setTimeout(() => 
			dropOut.childNodes[1].classList.add(activeClass), 0);
	},

	removeActiveClass(dropOut, selectBlock, activeClass) {
		dropOut.childNodes[1].classList.remove(activeClass);
		selectBlock.childNodes[3].classList.remove('form_arrow_active');

		setTimeout(() => {
			dropOut.classList.remove('form_active');
		}, 400);
	},
}

const scroll = {
	anchors: document.querySelectorAll('.table_btn'),

	toElement() {
		for (const anchor of this.anchors) {
			anchor.addEventListener('click', event => {
				event.preventDefault();

				const blockID = event.target.parentElement.getAttribute('href').slice(1);

				document.getElementById(blockID).scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			});
		}
	}
}

selectMenu.init();
scroll.toElement();
