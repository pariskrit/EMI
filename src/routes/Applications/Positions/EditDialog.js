import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";
import EditDialogStyle from "../../../styles/application/EditDialogStyle";
import PositionAccessTypes from "../../../helpers/positionAccessTypes";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import EMICheckbox from "../../../components/EMICheckbox";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "../../../helpers/utils";

// Init styled components
const AED = EditDialogStyle();

const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	assetModel: yup
		.string("This field must be a string")
		.required("This field is required"),
	services: yup
		.string("This field must be a string")
		.required("This field is required"),
	defects: yup
		.string("This field must be a string")
		.required("This field is required"),
	defectExports: yup
		.string("This field must be a string")
		.required("This field is required"),
	noticeBoards: yup
		.string("This field must be a string")
		.required("This field is required"),
	feedback: yup
		.string("This field must be a string")
		.required("This field is required"),
	users: yup
		.string("This field must be a string")
		.required("This field is required"),
	reportingAnalytics: yup
		.string("This field must be a string")
		.required("This field is required"),
	settings: yup
		.string("This field must be a string")
		.required("This field is required"),
	changeSkippedTasks: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = {
	name: null,
	assetModel: null,
	services: null,
	defects: null,
	defectExports: null,
	noticeBoards: null,
	feedback: null,
	users: null,
	reportingAnalytics: null,
	settings: null,
	changeSkippedTasks: null,
};
const defaultStateSchema = {
	name: "",
	assetModel: "N",
	services: "N",
	defects: "N",
	defectExports: "N",
	noticeBoards: "N",
	feedback: "N",
	users: "N",
	reportingAnalytics: "N",
	settings: "N",
	changeSkippedTasks: false,
};

const EditPositionDialog = ({ open, closeHandler, data, handleEditData }) => {

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	// Handlers
	const closeOverride = () => {
		setErrors(defaultErrorSchema);

		closeHandler();
	};
	const handleSave = async () => {
		// Adding progress indicator
		setIsUpdating(true);

		try {
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				// Updating data
				const newData = await handleUpdateModelType();

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
	const handleUpdateModelType = async () => {
		// Attempting to update element
		try {
			let updatePosition = await API.patch(
				`/api/ApplicationPositions/${data.id}`,
				[
					{
						op: "replace",
						path: "name",
						value: input.name,
					},
					{
						op: "replace",
						path: "modelAccess",
						value: input.assetModel,
					},
					{
						op: "replace",
						path: "noticeboardAccess",
						value: input.noticeBoards,
					},
					{
						op: "replace",
						path: "feedbackAccess",
						value: input.feedback,
					},
					{
						op: "replace",
						path: "userAccess",
						value: input.users,
					},
					{
						op: "replace",
						path: "settingsAccess",
						value: input.settings,
					},
					{
						op: "replace",
						path: "serviceAccess",
						value: input.services,
					},
					{
						op: "replace",
						path: "defectAccess",
						value: input.defects,
					},
					{
						op: "replace",
						path: "defectExportAccess",
						value: input.defectExports,
					},
					{
						op: "replace",
						path: "analyticsAccess",
						value: input.reportingAnalytics,
					},
					{
						op: "replace",
						path: "allowChangeSkippedTaskStatus",
						value: input.changeSkippedTasks,
					},
				]
			);

			// if success, adding data to state
			if (updatePosition.status === 200) {
				// Updating state
				handleEditData({
					id: data.id,
					applicationID: data.applicationID,
					modelAccess: input.assetModel,
					name: input.name,
					noticeboardAccess: input.noticeBoards,
					feedbackAccess: input.feedback,
					userAccess: input.users,
					settingsAccess: input.settings,
					serviceAccess: input.services,
					defectAccess: input.defects,
					defectExportAccess: input.defectExports,
					analyticsAccess: input.reportingAnalytics,
					allowChangeSkippedTaskStatus: input.changeSkippedTasks,
				});

				return { success: true };
			} else {
				// If error, throwing to catch
				throw new Error(updatePosition);
			}
		} catch (err) {
			if (err.response.data.errors !== undefined) {
				setErrors({ ...errors, ...err.response.data.errors });
			} else {
				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}

			return { success: false };
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	// Updating state after passed element
	useEffect(() => {
		if (data !== null && open) {
			setInput({
				name: data.name,
				assetModel: data.modelAccess,
				services: data.serviceAccess,
				defects: data.defectAccess,
				defectExports: data.defectExportAccess,
				noticeBoards: data.noticeboardAccess,
				feedback: data.feedbackAccess,
				users: data.userAccess,
				reportingAnalytics: data.analyticsAccess,
				settings: data.settingsAccess,
				changeSkippedTasks: data.allowChangeSkippedTaskStatus,
			});
		}
	}, [data, open]);

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth="lg"
				open={open}
				onClose={closeOverride}
				aria-labelledby="title"
				aria-describedby="description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<AED.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<AED.HeaderText>Edit Position</AED.HeaderText>}
					</DialogTitle>
					<AED.ButtonContainer>
						<AED.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</AED.CancelButton>
						<AED.ConfirmButton variant="contained" onClick={handleSave}>
							Save
						</AED.ConfirmButton>
					</AED.ButtonContainer>
				</AED.ActionContainer>

				<AED.DialogContent>
					<DialogContentText id="alert-dialog-description">
						<AED.InputContainer>
							{/* NAME INPUT */}
							<AED.LeftInputContainer>
								<AED.InputLabel>
									Name<AED.RequiredStar>*</AED.RequiredStar>
								</AED.InputLabel>
								<AED.NameInput
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
							</AED.LeftInputContainer>

							{/* ASSET MODEL INPUT */}
							<AED.RightInputContainer>
								<AED.InputLabel>
									Asset Models Access<AED.RequiredStar>*</AED.RequiredStar>
								</AED.InputLabel>
								<TextField
									error={errors.assetModel === null ? false : true}
									helperText={
										errors.assetModel === null ? null : errors.assetModel
									}
									fullWidth={true}
									select
									value={input.assetModel}
									onChange={(e) => {
										setInput({ ...input, assetModel: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(PositionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{PositionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</AED.RightInputContainer>
						</AED.InputContainer>

						<AED.InputContainer>
							{/* Services INPUT */}
							<AED.LeftInputContainer>
								<AED.InputLabel>
									Services Access<AED.RequiredStar>*</AED.RequiredStar>
								</AED.InputLabel>
								<TextField
									error={errors.services === null ? false : true}
									helperText={errors.services === null ? null : errors.services}
									fullWidth={true}
									select
									value={input.services}
									onChange={(e) => {
										setInput({ ...input, services: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(PositionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{PositionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</AED.LeftInputContainer>

							{/* DEFECTS INPUT */}
							<AED.RightInputContainer>
								<AED.InputLabel>
									Defects Access<AED.RequiredStar>*</AED.RequiredStar>
								</AED.InputLabel>

								<TextField
									error={errors.defects === null ? false : true}
									helperText={errors.defects === null ? null : errors.defects}
									fullWidth={true}
									select
									value={input.defects}
									onChange={(e) => {
										setInput({ ...input, defects: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(PositionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{PositionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</AED.RightInputContainer>
						</AED.InputContainer>

						<AED.InputContainer>
							{/* DEFECT EXPORTS INPUT */}
							<AED.LeftInputContainer>
								<AED.InputLabel>
									Defect Exports Access<AED.RequiredStar>*</AED.RequiredStar>
								</AED.InputLabel>

								<TextField
									error={errors.defectExports === null ? false : true}
									helperText={
										errors.defectExports === null ? null : errors.defectExports
									}
									fullWidth={true}
									select
									value={input.defectExports}
									onChange={(e) => {
										setInput({ ...input, defectExports: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(PositionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{PositionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</AED.LeftInputContainer>

							{/* NOTICE BOARDS INPUT */}
							<AED.RightInputContainer>
								<AED.InputLabel>
									Notice Boards Access<AED.RequiredStar>*</AED.RequiredStar>
								</AED.InputLabel>

								<TextField
									error={errors.noticeBoards === null ? false : true}
									helperText={
										errors.noticeBoards === null ? null : errors.noticeBoards
									}
									fullWidth={true}
									select
									value={input.noticeBoards}
									onChange={(e) => {
										setInput({ ...input, noticeBoards: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(PositionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{PositionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</AED.RightInputContainer>
						</AED.InputContainer>

						<AED.InputContainer>
							{/* FEEDBACK INPUT */}
							<AED.LeftInputContainer>
								<AED.InputLabel>
									Feedback Access<AED.RequiredStar>*</AED.RequiredStar>
								</AED.InputLabel>

								<TextField
									error={errors.feedback === null ? false : true}
									helperText={errors.feedback === null ? null : errors.feedback}
									fullWidth={true}
									select
									value={input.feedback}
									onChange={(e) => {
										setInput({ ...input, feedback: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(PositionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{PositionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</AED.LeftInputContainer>

							{/* USERS INPUT */}
							<AED.RightInputContainer>
								<AED.InputLabel>
									Users Access<AED.RequiredStar>*</AED.RequiredStar>
								</AED.InputLabel>

								<TextField
									error={errors.users === null ? false : true}
									helperText={errors.users === null ? null : errors.users}
									fullWidth={true}
									select
									value={input.users}
									onChange={(e) => {
										setInput({ ...input, users: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(PositionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{PositionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</AED.RightInputContainer>
						</AED.InputContainer>

						<AED.InputContainer>
							{/* Reporting & Analytics INPUT */}
							<AED.LeftInputContainer>
								<AED.InputLabel>
									Reporting & Analytics Access
									<AED.RequiredStar>*</AED.RequiredStar>
								</AED.InputLabel>

								<TextField
									error={errors.reportingAnalytics === null ? false : true}
									helperText={
										errors.reportingAnalytics === null
											? null
											: errors.reportingAnalytics
									}
									fullWidth={true}
									select
									value={input.reportingAnalytics}
									onChange={(e) => {
										setInput({ ...input, reportingAnalytics: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(PositionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{PositionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</AED.LeftInputContainer>

							{/* SETTINGS INPUT */}
							<AED.RightInputContainer>
								<AED.InputLabel>
									Settings<AED.RequiredStar>*</AED.RequiredStar>
								</AED.InputLabel>

								<TextField
									error={errors.settings === null ? false : true}
									helperText={errors.settings === null ? null : errors.settings}
									fullWidth={true}
									select
									value={input.settings}
									onChange={(e) => {
										setInput({ ...input, settings: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(PositionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{PositionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</AED.RightInputContainer>
						</AED.InputContainer>

						<AED.InputContainer>
							{/* ALLOW CHANGE SKIPPED TASKS INPUT */}
							<AED.LeftInputContainer>
								<FormControlLabel
									control={
										<EMICheckbox
											changeHandler={() => {
												setInput({
													...input,
													changeSkippedTasks: !input.changeSkippedTasks,
												});
											}}
										/>
									}
									label={
										<Typography>Allow change skipped task status</Typography>
									}
								/>
							</AED.LeftInputContainer>
						</AED.InputContainer>
					</DialogContentText>
				</AED.DialogContent>
			</Dialog>
		</div>
	);
};

export default EditPositionDialog;
