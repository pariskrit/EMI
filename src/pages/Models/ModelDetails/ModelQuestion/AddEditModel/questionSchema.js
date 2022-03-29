import * as yup from "yup";

const questionSchema = (questionType, questionTiming) =>
	yup.object().shape({
		caption: yup
			.string("This field must be a string")
			.max(
				255,
				"The field Caption must be a string with a maximum length of 255"
			)
			.required("Caption is required"),
		type: yup
			.string("This field must be a string")
			.required("Type is required"),
		timing: yup
			.string("This field must be a string")
			.required("Timing is required"),
		isCompulsory: yup.bool(),
		roles: yup.array().of(yup.number()).min(1, "Role is required"),
		decimalPlaces: yup
			.number()
			.nullable()
			.when("type", {
				is: () => questionType === "N",
				then: yup
					.number()
					.typeError("Decimal Places is required")
					.required("Decimal Places is required"),
			}),
		checkboxCaption: yup.string("This field must be a string").when("type", {
			is: () => questionType === "B",
			then: yup.string().required("Please Provide Checkbox caption"),
		}),
		modelVersionStageID: yup
			.number()
			.nullable(true)
			.when("timing", {
				is: () => questionTiming === "S",
				then: yup.number().nullable().required("Please Select Model Stage"),
			}),
		modelVersionZoneID: yup
			.number()
			.nullable(true)
			.when("timing", {
				is: () => questionTiming === "Z",
				then: yup.number().nullable().required("Please Select Model Zone"),
			}),
		options: yup
			.array()
			.of(yup.string())
			.when("type", {
				is: () => questionType === "O" || questionType === "C",
				then: yup.array().of(yup.string()).min(1, "Option is required"),
			}),
	});

export default questionSchema;
