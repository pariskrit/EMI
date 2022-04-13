import { changeDate } from "./date";

export const handleSort = (
	currentState,
	stateSetter,
	sortField,
	sortMethod
) => {
	let sorted = [...currentState];

	sorted.sort((a, b) =>
		a[sortField]?.toString().localeCompare(b[sortField]?.toString())
	);

	if (sortMethod === "desc") sorted = sorted.reverse();

	stateSetter(sorted);

	return true;
};

export const handleLocalValidate = (schema, checkField, checkData) => {
	return schema
		.validateAt(checkField, { [checkField]: checkData })
		.then(() => {
			// Passes validation
			return { valid: true };
		})
		.catch((err) => {
			// Failed validation
			if (err.name === "ValidationError") {
				return { valid: false, error: err.errors };
			}

			return { valid: true };
		});
};

export const handleValidateObj = async (schema, inputObj) => {
	const getValids = async (items) => {
		return Promise.all(
			items.map((item) => {
				return handleLocalValidate(schema, item, inputObj[item]).then((res) => {
					return { ...res, input: item };
				});
			})
		);
	};

	return await getValids(Object.keys(inputObj));
};

export const generateErrorState = (localValidationArr) => {
	let newErrors = {};

	localValidationArr.forEach((validated) => {
		if (validated.valid) {
			newErrors[validated.input] = null;
		} else {
			newErrors[validated.input] = validated.error;
		}
	});

	return newErrors;
};

export const checkIsFileImageType = (fileName) => {
	const splittedFile = fileName?.split(".");
	const fileType = splittedFile[splittedFile?.length - 1];
	const imageTypes = ["gif", "jpeg", "png", "jpg"];
	return imageTypes.includes(fileType);
};

export const changeDateFormat = (date) => {
	const oldFormat = date.split("T");
	const newDate = oldFormat[0].split("-");
	const time = oldFormat[1].split(".");
	return `${newDate[1]}/${newDate[2]}/${newDate[0]} ${time[0]}`;
};

export function formatAMPM(date) {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	let strTime = hours + ":" + minutes + " " + ampm;
	return strTime;
}

export const isoDateWithoutTimeZone = (date) => {
	if (date == null) return date;
	date = new Date(date);

	const localDateAndTime = `${changeDate(date)} ${formatAMPM(date)}`;
	return localDateAndTime;
};

export const checkIfVisibleInViewPort = (el) => {
	const rect = el?.getBoundingClientRect();
	if (rect) {
		const viewHeight = Math.max(
			document.documentElement.clientHeight,
			window.innerHeight
		);
		return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
	}
	return false;
};

export const getFormattedLink = (link) => {
	let formattedlink = link?.trim();
	if (!/^https?:\/\//i.test(link)) {
		formattedlink = "https://" + link;
	}
	return formattedlink;
};
