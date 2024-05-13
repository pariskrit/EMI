import React, { useEffect, useState } from "react";
import API from "helpers/api";
import AddDialogStyle from "styles/application/AddDialogStyle";
import PositionAccessTypes from "helpers/positionAccessTypes";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import EMICheckbox from "components/Elements/EMICheckbox";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { showError } from "redux/common/actions";
import { connect, useDispatch } from "react-redux";
import { AccessTypes, DefaultPageOptions } from "helpers/constants";
import DynamicDropdown from "components/Elements/DyamicDropdown";
import { isChrome } from "helpers/utils";
import ColourConstants from "helpers/colourConstants";

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
	defaultPage: yup.string("This field must be string"),
	assetAccess: yup
		.string("This field must be string")
		.required("This field id required"),
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
	defaultPage: null,
	assetAccess: null,
};
const defaultStateSchema = {
	name: "",
	assetModel: "N",
	services: "N",
	defects: "N",
	defaultPage: 0,
	defectExports: "N",
	noticeBoards: "N",
	feedback: "N",
	users: "N",
	reportingAnalytics: "N",
	settings: "N",
	changeSkippedTasks: false,
	allowPublish: false,
	assetAccess: "N",
};

const AddPositionDialog = ({
	open,
	closeHandler,
	applicationID,
	handleAddData,
	getError,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [modelFocus, setModelFocus] = useState(true);
	const dispatch = useDispatch();

	const InterdefaultOptions = DefaultPageOptions();

	const defaultOptions = Object.keys(InterdefaultOptions).map((key) => {
		return {
			id: key,
			name: InterdefaultOptions[key],
		};
	});

	const positionTypes = Object.keys(PositionAccessTypes).map((key) => {
		return {
			id: key,
			name: PositionAccessTypes[key],
		};
	});
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
			dispatch(showError(err?.message ?? "Failed to add position."));

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
				defaultPage: input.defaultPage,
				assetAccess: input.assetAccess,
			};

			const result = await API.post("/api/ApplicationPositions", data);

			// Handling success
			if (result.status === 201) {
				// Adding ID to data
				data.id = result?.data;

				// Adding new type to state
				handleAddData(data);

				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {
			if (err.response?.data?.detail) {
				getError(
					err?.response?.data?.detail ||
						"Input should not be empty and it should be less than 50 characters ."
				);
			}
			if (err.response.data.errors !== undefined) {
				setErrors({ ...errors, ...err?.response?.data?.errors });
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
	useEffect(() => {
		const modal = document.getElementById("warningText");

		if (
			modal &&
			input.settings === AccessTypes.None &&
			(input.assetAccess === AccessTypes["Read-Only"] ||
				input.assetAccess === AccessTypes.Edit ||
				input.assetAccess === AccessTypes.Full)
		) {
			modal.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [input.assetAccess, input.settings]);

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth="lg"
				open={open}
				onClose={closeOverride}
				aria-labelledby="title"
				aria-describedby="description"
				disableEnforceFocus={isChrome() ? modelFocus : false}
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Add Position</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton
							onClick={closeOverride}
							variant="contained"
							onFocus={(e) => {
								setModelFocus(true);
							}}
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton
							variant="contained"
							onClick={handleAddClick}
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
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
									error={errors?.name === null ? false : true}
									helperText={errors?.name === null ? null : errors?.name}
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
								<DynamicDropdown
									width="100%"
									required
									label="Default Page"
									selectedValue={
										defaultOptions.filter(
											(d) => d?.id === input?.defaultPage?.toString()
										)[0]
									}
									selectdValueToshow="name"
									dataSource={defaultOptions}
									onChange={(data) =>
										setInput({ ...input, defaultPage: data?.id })
									}
									columns={[{ name: "name" }]}
								/>
							</ADD.RightInputContainer>
						</ADD.InputContainer>

						<ADD.InputContainer>
							{/* Services INPUT */}

							<ADD.LeftInputContainer>
								<DynamicDropdown
									width="100%"
									required
									label="Asset Models Access"
									selectedValue={
										positionTypes.filter((d) => d?.id === input?.assetModel)[0]
									}
									selectdValueToshow="name"
									dataSource={positionTypes}
									onChange={(data) =>
										setInput({ ...input, assetModel: data?.id })
									}
									columns={[{ name: "name" }]}
								/>
							</ADD.LeftInputContainer>

							<ADD.RightInputContainer>
								<DynamicDropdown
									width="100%"
									required
									label="Services Access"
									selectedValue={
										positionTypes.filter((d) => d?.id === input?.services)[0]
									}
									selectdValueToshow="name"
									dataSource={positionTypes}
									onChange={(data) =>
										setInput({ ...input, services: data?.id })
									}
									columns={[{ name: "name" }]}
								/>
							</ADD.RightInputContainer>

							{/* DEFECTS INPUT */}
						</ADD.InputContainer>

						<ADD.InputContainer>
							{/* NOTICE BOARDS INPUT */}
							<ADD.LeftInputContainer>
								<DynamicDropdown
									width="100%"
									required
									label="Defects Access"
									selectedValue={
										positionTypes.filter((d) => d?.id === input?.defects)[0]
									}
									selectdValueToshow="name"
									dataSource={positionTypes}
									onChange={(data) => setInput({ ...input, defects: data?.id })}
									columns={[{ name: "name" }]}
								/>
							</ADD.LeftInputContainer>

							<ADD.RightInputContainer>
								<DynamicDropdown
									width="100%"
									required
									label="Notice Boards Access"
									selectedValue={
										positionTypes.filter(
											(d) => d?.id === input?.noticeBoards
										)[0]
									}
									selectdValueToshow="name"
									dataSource={positionTypes}
									onChange={(data) =>
										setInput({ ...input, noticeBoards: data?.id })
									}
									columns={[{ name: "name" }]}
								/>
							</ADD.RightInputContainer>
							{/* USERS INPUT */}
						</ADD.InputContainer>

						<ADD.InputContainer>
							{/* USERS INPUT */}
							<ADD.LeftInputContainer>
								<DynamicDropdown
									width="100%"
									required
									label="Feedback Access"
									selectedValue={
										positionTypes.filter((d) => d?.id === input?.feedback)[0]
									}
									selectdValueToshow="name"
									dataSource={positionTypes}
									onChange={(data) =>
										setInput({ ...input, feedback: data?.id })
									}
									columns={[{ name: "name" }]}
								/>
							</ADD.LeftInputContainer>

							<ADD.RightInputContainer>
								<DynamicDropdown
									width="100%"
									required
									label="Users Access"
									selectedValue={
										positionTypes.filter((d) => d?.id === input?.users)[0]
									}
									selectdValueToshow="name"
									dataSource={positionTypes}
									onChange={(data) => setInput({ ...input, users: data?.id })}
									columns={[{ name: "name" }]}
								/>
							</ADD.RightInputContainer>
						</ADD.InputContainer>
						<ADD.InputContainer>
							<ADD.LeftInputContainer>
								<DynamicDropdown
									width="100%"
									required
									label="Analytics Access"
									selectedValue={
										positionTypes.filter(
											(d) => d?.id === input?.reportingAnalytics
										)[0]
									}
									selectdValueToshow="name"
									dataSource={positionTypes}
									onChange={(data) =>
										setInput({ ...input, reportingAnalytics: data?.id })
									}
									columns={[{ name: "name" }]}
								/>
							</ADD.LeftInputContainer>

							<ADD.RightInputContainer>
								<DynamicDropdown
									width="100%"
									required
									label="Settings"
									selectedValue={
										positionTypes.filter((d) => d?.id === input?.settings)[0]
									}
									selectdValueToshow="name"
									dataSource={positionTypes}
									onChange={(data) =>
										setInput({ ...input, settings: data?.id })
									}
									columns={[{ name: "name" }]}
								/>
							</ADD.RightInputContainer>

							{/* ALLOW CHANGE SKIPPED TASKS INPUT */}
						</ADD.InputContainer>
						<ADD.InputContainer>
							<ADD.LeftInputContainer>
								<DynamicDropdown
									width="100%"
									required
									label="Assets Access"
									selectedValue={
										positionTypes.filter((d) => d?.id === input?.assetAccess)[0]
									}
									selectdValueToshow="name"
									dataSource={positionTypes}
									onChange={(data) => {
										setInput({ ...input, assetAccess: data?.id });
									}}
									columns={[{ name: "name" }]}
								/>
								{input.settings === AccessTypes.None &&
									(input.assetAccess === AccessTypes["Read-Only"] ||
										input.assetAccess === AccessTypes.Edit ||
										input.assetAccess === AccessTypes.Full) && (
										<p style={{ color: "red" }} id="warningText">
											This Position will not be able to access the Assets list
											without Settings Access
										</p>
									)}
							</ADD.LeftInputContainer>
							<FormControlLabel
								style={{ marginLeft: "14px" }}
								control={
									<EMICheckbox
										changeHandler={() => {
											setInput({
												...input,
												allowPublish: !input?.allowPublish,
											});
										}}
									/>
								}
								label={
									<Typography style={{ fontSize: "14px" }}>
										Allow Publication of AModel Template
									</Typography>
								}
								onBlur={() => {
									setModelFocus(false);
								}}
							/>
						</ADD.InputContainer>
					</div>
				</ADD.DialogContent>
			</Dialog>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (message) => dispatch(showError(message)),
});
export default connect(null, mapDispatchToProps)(AddPositionDialog);
