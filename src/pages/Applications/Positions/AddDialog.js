import React, { useState } from "react";
import API from "../../../helpers/api";
import AddDialogStyle from "../../../styles/application/AddDialogStyle";
import PositionAccessTypes from "../../../helpers/positionAccessTypes";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import EMICheckbox from "../../../components/Elements/EMICheckbox";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "../../../helpers/utils";

// Init styled components
const ADD = AddDialogStyle();

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
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
	allowPublish: yup
		.boolean("This field must be a boolean (true or false)")
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
	allowPublish: null,
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
	allowPublish: false,
};

const AddPositionDialog = ({
	open,
	closeHandler,
	applicationID,
	handleAddData,
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
				const newData = await handleCreateData();

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
		// Attempting to create data
		try {
			let data = {
				applicationId: applicationID,
				name: input.name,
				modelAccess: input.assetModel,
				noticeboardAccess: input.noticeBoards,
				feedbackAccess: input.feedback,
				userAccess: input.users,
				settingsAccess: input.settings,
				serviceAccess: input.services,
				defectAccess: input.defects,
				defectExportAccess: input.defectExports,
				analyticsAccess: input.reportingAnalytics,
				allowChangeSkippedTaskStatus: input.changeSkippedTasks,
				allowPublish: input.allowPublish,
			};

			const result = await API.post("/api/ApplicationPositions", data);

			// Handling success
			if (result.status === 201) {
				// Adding ID to data
				data.id = result.data;

				// Adding new type to state
				handleAddData(data);

				return { success: true };
			} else {
				throw new Error(result);
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
			handleAddClick();
		}
	};

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

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Add Position</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton variant="contained" onClick={handleAddClick}>
							Add New
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<ADD.DialogContent>
					<div>
						<ADD.InputContainer>
							{/* NAME INPUT */}
							<ADD.LeftInputContainer>
								<ADD.InputLabel>
									Name<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>
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
							</ADD.LeftInputContainer>

							{/* ASSET MODEL INPUT */}
							<ADD.RightInputContainer>
								<ADD.InputLabel>
									Asset Models Access<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>
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
							</ADD.RightInputContainer>
						</ADD.InputContainer>

						<ADD.InputContainer>
							{/* Services INPUT */}
							<ADD.LeftInputContainer>
								<ADD.InputLabel>
									Services Access<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>
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
							</ADD.LeftInputContainer>

							{/* DEFECTS INPUT */}
							<ADD.RightInputContainer>
								<ADD.InputLabel>
									Defects Access<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>

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
							</ADD.RightInputContainer>
						</ADD.InputContainer>

						<ADD.InputContainer>
							{/* NOTICE BOARDS INPUT */}
							<ADD.LeftInputContainer>
								<ADD.InputLabel>
									Notice Boards Access<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>

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
							</ADD.LeftInputContainer>
							{/* USERS INPUT */}
							<ADD.RightInputContainer>
								<ADD.InputLabel>
									Users Access<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>

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
							</ADD.RightInputContainer>
						</ADD.InputContainer>

						<ADD.InputContainer>
							{/* FEEDBACK INPUT */}
							<ADD.LeftInputContainer>
								<ADD.InputLabel>
									Feedback Access<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>

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
							</ADD.LeftInputContainer>
							{/* SETTINGS INPUT */}
							<ADD.RightInputContainer>
								<ADD.InputLabel>
									Settings<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>

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
							</ADD.RightInputContainer>
						</ADD.InputContainer>

						<ADD.InputContainer>
							{/* Analytics INPUT */}
							<ADD.LeftInputContainer>
								<ADD.InputLabel>
									Analytics Access
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>

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
							</ADD.LeftInputContainer>
						</ADD.InputContainer>

						<ADD.InputContainer>
							{/* ALLOW CHANGE SKIPPED TASKS INPUT */}
							<ADD.LeftInputContainer>
								<FormControlLabel
									control={
										<EMICheckbox
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
											Allow Publication of AModel Template
										</Typography>
									}
								/>
							</ADD.LeftInputContainer>
						</ADD.InputContainer>
					</div>
				</ADD.DialogContent>
			</Dialog>
		</div>
	);
};

export default AddPositionDialog;
