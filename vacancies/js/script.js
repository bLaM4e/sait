'use strict';

const dropDownList = document.querySelectorAll('.form_select');

for (const el of dropDownList) {
	el.addEventListener('click', event => {
	event.target.nextElementSibling.classList.toggle('form_active');
	event.target.childNodes[3].classList.toggle('form_arrov_active');
	});
}

