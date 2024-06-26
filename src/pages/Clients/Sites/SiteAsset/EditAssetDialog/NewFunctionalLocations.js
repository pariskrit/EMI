import React, { useState, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { Grid, TextField } from "@mui/material";
import * as yup from "yup";
import ColourConstants from "helpers/colourConstants";
import {
	generateErrorState,
	getLocalStorageData,
	handleValidateObj,
} from "helpers/utils";
import { makeStyles } from "tss-react/mui";

import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import { postSiteAssetReferences } from "services/clients/sites/siteAssets/references";
import useOutsideClick from "hooks/useOutsideClick";
import { showError } from "redux/common/actions";

const schema = yup.object().shape({
	name: yup
		.string("This field must be a string")
		.required("This field is required")
		.max(50, "Maximum 50 characters"),
	description: yup
		.string("This field must be a string")
		.required("This field is required")
		.max(255, "Maximum 255 characters "),
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
}));
const NewFunctionalLocations = ({
	editData,
	setLoading,
	setIsAddNew,
	handleAddFunctional,
	getError,
	error,
}) => {
	const childRef = useRef(null);
	const { classes, cx } = useStyles();
	const [input, setInput] = useState(defaultInputSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const { customCaptions } = getLocalStorageData("me");
	const dispatch = useDispatch();

	const closeOverride = () => {
		setLoading(false);
		setErrors(defaultErrorSchema);
		setInput(defaultInputSchema);
	};

	const handleCreateFuncLocations = async () => {
		try {
			let addedFunc = await postSiteAssetReferences({
				siteAssetID: editData.id,
				name: input.name,
				description: input.description,
				plannerGroup: input.plannerGroup,
				workCenter: input.workCenter,
			});
			if (addedFunc.status) {
				handleAddFunctional({
					siteAssetID: editData.id,
					id: addedFunc.data,
					...input,
				});
				return { success: true };
			} else {
				if (addedFunc.data.detail) {
					getError(addedFunc.data.detail);
					return { success: false };
				} else {
					setErrors({ ...errors, ...addedFunc.data.errors });
					return { success: false };
				}
			}
		} catch (err) {
			// Handling duplicate subcat error
			throw new Error(err.response);
		}
	};

	const saveFuncLoc = async () => {
		// e.preventDefault();
		if (!error.status) {
			setLoading(true);
			setErrors(defaultErrorSchema);
			try {
				const localChecker = await handleValidateObj(schema, input);
				if (!localChecker.some((el) => el.valid === false)) {
					const updateData = await handleCreateFuncLocations();
					if (updateData.success) {
						closeOverride();
						setIsAddNew(false);
					} else {
						setLoading(false);
					}
				} else {
					const newError = generateErrorState(localChecker);
					setErrors({ ...errors, ...newError });
					setLoading(false);
				}
			} catch (err) {
				dispatch(showError(`Failed to save function location.`));
			}
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInput((th) => ({ ...th, [name]: value }));
	};

	const onDeleteApp = () => {
		setIsAddNew(false);
		closeOverride();
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			saveFuncLoc();
		}
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		schema
			.validateAt([name], { [name]: value })
			.then((res) => {
				setErrors((th) => ({ ...th, [name]: null }));
			})
			.catch((err) => {
				setErrors((th) => ({ ...th, [name]: err.errors }));
			});
	};

	useOutsideClick(childRef, () => saveFuncLoc(), "parentDiv");
	return (
		<div ref={childRef} className={classes.mainWrap}>
			<DeleteIcon className={classes.deleteIcon} onClick={onDeleteApp} />
			<form>
				<div className="desktopTableViewEdit">
					<Grid container spacing={2}>
						<Grid item sm={6}>
							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								fullWidth
								variant="outlined"
								name="name"
								label="Name"
								onChange={handleChange}
								value={input.name}
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								onKeyDown={handleEnterPress}
								onBlur={handleBlur}
								autoFocus
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
								onKeyDown={handleEnterPress}
								onBlur={handleBlur}
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
								onKeyDown={handleEnterPress}
								onBlur={handleBlur}
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
								onKeyDown={handleEnterPress}
								onBlur={handleBlur}
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
								label="Name"
								onChange={handleChange}
								value={input.name}
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								onKeyDown={handleEnterPress}
								onBlur={handleBlur}
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
								onKeyDown={handleEnterPress}
								onBlur={handleBlur}
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
								label="Planner Group"
								onChange={handleChange}
								value={input.plannerGroup}
								error={errors.plannerGroup === null ? false : true}
								helperText={
									errors.plannerGroup === null ? null : errors.plannerGroup
								}
								onKeyDown={handleEnterPress}
								onBlur={handleBlur}
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
								label="Work Center"
								onChange={handleChange}
								value={input.workCenter}
								error={errors.workCenter === null ? false : true}
								helperText={
									errors.workCenter === null ? null : errors.workCenter
								}
								onKeyDown={handleEnterPress}
								onBlur={handleBlur}
							/>
						</Grid>
					</Grid>
				</div>

				{/* <input type="submit" style={{ display: "none" }} /> */}
			</form>
		</div>
	);
};
const mapStateToProps = ({ commonData: { error } }) => ({ error });
export default connect(mapStateToProps)(NewFunctionalLocations);
