import React, { useEffect, useState } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { positionAccessTypes } from "helpers/constants";
import { Grid } from "@material-ui/core";
import EMICheckbox from "components/Elements/EMICheckbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import {
	addPosition,
	updatePosition,
} from "services/clients/sites/siteApplications/userPositions";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	modelAccess: yup
		.string("This field must be a string")
		.required("This field is required"),
	serviceAccess: yup
		.string("This field must be a string")
		.required("This field is required"),
	defectAccess: yup
		.string("This field must be a string")
		.required("This field is required"),
	defectExportAccess: yup
		.string("This field must be a string")
		.required("This field is required"),
	noticeboardAccess: yup
		.string("This field must be a string")
		.required("This field is required"),
	feedbackAccess: yup
		.string("This field must be a string")
		.required("This field is required"),
	userAccess: yup
		.string("This field must be a string")
		.required("This field is required"),
	analyticsAccess: yup
		.string("This field must be a string")
		.required("This field is required"),
	settingsAccess: yup
		.string("This field must be a string")
		.required("This field is required"),
	allowChangeSkippedTaskStatus: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
	allowPublish: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = {
	allowChangeSkippedTaskStatus: null,
	analyticsAccess: null,
	defectAccess: null,
	defectExportAccess: null,
	feedbackAccess: null,
	modelAccess: null,
	name: null,
	noticeboardAccess: null,
	serviceAccess: null,
	settingsAccess: null,
	userAccess: null,
	allowPublish: null,
};

const defaultStateSchema = {
	allowChangeSkippedTaskStatus: false,
	allowPublish: false,
	analyticsAccess: "N",
	defectAccess: "N",
	defectExportAccess: "N",
	feedbackAccess: "N",
	modelAccess: "N",
	name: "",
	noticeboardAccess: "N",
	serviceAccess: "N",
	settingsAccess: "N",
	userAccess: "N",
};

const listOfInputs = (cc) => [
	{ label: cc?.modelTemplatePlural + " Access", name: "modelAccess" },
	{ label: cc?.servicePlural + " Access", name: "serviceAccess" },
	{ label: cc?.defectPlural + " Access", name: "defectAccess" },
	{ label: cc?.defect + " Exports Access", name: "defectExportAccess" },
	{ label: cc?.tutorialPlural + " Access", name: "noticeboardAccess" },
	{ label: cc?.feedbackPlural + " Access", name: "feedbackAccess" },
	{ label: cc?.userPlural + " Access", name: "userAccess" },
	{ label: "Reporting & Analytics Access", name: "analyticsAccess" },
	{ label: "Settings", name: "settingsAccess" },
];

const AddDialog = ({
	open,
	closeHandler,
	applicationID,
	handleAddData,
	setError,
	dataToEdit,
	handleEditData,
	isEdit = false,
	header,
	customCaptions,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	// Handlers
	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);

		closeHandler();
	};
	const handleAddClick = async () => {
		// Adding progress indicator
		setIsUpdating(true);

		try {
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				// Creating new data
				const newData = isEdit
					? await handleUpdateData()
					: await handleCreateData();

				if (newData.success) {
					setIsUpdating(false);
					closeOverride();
				} else {
					setIsUpdating(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);

				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here
			console.log(err);

			setIsUpdating(false);
			closeOverride();
		}
	};
	const handleCreateData = async () => {
		const newData = {
			name: input.name,
			modelAccess: input.modelAccess,
			serviceAccess: input.serviceAccess,
			defectAccess: input.defectAccess,
			defectExportAccess: input.defectExportAccess,
			noticeboardAccess: input.noticeboardAccess,
			feedbackAccess: input.feedbackAccess,
			userAccess: input.userAccess,
			analyticsAccess: input.analyticsAccess,
			settingsAccess: input.settingsAccess,
			allowChangeSkippedTaskStatus: input.allowChangeSkippedTaskStatus,
			allowPublish: input.allowPublish,
		};

		const result = await addPosition({
			siteAppID: applicationID,
			...newData,
		});

		// Handling success
		if (result.status) {
			// Adding new type to state
			handleAddData({
				id: result.data,

				...newData,
			});

			return { success: true };
		} else {
			setError(
				result.data?.detail || result.data?.errors?.name[0] || "Could not add"
			);
			return { success: false };
		}
	};

	const handleUpdateData = async () => {
		const result = await updatePosition(dataToEdit.id, [
			{
				op: "replace",
				path: "name",
				value: input.name,
			},
			{
				op: "replace",
				path: "modelAccess",
				value: input.modelAccess,
			},
			{
				op: "replace",
				path: "noticeboardAccess",
				value: input.noticeboardAccess,
			},
			{
				op: "replace",
				path: "feedbackAccess",
				value: input.feedbackAccess,
			},
			{
				op: "replace",
				path: "userAccess",
				value: input.userAccess,
			},
			{
				op: "replace",
				path: "settingsAccess",
				value: input.settingsAccess,
			},
			{
				op: "replace",
				path: "serviceAccess",
				value: input.serviceAccess,
			},
			{
				op: "replace",
				path: "defectAccess",
				value: input.defectAccess,
			},
			{
				op: "replace",
				path: "defectExportAccess",
				value: input.defectExportAccess,
			},
			{
				op: "replace",
				path: "analyticsAccess",
				value: input.analyticsAccess,
			},
			{
				op: "replace",
				path: "allowChangeSkippedTaskStatus",
				value: input.allowChangeSkippedTaskStatus,
			},
			{
				op: "replace",
				path: "allowPublish",
				value: input.allowPublish,
			},
		]);
		if (result.status) {
			handleEditData({
				id: dataToEdit.id,

				name: input.name,
				modelAccess: positionAccessTypes[input.modelAccess],
				serviceAccess: positionAccessTypes[input.serviceAccess],
				defectAccess: positionAccessTypes[input.defectAccess],
				defectExportAccess: positionAccessTypes[input.defectExportAccess],
				noticeboardAccess: positionAccessTypes[input.noticeboardAccess],
				feedbackAccess: positionAccessTypes[input.feedbackAccess],
				userAccess: positionAccessTypes[input.userAccess],
				analyticsAccess: positionAccessTypes[input.analyticsAccess],
				settingsAccess: positionAccessTypes[input.settingsAccess],
				allowChangeSkippedTaskStatus: input.allowChangeSkippedTaskStatus,
				allowPublish: input.allowPublish,
			});

			return { success: true };
		} else {
			setError(result.data.detail);
			return { success: false };
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleAddClick();
		}
	};

	useEffect(() => {
		if (Object.keys(dataToEdit).length > 0 && open) {
			setInput({
				name: dataToEdit.name,
				modelAccess: dataToEdit.modelAccess[0],
				serviceAccess: dataToEdit.serviceAccess[0],
				defectAccess: dataToEdit.defectAccess[0],
				defectExportAccess: dataToEdit.defectExportAccess[0],
				noticeboardAccess: dataToEdit.noticeboardAccess[0],
				feedbackAccess: dataToEdit.feedbackAccess[0],
				userAccess: dataToEdit.userAccess[0],
				analyticsAccess: dataToEdit.analyticsAccess[0],
				settingsAccess: dataToEdit.settingsAccess[0],
				allowChangeSkippedTaskStatus: dataToEdit.allowChangeSkippedTaskStatus,
				allowPublish: dataToEdit.allowPublish,
			});
		}
	}, [dataToEdit, open]);
	return (
		<Dialog
			fullWidth={true}
			maxWidth="md"
			open={open}
			onClose={closeOverride}
			aria-labelledby="title"
			aria-describedby="description"
		>
			{isUpdating ? <LinearProgress /> : null}

			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					<ADD.HeaderText>
						{isEdit ? "Edit" : "Add"} {header}
					</ADD.HeaderText>
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton variant="contained" onClick={handleAddClick}>
						{isEdit ? "Save" : "Add New"}
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>

			<ADD.DialogContent>
				<div>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<ADD.NameLabel>
								Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								variant="outlined"
								value={input.name}
								autoFocus
								onKeyDown={handleEnterPress}
								onChange={(e) => {
									setInput({ ...input, name: e.target.value });
								}}
							/>
						</Grid>
						{listOfInputs(customCaptions).map((field, i) => (
							<Grid item xs={6} key={field.label}>
								<ADD.InputLabel>
									{field.label}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>
								<TextField
									error={errors[field.name] === null ? false : true}
									helperText={
										errors[field.name] === null ? null : errors.assetModel
									}
									fullWidth={true}
									name={field.name}
									select
									value={input[field.name]}
									onChange={(e) => {
										setInput({ ...input, [e.target.name]: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(positionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{positionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</Grid>
						))}
						<Grid item xs={6}>
							<FormControlLabel
								control={
									<EMICheckbox
										state={input.allowChangeSkippedTaskStatus}
										changeHandler={() => {
											setInput({
												...input,
												allowChangeSkippedTaskStatus: !input.allowChangeSkippedTaskStatus,
											});
										}}
									/>
								}
								label={
									<Typography style={{ fontSize: "14px" }}>
										Allow change skipped {customCaptions?.task} status
									</Typography>
								}
							/>
						</Grid>
						<Grid item xs={6}>
							<FormControlLabel
								control={
									<EMICheckbox
										state={input.allowPublish}
										changeHandler={() => {
											setInput({
												...input,
												allowPublish: !input.allowPublish,
											});
										}}
									/>
								}
								label={
									<Typography style={{ fontSize: "14px" }}>
										Allow Publication of {customCaptions?.modelTemplate}
									</Typography>
								}
							/>
						</Grid>
					</Grid>
				</div>
			</ADD.DialogContent>
		</Dialog>
	);
};

export default AddDialog;
