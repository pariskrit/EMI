import React, { useState, useEffect, useRef } from "react";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import * as yup from "yup";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import { BASE_API_PATH } from "helpers/constants";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import useOutsideClick from "hooks/useOutsideClick";

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
	inputContainer: {
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
	nameInput: {
		marginTop: 2,
		marginBottom: 2,
		color: ColourConstants.commonText,
		width: "80%",
		fontFamily: "Roboto",
		fontSize: 14,
		border: "none",
		boxShadow: "none",
	},
	nameText: {
		color: ColourConstants.commonText,
		fontFamily: "Roboto",
		fontSize: 14,
	},
	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
		float: "right",
	},
}));

const FunctionalLocations = ({
	sub,
	setLoading,
	handleRemoveFuncLoc,
	handleUpdateFuncLoc,
}) => {
	const ref = useRef();
	const classes = useStyles();
	const [attemptDelete, setAttemptDelete] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [input, setInput] = useState(defaultInputSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	// Click outside the component and set to false
	useOutsideClick(ref, () => setIsEdit(false));

	useEffect(() => {
		const main = { ...sub };
		delete main.id;
		delete main.siteAssetID;
		setInput(main);
	}, [sub]);

	// Perform delete functional location
	const onDeleteApp = async () => {
		setAttemptDelete(true);
		// Adding progress indicator
		setLoading(true);
		try {
			const result = API.delete(
				`${BASE_API_PATH}SiteAssetReferences/${sub.id}`
			);
			if (result.status === 200) {
				handleRemoveFuncLoc(sub.id);
				setLoading(false);
				return true;
			} else {
				throw new Error(result);
			}
		} catch (err) {
			console.log(err);
			setAttemptDelete(false);
			setLoading(false);
			return false;
		}
	};

	// Update Functional Location
	const handleEditFuncLoc = async () => {
		setLoading(true);
		try {
			let editedFunc = await API.patch(
				`${BASE_API_PATH}SiteAssetReferences/${sub.id}`,
				[
					{
						op: "replace",
						path: "name",
						value: input.name,
					},
					{
						op: "replace",
						path: "description",
						value: input.description,
					},
					{
						op: "replace",
						path: "plannerGroup",
						value: input.plannerGroup,
					},
					{
						op: "replace",
						path: "workCenter",
						value: input.workCenter,
					},
				]
			);
			if (editedFunc.status === 200 || editedFunc.status === 201) {
				return { success: true };
			} else {
				throw new Error(editedFunc);
			}
		} catch (err) {
			// Handling duplicate subcat error
			if (
				err.response.data.detail !== undefined ||
				err.response.data.detail !== null
			) {
				setErrors({
					name: err.response.data.detail,
					description: err.response.data.detail,
					plannerGroup: err.response.data.detail,
					workCenter: err.response.data.detail,
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrors(defaultErrorSchema);

		// Check if the input is same with previous one or not
		if (
			sub.name === input.name ||
			sub.description === input.description ||
			sub.workCenter === input.workCenter ||
			sub.plannerGroup === input.plannerGroup
		) {
			setIsEdit(false);
			setLoading(false);
			return true;
		}
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const updateData = await handleEditFuncLoc();
				if (updateData.success) {
					handleUpdateFuncLoc({
						id: sub.id,
						siteAssetID: sub.siteAssetID,
						...input,
					});
					setLoading(false);
					setIsEdit(false);
				} else {
					setLoading(false);
				}
			} else {
				const newError = generateErrorState(localChecker);
				setErrors({ ...errors, ...newError });
				setLoading(false);
			}
		} catch (err) {
			setIsEdit(false);
			setLoading(false);
		}
	};

	const handleShowEdit = () => {
		setInput(sub);
		setIsEdit(true);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInput((th) => ({ ...th, [name]: value }));
	};

	return (
		<>
			{isEdit && !attemptDelete ? (
				<div ref={ref}>
					<form onSubmit={handleSubmit}>
						<div className={classes.inputContainer}>
							<TextField
								fullWidth
								variant="outlined"
								name="name"
								label="Name"
								onChange={handleChange}
								value={input.name}
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
							/>
						</div>
						<div className={classes.inputContainer}>
							<TextField
								fullWidth
								variant="outlined"
								name="description"
								label="Description"
								onChange={handleChange}
								value={input.description}
								error={errors.description === null ? false : true}
								helperText={
									errors.description === null ? null : errors.description
								}
							/>
						</div>
						<div className={classes.inputContainer}>
							<TextField
								fullWidth
								variant="outlined"
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
						<div className={classes.inputContainer}>
							<TextField
								fullWidth
								variant="outlined"
								name="workCenter"
								label="Work Center"
								onChange={handleChange}
								value={input.workCenter}
								error={errors.workCenter === null ? false : true}
								helperText={
									errors.workCenter === null ? null : errors.workCenter
								}
							/>
						</div>
						<input type="submit" style={{ display: "none" }} />
					</form>
				</div>
			) : (
				<div onClick={handleShowEdit}>
					<DeleteIcon className={classes.deleteIcon} onClick={onDeleteApp} />
					<div className={classes.inputContainer}>
						<Typography className={classes.nameText}>{sub.name}</Typography>
					</div>
					<div className={classes.inputContainer}>
						<Typography className={classes.nameText}>
							{sub.description}
						</Typography>
					</div>
					<div className={classes.inputContainer}>
						<Typography className={classes.nameText}>
							{sub.plannerGroup}
						</Typography>
					</div>
					<div className={classes.inputContainer}>
						<Typography className={classes.nameText}>
							{sub.workCenter}
						</Typography>
					</div>
				</div>
			)}
		</>
	);
};

export default FunctionalLocations;
