'use strict';

const dropDownList = document.querySelectorAll('.form_select');

for (const el of dropDownList) {
	const arrow = el.querySelectorAll('.form_arrow')
	el.addEventListener('click', () => {
		el.nextElementSibling.classList.toggle('form_active');
		el.childNodes[3].classList.toggle('form_arrov_active');
	});
}
