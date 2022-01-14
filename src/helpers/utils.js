import roles from "helpers/roles";

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

export const setLocalStorage = (res) => {
	localStorage.setItem("token", res.jwtToken);
	let response = res;
	if (response.position === null && response.isAdmin === true) {
		response["role"] = roles.superAdmin;
	}
	if (response.position !== null && response.isAdmin === true) {
		response["role"] = roles.clientAdmin;
	}
	if (response.position !== null && response.isAdmin === false) {
		response["role"] = roles.siteUser;
	}
	localStorage.setItem("me", JSON.stringify(response));
};
