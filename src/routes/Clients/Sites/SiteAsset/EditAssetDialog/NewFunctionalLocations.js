import React, { useState } from "react";
import { makeStyles, TextField } from "@material-ui/core";
import * as yup from "yup";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import { generateErrorState, handleValidateObj } from "helpers/utils";

const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	description: yup
		.string("This field must be a string")
		.required("This field is required"),
	plannerGroup: yup
		.string("This field must be a string")
		.required("This field is required"),
	workCenter: yup
		.string("This field must be a string")
		.required("This field is required"),
});
const defaultInputSchema = {
	name: "",
	description: "",
	plannerGroup: "",
	workCenter: "",
};
const defaultErrorSchema = {
	name: null,
	description: null,
	plannerGroup: null,
	workCenter: null,
};

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		alignItems: "center",
		width: "100%",
		marginBottom: 10,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: ColourConstants.commonBorder,
		borderRadius: 5,
		paddingLeft: 10,
		paddingTop: 12,
		paddingBottom: 12,
	},
}));
const NewFunctionalLocations = ({
	editData,
	setLoading,
	handleAddFunctional,
}) => {
	const classes = useStyles();
	const [input, setInput] = useState(defaultInputSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	const closeOverride = () => {
		setLoading(false);
		setErrors(defaultErrorSchema);
		setInput(defaultInputSchema);
	};

	const handleCreateFuncLocations = async () => {
		try {
			let addedFunc = await API.post(`${BASE_API_PATH}SiteAssetReferences`, {
				siteAssetID: editData.id,
				name: input.name,
				description: input.description,
				plannerGroup: input.plannerGroup,
				workCenter: input.workCenter,
			});
			if (addedFunc.status === 201) {
				handleAddFunctional(editData.id, addedFunc.data, input);
				return { success: true };
			} else {
				throw new Error(addedFunc);
			}
		} catch (err) {
			// Handling duplicate subcat error
			if (
				err.response.data.detail !== undefined ||
				err.response.data.detail !== null
			) {
				setErrors({
					...errors,
					...{
						name: err.response.data.detail,
						description: err.response.data.detail,
						plannerGroup: err.response.data.detail,
						workCenter: err.response.data.detail,
					},
				});
				return { success: false };
			}

			// Handling other errors
			if (err.response.data.errors !== undefined) {
				setErrors({ ...errors, ...err.response.data.errors });
				return { success: false };
			} else {
				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}
		}
	};

	const saveFuncLoc = async () => {
		setLoading(true);
		setErrors(defaultErrorSchema);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const updateData = await handleCreateFuncLocations();
				if (updateData.success) {
					closeOverride();
				} else {
					setLoading(false);
				}
			} else {
				const newError = generateErrorState(localChecker);
				setErrors({ ...errors, ...newError });
				setLoading(false);
			}
		} catch (err) {
			closeOverride();
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			saveFuncLoc();
		}
	};

	return (
		<div>
			<div className={classes.container}>
				<TextField
					fullWidth
					name="name"
					label="Name"
					onKeyDown={handleEnterPress}
				/>
			</div>
			<div className={classes.container}>
				<TextField
					fullWidth
					name="description"
					label="Description"
					onKeyDown={handleEnterPress}
				/>
			</div>
			<div className={classes.container}>
				<TextField
					fullWidth
					name="plannerGroup"
					label="Planner Group"
					onKeyDown={handleEnterPress}
				/>
			</div>
			<div className={classes.container}>
				<TextField
					fullWidth
					name="workCenter"
					label="Work Center"
					onKeyDown={handleEnterPress}
				/>
			</div>
		</div>
	);
};

export default NewFunctionalLocations;
