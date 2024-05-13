import React, { useState, useEffect } from "react";
import API from "helpers/api";
import EditDialogStyle from "styles/application/EditDialogStyle";
import PositionAccessTypes from "helpers/positionAccessTypes";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import EMICheckbox from "components/Elements/EMICheckbox";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { AccessTypes, DefaultPageOptions } from "helpers/constants";
import { isChrome } from "helpers/utils";
import DynamicDropdown from "components/Elements/DyamicDropdown";
import ColourConstants from "helpers/colourConstants";

// Init styled components
const ADD = EditDialogStyle();

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
	allowPublish: yup
		.string("This field must be a string")
		.required("This field is required"),
	defaultPage: yup.string("This field must be a string"),
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
	noticeBoards: null,
	feedback: null,
	users: null,
	reportingAnalytics: null,
	settings: null,
	allowPublish: null,
	defaultPage: null,
	assetAccess: null,
};
const defaultStateSchema = {
	name: "",
	assetModel: "N",
	services: "N",
	defects: "N",
	noticeBoards: "N",
	feedback: "N",
	users: "N",
	reportingAnalytics: "N",
	settings: "N",
	allowPublish: false,
	defaultPage: 0,
	assetAccess: "N",
};

const EditPositionDialog = ({ open, closeHandler, data, handleEditData }) => {
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [modelFocus, setModelFocus] = useState(true);

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

			setIsUpdating(false);
			closeOverride();
			dispatch(showError(err?.message ?? "Failed to edit position."));
		}
	};

	const handleUpdateModelType = async () => {
		// Attempting to update element
		try {
			let updatePosition = await API.patch(
				`/api/ApplicationPositions/${data?.id}`,
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
						path: "analyticsAccess",
						value: input.reportingAnalytics,
					},
					{
						op: "replace",
						path: "allowPublish",
						value: input.allowPublish,
					},
					{
						op: "replace",
						path: "defaultPage",
						value: input.defaultPage,
					},
					{
						op: "replace",
						path: "assetAccess",
						value: input.assetAccess,
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
					analyticsAccess: input.reportingAnalytics,
					allowPublish: input.allowPublish,
					defaultPage: input.defaultPage,
					assetAccess: input?.assetAccess,
				});

				return { success: true };
			} else {
				dispatch(showError("Could not update"));
				// If error, throwing to catch
				// dispatch(showError(updatePosition));
				throw new Error(updatePosition);
			}
		} catch (err) {
			dispatch(showError(err?.response?.data?.detail || "Could not update"));
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
			handleSave();
		}
	};

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

	// Updating state after passed element
	useEffect(() => {
		if (data !== null && open) {
			setInput({
				name: data.name,
				assetModel: data.modelAccess,
				services: data.serviceAccess,
				defects: data.defectAccess,
				noticeBoards: data.noticeboardAccess,
				feedback: data.feedbackAccess,
				users: data.userAccess,
				reportingAnalytics: data.analyticsAccess,
				settings: data.settingsAccess,
				allowPublish: data.allowPublish,
				defaultPage: data?.defaultPage,
				assetAccess: data?.assetAccess,
			});
		}
	}, [data, open]);

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
						{<ADD.HeaderText>Edit Position</ADD.HeaderText>}
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
							onClick={handleSave}
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
							Save
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
									helperText={errors?.name === null ? null : errors.name}
									variant="outlined"
									value={input?.name}
									autoFocus
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setInput({ ...input, name: e.target.value });
									}}
								/>
							</ADD.LeftInputContainer>

							{/* ASSET MODEL INPUT */}

							<ADD.RightInputContainer>
								{/* <ADD.InputLabel>
									Default Page<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel>
								<TextField 
sx={{
					"& .MuiInputBase-input.Mui-disabled": {
						WebkitTextFillColor: "#000000",
					},
				}}
									fullWidth={true}
									select
									value={input.defaultPage}
									onChange={(e) => {
										setInput({ ...input, defaultPage: e.target.value });
									}}
									variant="outlined"
								>
									{Object.keys(defaultOptions).map((key) => (
										<MenuItem key={key} value={key}>
											{defaultOptions[key]}
										</MenuItem>
									))}
								</TextField> */}

								<DynamicDropdown
									width="100%"
									required
									label="Default Page"
									selectedValue={
										defaultOptions.filter(
											(d) => d?.id === input?.defaultPage.toString()
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
									onChange={(data) =>
										setInput({ ...input, assetAccess: data?.id })
									}
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
										state={input?.allowPublish}
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

export default EditPositionDialog;
