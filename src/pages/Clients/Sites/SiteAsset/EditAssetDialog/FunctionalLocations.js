import React, { useState, useRef } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import ColourConstants from "helpers/colourConstants";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import {
	generateErrorState,
	getLocalStorageData,
	handleValidateObj,
} from "helpers/utils";
import { makeStyles } from "tss-react/mui";

import useOutsideClick from "hooks/useOutsideClick";
import {
	deleteSiteAssetReferences,
	updateSiteAssetReferences,
} from "services/clients/sites/siteAssets/references";
import "./edit.css";
import { connect, useDispatch } from "react-redux";
import { showError } from "redux/common/actions";

const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	description: yup
		.string("This field must be a string")
		.required("This field is required"),
	plannerGroup: yup
		.string("This field must be a string")
		.max(50, "Maximum 50 characters"),
	workCenter: yup
		.string("This field must be a string")
		.max(50, "Maximum 50 characters"),
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

const useStyles = makeStyles()((theme) => ({
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
	mainWrap: {
		padding: 10,
		background: "#f2f2f23d",
		borderRadius: 5,
		marginBottom: 15,
		border: "1px solid #f2f2f2",
	},
	formFields: { display: "flex", flexDirection: "column" },
}));

const FunctionalLocations = ({
	sub,
	setLoading,
	handleRemoveFuncLoc,
	handleUpdateFuncLoc,
	getError,
	error,
}) => {
	const ref = useRef();
	const { classes, cx } = useStyles();
	const [attemptDelete, setAttemptDelete] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [input, setInput] = useState(defaultInputSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const { customCaptions } = getLocalStorageData("me");
	const dispatch = useDispatch();

	// Click outside the component and set to false

	// Perform delete functional location
	const onDeleteApp = async () => {
		setAttemptDelete(true);
		// Adding progress indicator
		setLoading(true);

		try {
			const result = await deleteSiteAssetReferences(sub.id);
			if (result.status) {
				handleRemoveFuncLoc(sub.id);
				setLoading(false);
				return true;
			} else {
				throw new Error(result);
			}
		} catch (err) {
			setAttemptDelete(false);
			setLoading(false);
			dispatch(
				showError(`Failed to delete ${customCaptions?.assetReference}.`)
			);
		}
	};

	// Update Functional Location
	const handleEditFuncLoc = async () => {
		setLoading(true);

		try {
			let editedFunc = await updateSiteAssetReferences(sub.id, [
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
			]);
			if (editedFunc.status) {
				setLoading(false);
				setIsEdit(false);
				return { success: true };
			} else {
				if (editedFunc.data.detail) {
					getError(editedFunc.data.detail);
					return { success: false };
				} else {
					setErrors({ ...errors, ...editedFunc.data.errors });
					return { success: false };
				}
			}
		} catch (err) {
			// Handling duplicate subcat error

			// If no explicit errors provided, throws to caller
			throw new Error(err.response);
		}
	};

	const handleSubmit = async () => {
		// e.preventDefault();
		if (!error.status) {
			if (isEdit) {
				setLoading(true);
				setErrors(defaultErrorSchema);

				// Check if the input is same with previous one or not
				if (
					sub.name === input.name &&
					sub.description === input.description &&
					sub.workCenter === input.workCenter &&
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
					dispatch(
						showError(`Failed to add ${customCaptions?.assetReferencePlural}.`)
					);
				}
			}
		}
	};

	useOutsideClick(ref, () => handleSubmit(), "parentDiv");

	const handleShowEdit = () => {
		const main = { ...sub };
		delete main.id;
		delete main.siteAssetID;
		setInput(main);
		setIsEdit(true);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInput((th) => ({ ...th, [name]: value }));
	};

	return (
		<div ref={ref} className={classes.mainWrap}>
			{!isEdit && (
				<DeleteIcon className={classes.deleteIcon} onClick={onDeleteApp} />
			)}
			{isEdit && !attemptDelete ? (
				<form>
					<div className={classes.formFields} style={{ gap: 15 }}>
						<div className="desktopTableViewEdit">
							<Grid container spacing={2}>
								<Grid item sm={6}>
									<TextField
										sx={{
											"& .MuiInputBase-input.Mui-disabled": {
												WebkitTextFillColor: "#000000",
											},
										}}
										autoFocus
										fullWidth
										variant="outlined"
										name="name"
										label={customCaptions?.assetReference ?? "Name"}
										onChange={handleChange}
										value={input.name}
										error={errors.name === null ? false : true}
										helperText={errors.name === null ? null : errors.name}
										// onBlur={handleSubmit}
									/>
								</Grid>
								<Grid item sm={6}>
									<TextField
										sx={{
											"& .MuiInputBase-input.Mui-disabled": {
												WebkitTextFillColor: "#000000",
											},
										}}
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

										// onBlur={handleSubmit}
									/>
								</Grid>
								<Grid item sm={6}>
									<TextField
										sx={{
											"& .MuiInputBase-input.Mui-disabled": {
												WebkitTextFillColor: "#000000",
											},
										}}
										fullWidth
										variant="outlined"
										name="plannerGroup"
										label={customCaptions?.assetPlannerGroup ?? "Planner Group"}
										onChange={handleChange}
										value={input.plannerGroup}
										error={errors.plannerGroup === null ? false : true}
										helperText={
											errors.plannerGroup === null ? null : errors.plannerGroup
										}
										// onBlur={handleSubmit}
									/>
								</Grid>
								<Grid item sm={6}>
									<TextField
										sx={{
											"& .MuiInputBase-input.Mui-disabled": {
												WebkitTextFillColor: "#000000",
											},
										}}
										fullWidth
										variant="outlined"
										name="workCenter"
										label={customCaptions?.assetMainWorkCenter ?? "Work Center"}
										onChange={handleChange}
										value={input.workCenter}
										error={errors.workCenter === null ? false : true}
										helperText={
											errors.workCenter === null ? null : errors.workCenter
										}
										// onBlur={handleSubmit}
									/>
								</Grid>
							</Grid>
						</div>
						<div className="mobileTableViewEdit">
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										sx={{
											"& .MuiInputBase-input.Mui-disabled": {
												WebkitTextFillColor: "#000000",
											},
										}}
										fullWidth
										variant="outlined"
										name="name"
										label={customCaptions?.assetReference ?? "Name"}
										onChange={handleChange}
										value={input.name}
										error={errors.name === null ? false : true}
										helperText={errors.name === null ? null : errors.name}
										// onBlur={handleSubmit}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										sx={{
											"& .MuiInputBase-input.Mui-disabled": {
												WebkitTextFillColor: "#000000",
											},
										}}
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
										// onBlur={handleSubmit}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										sx={{
											"& .MuiInputBase-input.Mui-disabled": {
												WebkitTextFillColor: "#000000",
											},
										}}
										fullWidth
										variant="outlined"
										name="plannerGroup"
										label={customCaptions?.assetPlannerGroup ?? "Planner Group"}
										onChange={handleChange}
										value={input.plannerGroup}
										error={errors.plannerGroup === null ? false : true}
										helperText={
											errors.plannerGroup === null ? null : errors.plannerGroup
										}
										// onBlur={handleSubmit}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										sx={{
											"& .MuiInputBase-input.Mui-disabled": {
												WebkitTextFillColor: "#000000",
											},
										}}
										fullWidth
										variant="outlined"
										name="workCenter"
										label={customCaptions?.assetMainWorkCenter ?? "Work Center"}
										onChange={handleChange}
										value={input.workCenter}
										error={errors.workCenter === null ? false : true}
										helperText={
											errors.workCenter === null ? null : errors.workCenter
										}
										// onBlur={handleSubmit}
									/>
								</Grid>
							</Grid>
						</div>
					</div>
					{/* <input type="submit" style={{ display: "none" }} /> */}
				</form>
			) : (
				<div onClick={handleShowEdit}>
					<div className="desktopTableViewEdit">
						<Grid container spacing={2}>
							<Grid item sm={6}>
								<div className={classes.inputContainer}>
									<Typography className={classes.nameText}>
										{sub.name}
									</Typography>
								</div>
							</Grid>
							<Grid item sm={6}>
								<div className={classes.inputContainer}>
									<Typography className={classes.nameText}>
										{sub.description}
									</Typography>
								</div>
							</Grid>
							<Grid item sm={6}>
								<div className={classes.inputContainer}>
									<Typography className={classes.nameText}>
										{sub.plannerGroup}
									</Typography>
								</div>
							</Grid>
							<Grid item sm={6}>
								<div className={classes.inputContainer}>
									<Typography className={classes.nameText}>
										{sub.workCenter}
									</Typography>
								</div>
							</Grid>
						</Grid>
					</div>
					<div className="mobileTableViewEdit">
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<div className={classes.inputContainer}>
									<Typography className={classes.nameText}>
										{sub.name}
									</Typography>
								</div>
							</Grid>
							<Grid item xs={12}>
								<div className={classes.inputContainer}>
									<Typography className={classes.nameText}>
										{sub.description}
									</Typography>
								</div>
							</Grid>
							<Grid item xs={12}>
								<div className={classes.inputContainer}>
									<Typography className={classes.nameText}>
										{sub.plannerGroup}
									</Typography>
								</div>
							</Grid>
							<Grid item xs={12}>
								<div className={classes.inputContainer}>
									<Typography className={classes.nameText}>
										{sub.workCenter}
									</Typography>
								</div>
							</Grid>
						</Grid>
					</div>
				</div>
			)}
		</div>
	);
};
const mapStateToProps = ({ commonData: { error } }) => ({ error });

export default connect(mapStateToProps)(FunctionalLocations);
