export function changeDate(d) {
	const date = new Date(d);
	let dd = date.getDate();
	let mm = date.getMonth() + 1;
	const yyyy = date.getFullYear();
	if (dd < 10) {
		dd = `0${dd}`;
	}
	if (mm < 10) {
		mm = `0${mm}`;
	}
	return `${dd}/${mm}/${yyyy}`;
}

export function headerDateFormat(d) {
	const date = new Date(d);
	let dd = date.getDate();
	let mm = date.getMonth() + 1;
	const hh = date.getHours();
	const min = date.getMinutes();
	const yyyy = date.getFullYear();
	if (dd < 10) {
		dd = `0${dd}`;
	}
	if (mm < 10) {
		mm = `0${mm}`;
	}
	return `${dd}.${mm}.${yyyy} / ${hh}:${min} AEDT`;
}

export function materialUiDate(d) {
	const date = new Date(d);
	let dd = date.getDate();
	let mm = date.getMonth() + 1;
	const yyyy = date.getFullYear();
	if (dd < 10) {
		dd = `0${dd}`;
	}
	if (mm < 10) {
		mm = `0${mm}`;
	}
	return `${yyyy}-${mm}-${dd}`;
}

export function startOfDay() {
	return new Date(new Date().setHours(0, 0, 0, 0));
}

export function endOfDay() {
	return new Date(new Date().setHours(23, 59, 59, 999));
}
