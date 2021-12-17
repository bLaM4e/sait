'use strict';

const selectMenu = {
	selectItems: document.querySelectorAll('.form_select'),

	init() {
		for (let i = 0; i < this.selectItems.length; i++) {
			const selectBlock = this.selectItems[i];
			let dropOut = this.selectItems[i].nextElementSibling;

			selectBlock.addEventListener('click', () => {

				if (![...dropOut.classList].includes('form_active')) {
					this.addActiveClass(dropOut, selectBlock);

					dropOut.childNodes[1].addEventListener('click', this.userSelectionFunc);
				} else {
					this.removeActiveClass(dropOut, selectBlock);
				}
			});
		}
	},

	userSelectionFunc(event) {
		let parentBlock = '';
		let userSelection = '';
		let dropOut = '';

		if (event.target.tagName === 'LI') {
			parentBlock = event.target.parentElement.parentElement.parentElement.querySelector('.text_in_block');
			dropOut = event.target.parentElement.parentElement
			userSelection = event.target.firstChild.textContent;
		} else {
			parentBlock = event.target.parentElement.parentElement.parentElement.parentElement.querySelector('.text_in_block');
			dropOut = event.target.parentElement.parentElement.parentElement
			userSelection = event.target.textContent;
		}
		parentBlock.textContent = userSelection;

		selectMenu.removeActiveClass(dropOut, dropOut.parentElement.querySelector('.form_select'));
	},

	addActiveClass(dropOut, selectBlock) {
		dropOut.classList.add('form_active');
		selectBlock.childNodes[3].classList.add('form_arrow_active');

		setTimeout(() => {
			const dropOutBlock = dropOut.childNodes[1];
			const dropOutBlockItems = dropOutBlock.childNodes;

			let sumHeights = 0;
			for (const el of dropOutBlockItems) {
				if (el.tagName === 'LI') {
					sumHeights += el.clientHeight + 1;
				}
			}

			dropOutBlock.style.height = sumHeights + "px";
		}, 0)
	},

	removeActiveClass(dropOut, selectBlock) {
		dropOut.childNodes[1].style.height = 0;
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

const downloadResume = {
	inputButton: document.querySelector('.input_file'),
	resumeEmpty: document.querySelector('.form_resume_empty'),
	resumeOk: document.querySelector('.form_resume_ok'),
	resumeTitle: document.querySelector('.user_name_resume'),

	upload() {
		this.inputButton.addEventListener('change', () => {
			const nameVal = document.querySelector('.form_user_name').value;

			this.resumeEmpty.classList.add('resume_empty_toggle');
			this.resumeOk.classList.add('resume_ok_toggle');
			this.resumeTitle.textContent = nameVal + ' - резюме';
		});
	}
}

selectMenu.init();
scroll.toElement();
downloadResume.upload();
