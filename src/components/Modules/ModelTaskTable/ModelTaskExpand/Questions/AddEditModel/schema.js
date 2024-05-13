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
			then: () => yup.string().required("Checkbox Caption is required"),
		}),
		decimalPlaces: yup
			.number()
			.nullable()
			.when("type", {
				is: () => questionType === "N",
				then: () =>
					yup
						.number()
						.nullable()
						.typeError("Decimal Places is required")
						.required("Decimal Places is required"),
			}),
		minValue: yup
			.number()
			.nullable()
			.when("type", {
				is: () => questionType === "N",
				then: () => yup.number().nullable(),
			}),
		maxValue: yup
			.number()
			.nullable()
			.when("type", {
				is: () => questionType === "N",
				then: () => yup.number().nullable(),
			}),
		options: yup
			.array()
			.of(yup.object())
			.nullable()
			.when("type", {
				is: () => questionType === "O" || questionType === "C",
				then: () =>
					yup
						.array()
						.of(yup.object())
						.min(1, "Option is required")
						.required("Option is required")
						.nullable(),
			}),
	});

export default schema;
