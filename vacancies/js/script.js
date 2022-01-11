'use strict';

const selectMenu = {
	selectItems: document.querySelectorAll('.form_select'),

	init() {
        document.querySelector('body').addEventListener('click', event => {
            if ([...event.target.classList].includes('form_select')) {
                this.addRemoveDropDownBlock(event.target);
            } else if ([...event.target.classList].includes('text_in_block') || [...event.target.classList].includes('form_arrow')) {
                this.addRemoveDropDownBlock(event.target.parentElement);
            } else if ([...event.target.parentElement.classList].includes('form_arrow')) {
                this.addRemoveDropDownBlock(event.target.parentElement.parentElement);
            } else {
                for (let i = 0; i < this.selectItems.length; i++) {
                    const selectBlock = this.selectItems[i];
                    const dropOut = this.selectItems[i].nextElementSibling;

                    this.removeActiveClass(dropOut, selectBlock);
                }
            }
        });
	},

    addRemoveDropDownBlock(selectBlock) {
        let dropOut = selectBlock.nextElementSibling;

        if (![...dropOut.classList].includes('form_active')) {
            this.addActiveClass(dropOut, selectBlock);

            dropOut.childNodes[1].addEventListener('click', this.userSelectionFunc);
        } else {
            this.removeActiveClass(dropOut, selectBlock);
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

const jobSlider = {
	allVacancies: document.querySelectorAll('.table_row'),
	switchVacancies: document.querySelector('.leftright'),
	points: document.querySelectorAll('.leftright_point'),
	left: document.getElementById('arrow_left'),
	right: document.getElementById('arrow_right'),

	firstVisibleItem: 0,
	secondVisibleItem: 1,

	dotsList: [],
	activeDot: 0,

	init() {
		this.renderTable();
		this.activeSlider();

		this.switchVacancies.addEventListener('click', event => {
			if (event.target.id === 'arrow_left') {
				this.swipeLeft();
				this.flip();
			} else if (event.target.id === 'arrow_right') {
				this.swipeRight();
				this.flip();
			}

			if ([...event.target.classList].includes('leftright_point')) {
				this.firstVisibleItem = Number(event.target.id) * 2;
				this.secondVisibleItem = this.firstVisibleItem + 1;
				this.flip();
			}
		});
	},

	activeSlider() {
		const dots = Math.ceil(this.allVacancies.length / 2);
		if (dots > 1) {
			document.querySelector('.leftright_wrapper').classList.add('leftright_wrapper_active');

			this.renderDots(document.querySelector('.leftright_points'), dots);

			this.dotsList = document.querySelectorAll('.leftright_point');
		}
	},

	renderDots(block, quantityDots) {
		for(let i = 0; i < quantityDots; i++) {
			block.insertAdjacentHTML('beforeend', `<div id=${i} class="leftright_point"></div>`);
		}

		block.querySelector('.leftright_point').classList.add('point_active');
	},

	flip() {
		this.renderTable();
		this.recolorDot();
	},

	renderTable() {
		this.allVacancies.forEach((el) => {
			el.classList.remove('row_disable');
			setTimeout(() => {el.classList.add('table_row_visible')}, 0);
		});

		this.allVacancies.forEach((el, i) => {
			if (i !== this.firstVisibleItem && i !== this.secondVisibleItem) {
				el.classList.add('row_disable');
				setTimeout(() => {el.classList.remove('table_row_visible')}, 0);
			}
		});
	},

	swipeLeft() {
		if (this.firstVisibleItem === 0 && this.allVacancies.length % 2 != 0) {
			this.firstVisibleItem = this.allVacancies.length - 1;
			this.secondVisibleItem = this.allVacancies.length;
		} else if (this.firstVisibleItem === 0 && this.allVacancies.length % 2 === 0) {
			this.firstVisibleItem = this.allVacancies.length - 2;
			this.secondVisibleItem = this.allVacancies.length - 1;
		} else {
			this.firstVisibleItem -= 2;
			this.secondVisibleItem -= 2;
		}
	},

	swipeRight() {
		if (this.firstVisibleItem === this.allVacancies.length - 1) {
			this.firstVisibleItem = 0;
			this.secondVisibleItem = 1;
		} else if (this.secondVisibleItem === this.allVacancies.length - 1) {
			this.firstVisibleItem = 0;
			this.secondVisibleItem = 1;
		} else {
			this.firstVisibleItem += 2;
			this.secondVisibleItem += 2;
		}
	},

	recolorDot() {
		this.dotsList[this.activeDot].classList.remove('point_active');

		this.activeDot = Math.ceil((this.firstVisibleItem) / 2);

		this.dotsList[this.activeDot].classList.add('point_active');
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
        this.resumeEmpty.classList.add('resume_empty_toggle');
        this.resumeOk.classList.add('resume_ok_toggle');
        this.resumeTitle.textContent = fileName;
    }
}

selectMenu.init();
formValidate.go();
jobSlider.init();
scroll.toElement();
downloadResume.init();
