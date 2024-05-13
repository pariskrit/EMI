import { CONTENTDISPOSITION } from "constants/ResponseHeaders";
import {
	HistoryCaptions,
	HistoryProperty,
	HistoryPropertyCode,
	pageSize,
	Months,
} from "./constants";
import { changeDate, materialUiDate } from "./date";
import { serviceGarphId } from "constants/serviceDetails";

export const handleSort = (
	currentState,
	stateSetter,
	sortField,
	sortMethod
) => {
	let sorted = [...currentState];

	if (sortMethod === "asc") {
		sorted.sort((a, b) =>
			(a[sortField]?.toString() || "").localeCompare(
				b[sortField]?.toString() || ""
			)
		);
	}

	if (sortMethod === "desc") {
		sorted.sort((a, b) =>
			(b[sortField]?.toString() || "").localeCompare(
				a[sortField]?.toString() || ""
			)
		);
	}

	stateSetter(sorted);

	return true;
};

export const NumericSort = (
	currentState,
	stateSetter,
	sortField,
	sortMethod
) => {
	let sorted = [...currentState];

	if (sortMethod === "asc") {
		sorted.sort((a, b) => a[sortField] - b[sortField]);
	}

	if (sortMethod === "desc") {
		sorted.sort((a, b) => b[sortField] - a[sortField]);
	}

	stateSetter(sorted);

	return sorted;
};

export const sortData = (data, sortField, sortMethod) => {
	let sorted = [...data];

	sorted.sort((a, b) =>
		a[sortField]?.toString().localeCompare(b[sortField]?.toString())
	);

	if (sortMethod === "desc") sorted = sorted.reverse();

	return sorted;
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

export const commonScrollElementIntoView = (uniqueId, className = "") => {
	const element = document.getElementById(uniqueId);

	const allElements = document.querySelectorAll(`.${className}`);

	allElements.forEach((item) => (item.style.background = ""));

	const tableElement = document.getElementById(
		"table-scroll-wrapper-container"
	);

	if (element) {
		const tableTop = tableElement?.getBoundingClientRect().top;
		const elTop = element?.getBoundingClientRect().top;
		let topPos;

		topPos =
			elTop > tableTop ? elTop - tableTop - 45 : -(tableTop - elTop) - 50;

		tableElement.scrollBy({
			behavior: "smooth",
			top: topPos,
		});

		element.style.background = "#ffeb3b";
	}
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

export function twentyFourHrFormat(date) {
	let hours = date.getHours();
	if (hours < 10) {
		hours = `0${hours}`;
	}
	let minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	let strTime = `${hours}:${minutes}`;
	return strTime;
}

export const isoDateWithoutTimeZone = (date) => {
	if (date == null) return date;
	date = new Date(date);

	const localDateAndTime = `${changeDate(date)} ${formatAMPM(date)}`;
	return localDateAndTime;
};

export const isoDateFormat = (date) => {
	if (date == null) return date;
	date = new Date(date);

	const localDateAndTime = `${materialUiDate(date)}T${twentyFourHrFormat(
		date
	)}`;
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

export const makeTableAutoScrollAndExpand = (data) => {
	setTimeout(() => {
		if (document.getElementById(`taskExpandable${data}`)) {
			document.getElementById(`taskExpandable${data}`).scrollIntoView({
				behavior: "smooth",
				block: "center",
				top:
					document
						.getElementById(`taskExpandable${data}`)
						.getBoundingClientRect().bottom + window.pageYOffset,
			});

			setTimeout(() => {
				document.getElementById(`taskExpandable${data}`).click();
				setTimeout(() => {
					document.getElementById(`taskExpanded${data}`).scrollIntoView({
						behavior: "smooth",
						block: "end",
						// inline: "center",
					});
				}, 1000);
			}, 500);
		}
	}, 500);
};

export const isChrome = () => {
	return (
		/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
	);
};

export const sortFromDate = (data = [], sortField) => {
	return data?.sort(function (a, b) {
		return new Date(a[sortField]) - new Date(b[sortField]);
	});
};

export const csvFileToArray = (string) => {
	const csvHeader = string?.slice(0, string?.indexOf("\n"))?.split(",");
	const csvRows = string?.slice(string?.indexOf("\n") + 1)?.split("\n");

	const array = csvRows?.map((i) => {
		const values = i?.split(",");
		const obj = csvHeader.reduce((object, header, index) => {
			object[header] = values[index];
			return object;
		}, {});
		return obj;
	});

	return array;
};

export const convertDateToUTC = (date) => {
	return new Date(date.getTime()).toJSON();
};

export const customFromattedDate = (customDate) => {
	return {
		fromDate: convertDateToUTC(
			new Date(
				new Date(
					customDate.from > customDate.to ? customDate.to : customDate.from
				).setHours(0, 0, 0, 0)
			)
		),
		toDate: convertDateToUTC(
			new Date(
				new Date(
					customDate.from > customDate.to ? customDate.from : customDate.to
				).setHours(23, 59, 59, 999)
			)
		),
	};
};

export const debounce = (func, delay) => {
	let timer;
	return function () {
		let self = this;
		let args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(self, args);
		}, delay);
	};
};

export function roundedToFixed(input, digits) {
	var rounded = Math.pow(10, digits);
	return Math.round(input * rounded) / rounded;
}

export function currentUTCDateTime() {
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	now.setSeconds(0);
	now.setMilliseconds(0);
	return now.toISOString().slice(0, -1);
}

export function MuiFormatDate(d) {
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

export const getLocalStorageData = (type) => {
	let storage = sessionStorage.getItem(type) || localStorage.getItem(type);

	try {
		return JSON.parse(storage);
	} catch (error) {
		storage = JSON.stringify(
			sessionStorage.getItem(type) || localStorage.getItem(type)
		);
		return JSON.parse(storage);
	}
};

export const dateDifference = (end, start) => {
	if (end === null || start === null) return "";
	// get total seconds between the times
	let delta = Math.abs(new Date(end) - new Date(start)) / 1000;

	// calculate (and subtract)  days
	let days = Math.floor(delta / 86400);
	delta -= days * 86400;

	// calculate (and subtract)  hours
	let hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;

	// calculate (and subtract)  minutes
	let minutes = Math.floor(delta / 60) % 60;

	return `${days === 0 ? "" : days === 1 ? `${days} day` : `${days} days`} ${
		hours === 0 ? "" : hours === 1 ? `${hours} hr` : `${hours} hrs`
	} ${
		minutes === 0
			? "0 mins"
			: minutes === 1
			? `${minutes} min`
			: `${minutes} mins`
	} `;
};

export function toRoundoff(number) {
	const toSingle = Number.isInteger(number) ? number : +number.toFixed(1);
	return toSingle;
}

export function formatBytes(bytes, decimals = 2) {
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["B", "KB", "MB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const coalesc = (val) => {
	return val ?? "";
};

export const defaultPageSize = () => {
	const height = window.innerHeight;
	if (height > 1200) {
		return pageSize.LARGE_SIZE;
	} else if (height > 769) {
		return pageSize.MEDIUM_SIZE;
	} else {
		return pageSize.SMALL_SIZE;
	}
};

export const dyanamicCellSize = (columnsLength) => {
	return { width: `${100 / columnsLength}%` };
};

export const analyticsStartDate = (year, month) => {
	return `${year}-${month}-01T00:00:00.000Z `;
};

export const analyticsEndtDate = (year, month) => {
	return `${year}-${month}-${new Date(
		year,
		month,
		0
	).getDate()}T00:00:00.000Z `;
};

export const groupBy = function (xs, key) {
	return xs?.reduce(function (rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
};

export const FilterStatusChange = (service, changeReason, customCaptions) => {
	if (service?.status === "T") {
		return changeReason.filter((d) => d.name === "Incomplete");
	}

	return changeReason.filter((x) => {
		if (x.showIn === service?.status) return x;
		return false;
	});
};

export const fileDownload = (response, fileName) => {
	const href = URL.createObjectURL(response.data);

	// create "a" HTML element with href to file & click
	const link = document.createElement("a");
	link.href = href;
	link.setAttribute("download", fileName); //or any other extension
	document.body.appendChild(link);
	link.click();

	// clean up "a" element & remove ObjectURL
	document.body.removeChild(link);
	URL.revokeObjectURL(href);
};

export const getFileNameFromContentDispositonHeader = (response) => {
	return response?.headers?.[CONTENTDISPOSITION]?.split(";")?.[1]?.split(
		"="
	)?.[1];
};

export const htmlToPlainText = (html) => {
	var temporaryElement = document.createElement("div");
	temporaryElement.innerHTML = html;
	return temporaryElement.textContent || temporaryElement.innerText || "";
};

export const historyFinalData = ({
	value,
	statuses,
	data,
	customCaptions,
	origin,
}) => {
	if (
		statuses === HistoryProperty.serviceStatus &&
		data?.propertyName === "Status"
	)
		return HistoryPropertyCode(statuses, customCaptions)[value];
	else if (
		[
			HistoryCaptions.modelVersionTasks,
			HistoryCaptions.modelVersionQuestions,
		].includes(origin) &&
		["Timing", "Type"].includes(data?.propertyName)
	)
		return HistoryPropertyCode(
			data?.propertyName === "Timing"
				? HistoryProperty.questionTiming
				: HistoryProperty.questionType,
			customCaptions
		)[value];
	else if (typeof value === "boolean") return Boolean(value) ? "Yes" : "No";
	else return value;
};

//custom date when date range is small
export const handleCustomDateRange = (axisHeight, data) => {
	const startDate = new Date(
		Math.min(...data.slice(1).map((d) => new Date(d[3])))
	);
	const endDate = new Date(
		Math.max(...data.slice(1).map((d) => new Date(d[4])))
	);

	const timeDiff = (endDate - startDate) / (1000 * 3600 * 24);
	const svgContainer = document.querySelector(
		`#${serviceGarphId} svg g:nth-child(3)`
	);
	const textDOM = svgContainer.querySelectorAll("text");
	const TIME_DIFF = Math.floor(timeDiff);
	if (timeDiff <= 5) {
		axisHeight.current = {
			...axisHeight.current,
			xFinal: textDOM[textDOM.length - 1]?.getAttribute("x"),
		};

		textDOM.forEach((d, i) => {
			const firstX = i === 0 && d?.getAttribute("x");
			const firstY = i === 0 && d?.getAttribute("y");
			const xGaps =
				(axisHeight.current.xFinal - axisHeight.current.x) /
				Math.floor(timeDiff);

			axisHeight.current =
				i === 0
					? { ...axisHeight.current, x: firstX, y: firstY }
					: axisHeight.current;

			const yheight = axisHeight.current.y;
			let xHeight =
				i === 0
					? firstX
					: i === Math.floor(timeDiff)
					? axisHeight.current?.xFinal
					: parseInt(axisHeight.current.x) + i * xGaps;
			if (TIME_DIFF <= 2) {
				xHeight = xHeight - 18;
			}

			if (TIME_DIFF > 2 && TIME_DIFF <= 5) {
				xHeight = xHeight + 25;
			}
			const requiredDate = `${
				Months[new Date(startDate.getTime() + i * 3600000 * 24).getMonth()]
			} ${new Date(startDate.getTime() + i * 3600000 * 24).getDate()}`;

			d.remove();
			if (i <= Math.floor(timeDiff)) {
				var newtxt = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"text"
				);
				newtxt.setAttribute("y", yheight);
				newtxt.setAttribute("x", xHeight);
				newtxt.setAttribute("fill", "black");
				newtxt.setAttribute("font-size", "13px");
				newtxt.setAttribute("font-weight", "normal");
				newtxt.textContent = requiredDate;
				svgContainer.appendChild(newtxt);
			}
		});
	} else {
		textDOM.forEach((d) => {
			if (d.textContent.includes("/")) {
				const tempData = d.textContent.split("/");
				d.textContent = `${tempData[1]}/${tempData[0].trim()}`;
			}
		});
	}
};
