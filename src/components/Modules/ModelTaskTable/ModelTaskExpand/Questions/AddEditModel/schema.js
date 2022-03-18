import * as yup from "yup";

const schema = (questionType) =>
	yup.object().shape({
		caption: yup
			.string()
			.max(
				255,
				"The field Caption must be a string with a maximum length of 255"
			)
			.required("Caption is required"),
		type: yup.string().required("Type is required"),
		isCompulsory: yup.bool(),
		checkboxCaption: yup.string().when("type", {
			is: () => questionType === "B",
			then: yup.string().required("Checkbox Caption is required"),
		}),
		decimalPlaces: yup
			.number()
			.nullable()
			.when("type", {
				is: () => questionType === "N",
				then: yup.number().nullable().required("Decimal Places is required"),
			}),
		minValue: yup
			.number()
			.nullable()
			.when("type", {
				is: () => questionType === "N",
				then: yup.number().nullable().required("Minimum value is required"),
			}),
		maxValue: yup
			.number()
			.nullable()
			.when("type", {
				is: () => questionType === "N",
				then: yup.number().nullable().required("Maximum Value is required"),
			}),
	});

export default schema;
