import React, { useState } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { addDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";
import { defectStatusTypes } from "helpers/constants";
import { Grid } from "@material-ui/core";
import PositionAccessTypes from "helpers/positionAccessTypes";
import EMICheckbox from "components/Elements/EMICheckbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
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

const listOfInputs = [
	{ label: "Asset Models Access", name: "assetModel" },
	{ label: "Services Access", name: "services" },
	{ label: "Defects Access", name: "defects" },
	{ label: "Defect Exports Access", name: "defectExports" },
	{ label: "Notice Boards Access", name: "noticeBoards" },
	{ label: "Feedback Access", name: "feedback" },
	{ label: "Users Access", name: "users" },
	{ label: "Reporting & Analytics Access", name: "reportingAnalytics" },
	{ label: "Settings", name: "settings" },
];

const AddDialog = ({
	open,
	closeHandler,
	applicationID,
	handleAddData,
	setError,
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
		console.log(input);
		return;

		try {
			const localChecker = await handleValidateObj(schema, input);

			console.log(localChecker);

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
		const result = await addDefectStatuses({
			siteAppId: applicationID,
			name: input.name,
			type: input.type,
		});

		// Handling success
		if (result.status) {
			// Adding new type to state
			handleAddData({
				id: result.data,
				applicationID: applicationID,
				name: input.name,
				type: defectStatusTypes.find((type) => type.value === input.type)[
					"label"
				],
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
						{listOfInputs.map((field) => (
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
									{Object.keys(PositionAccessTypes).map((key) => (
										<MenuItem key={key} value={key}>
											{PositionAccessTypes[key]}
										</MenuItem>
									))}
								</TextField>
							</Grid>
						))}
						<Grid item xs={6}>
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
									<Typography style={{ fontSize: "14px" }}>
										Allow change skipped task status
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
