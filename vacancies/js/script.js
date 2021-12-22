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
		dropOut.childNodes[1].removeEventListener('click', this.userSelectionFunc);

		dropOut.childNodes[1].style.height = 0;
		selectBlock.childNodes[3].classList.remove('form_arrow_active');

		setTimeout(() => {
			dropOut.classList.remove('form_active');
		}, 400);
	},
}

const formValidate = {
	form: document.querySelector('.vacancies_form'),
	formInputs: document.querySelectorAll('._req'),
	inputEmail: document.querySelector('.js_input_email'),
	inputPhone: document.querySelector('.js_input_phone'),
	inputCheckbox: document.querySelector('.js_input_checkbox'),

	go() {
		this.form.onsubmit = this.validations.bind(this);

		this.inputPhone.addEventListener('focus', _ => {
			if(!/^\+\d*$/.test(this.inputPhone.value))
				this.inputPhone.value = '+';
		});

		this.inputPhone.addEventListener('keypress', event => {
			if(!/\d/.test(event.key))
				event.preventDefault();
		});
	},

	validations() {
		let emailVal = this.inputEmail.value,
			phoneVal = this.inputPhone.value,
			emptyInputs = [...this.formInputs].filter(input => input.value === '')

		this.formInputs.forEach(function(input) {
			if (input.value === '') {
				input.classList.add('form_error');
			} else {
				input.classList.remove('form_error');
			}
		});

		if (emptyInputs.length !== 0) {
			alert('Вы заполнили не все обязательные поля');
			return false;
		}

		if (!this.validatePhone(phoneVal)) {
			alert('Неверно введен номер телефона');
			this.inputPhone.classList.add('form_error');
			return false;
		} else {
			this.inputPhone.classList.remove('form_error');
		}

		if(!this.validateEmail(emailVal)) {
			alert('Неверно введет электронный адрес');
			this.inputEmail.classList.add('form_error');
			return false;
		} else {
			this.inputEmail.classList.remove('form_error');
		}

		if(!this.inputCheckbox.checked) {
			alert('Вы не дали согласие на обработку персональных данных')
			this.inputCheckbox.nextElementSibling.classList.add('form_error_checkbox');
			return false;
		} else {
			this.inputCheckbox.nextElementSibling.classList.remove('form_error_checkbox')
		}

		alert('Спасибо за отправку формы, с вами обязательно свяжутся')
	},

	validatePhone(phone) {
		let re = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
		return re.test(String(phone));
	},

	validateEmail(email) {
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	},
}

const scroll = {
	anchors: document.querySelectorAll('.table_btn'),

	toElement() {
		for (const anchor of this.anchors) {
			anchor.addEventListener('click', event => {
				event.preventDefault();

				const jobTitleText = event.target.parentElement.parentElement.parentElement
									.querySelector('.table_title_row');
				if (jobTitleText !== null) {
					document.querySelector('.form_select_post').textContent = jobTitleText.textContent;
				}

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
    dropZone: document.querySelector('.form_resume'),

    init() {
        this.upload();
        this.dropFoo();
    },

    dropFoo() {
        this.dropZone.addEventListener('dragenter', event => {
            event.preventDefault();
        })

        this.dropZone.addEventListener('dragleave', event => {
            event.preventDefault();
        })
        this.dropZone.addEventListener('dragover', event => {
            event.preventDefault();
        })

        this.dropZone.addEventListener('drop', event => {
            event.preventDefault();

            const nameFile = event.dataTransfer.files[0].name;

            this.resumeRender(nameFile);
        });
    },


	upload() {
		this.inputButton.addEventListener('change', event => {
            const nameFile = event.target.files[0].name;

			this.resumeRender(nameFile);
		});
	},

    resumeRender(fileName) {
        const nameVal = document.querySelector('.form_user_name').value;

        this.resumeEmpty.classList.add('resume_empty_toggle');
        this.resumeOk.classList.add('resume_ok_toggle');
        this.resumeTitle.textContent = nameVal + ' - ' + fileName;
    }
}

selectMenu.init();
formValidate.go();
scroll.toElement();
downloadResume.init();
