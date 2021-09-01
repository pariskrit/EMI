import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContentText,
	DialogTitle,
	LinearProgress,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";
import * as yup from "yup";
import API from "helpers/api";
import EditDialogStyle from "styles/application/EditDialogStyle";
import { BASE_API_PATH } from "helpers/constants";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import NewFunctionalLocations from "./NewFunctionalLocations";
import CurveButton from "components/CurveButton";

const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	description: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ET = EditDialogStyle();
const defaultStateSchema = { name: "", description: "" };
const defaultErrorSchema = { name: null, description: null };

const useStyles = makeStyles({
	// Override for paper used in dialog
	paper: { minWidth: "90%" },
	divider: { marginTop: 30, marginBottom: 30 },
	inputContainer: {
		display: "flex",
		flexDirection: "column",
		marginBottom: 20,
	},
});

const EditAssetDialog = ({
	open,
	closeHandler,
	editData,
	handleEditData,
	handleRemoveFunctional,
	handleAddFunctional,
	handleUpdateFunctional,
}) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [isAddNew, setIsAddNew] = useState(false);

	useEffect(() => {
		if (open && editData !== null) {
			setInput({ name: editData.name, description: editData.description });
		}
	}, [editData, open]);

	const closeOverride = () => {
		// Closing dialog
		closeHandler();
		// Removing new subcat input
		setIsAddNew(false);
	};

	const handleUpdateData = async (d) => {
		try {
			let result = await API.patch(
				`${BASE_API_PATH}SiteAssets/${editData.id}`,
				[
					{ op: "replace", path: "name", value: d.name },
					{ op: "replace", path: "description", value: d.description },
				]
			);
			if (result.status === 200) {
				handleEditData({
					id: editData.id,
					name: input.name,
					description: input.description,
					references: editData.references,
				});

				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {
			if (
				err.response.data.detail !== null ||
				err.response.data.detail !== undefined
			) {
				setErrors({
					name: err.response.data.detail,
					description: err.response.data.detail,
				});
			} else {
				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}

			return { success: false };
		}
	};

	const handleSave = async () => {
		// Adding progress indicator
		setLoading(true);

		// Cleaning any existing errors
		setErrors(defaultErrorSchema);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const updatedData = await handleUpdateData({
					id: editData.id,
					name: input.name,
					description: input.description,
				});
				console.log(updatedData);
				if (updatedData.success) {
					setLoading(false);
					closeOverride();
				} else {
					setLoading(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setLoading(false);
			}
		} catch (err) {
			console.log(err.response);
			setLoading(false);
			closeOverride();
		}
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	const handleAddNewClick = () => {
		setIsAddNew(true);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInput((th) => ({ ...th, [name]: value }));
	};

	return (
		<div>
			<Dialog
				classes={{ paper: classes.paper }}
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{loading ? <LinearProgress /> : null}
				<ET.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						<ET.HeaderText>Edit Asset</ET.HeaderText>
					</DialogTitle>
					<ET.ButtonContainer>
						<ET.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</ET.CancelButton>
						<ET.ConfirmButton variant="contained" onClick={handleSave}>
							Save
						</ET.ConfirmButton>
					</ET.ButtonContainer>
				</ET.ActionContainer>
				<ET.DialogContent>
					<div className={classes.inputContainer}>
						<Typography>
							Name<ET.RequiredStar>*</ET.RequiredStar>
						</Typography>
						<TextField
							name="name"
							error={errors.name === null ? false : true}
							helperText={errors.name === null ? null : errors.name}
							variant="outlined"
							size="small"
							value={input.name}
							autoFocus
							onKeyDown={handleEnterPress}
							fullWidth
							onChange={handleChange}
						/>
					</div>
					<div className={classes.inputContainer}>
						<Typography>
							Description<ET.RequiredStar>*</ET.RequiredStar>
						</Typography>
						<TextField
							name="description"
							error={errors.description === null ? false : true}
							helperText={
								errors.description === null ? null : errors.description
							}
							variant="outlined"
							size="small"
							value={input.description}
							autoFocus
							onKeyDown={handleEnterPress}
							fullWidth
							onChange={handleChange}
						/>
					</div>
					<div className={classes.divider}></div>
					{isAddNew ? (
						<NewFunctionalLocations
							editData={editData}
							// setLoading={setLoading}
							// handleAddSubcat={handleAddSubcat}
							// setIsAddNew={setIsAddNew}
						/>
					) : null}

					<CurveButton variant="contained" onClick={handleAddNewClick}>
						Add new
					</CurveButton>
				</ET.DialogContent>
			</Dialog>
		</div>
	);
};

export default EditAssetDialog;
