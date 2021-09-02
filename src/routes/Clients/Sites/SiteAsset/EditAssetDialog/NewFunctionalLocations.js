import React, { useState } from "react";
import { Card, makeStyles, TextField } from "@material-ui/core";
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
	setIsAddNew,
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

	const saveFuncLoc = async (e) => {
		e.preventDefault();
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInput((th) => ({ ...th, [name]: value }));
	};

	const handleClose = (e) => {
		closeOverride();
		setIsAddNew(false);
	};

	return (
		<div tabIndex={0} onBlur={handleClose}>
			<form onSubmit={saveFuncLoc}>
				<div className={classes.container}>
					<TextField
						fullWidth
						name="name"
						label="Name"
						onChange={handleChange}
						value={input.name}
						error={errors.name === null ? false : true}
						helperText={errors.name === null ? null : errors.name}
					/>
				</div>
				<div className={classes.container}>
					<TextField
						fullWidth
						name="description"
						label="Description"
						onChange={handleChange}
						value={input.description}
						error={errors.description === null ? false : true}
						helperText={errors.description === null ? null : errors.description}
					/>
				</div>
				<div className={classes.container}>
					<TextField
						fullWidth
						name="plannerGroup"
						label="Planner Group"
						onChange={handleChange}
						value={input.plannerGroup}
						error={errors.plannerGroup === null ? false : true}
						helperText={
							errors.plannerGroup === null ? null : errors.plannerGroup
						}
					/>
				</div>
				<div className={classes.container}>
					<TextField
						fullWidth
						name="workCenter"
						label="Work Center"
						onChange={handleChange}
						value={input.workCenter}
						error={errors.workCenter === null ? false : true}
						helperText={errors.workCenter === null ? null : errors.workCenter}
					/>
				</div>
				<input type="submit" style={{ display: "none" }} />
			</form>
		</div>
	);
};

export default NewFunctionalLocations;
