import React, { useEffect, useState } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import { positionTypes } from "helpers/constants";
import { Grid } from "@material-ui/core";
import EMICheckbox from "components/Elements/EMICheckbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Dropdown from "components/Elements/Dropdown";
import { addPosition } from "services/clients/sites/siteApplications/userPositions";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	changeSkippedTasks: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = {
	name: null,
	changeSkippedTasks: false,
};

const defaultStateSchema = {
	name: "",
	changeSkippedTasks: false,
};

const listOfInputs = [
	{ label: "Asset Models Access", name: "modelAccess" },
	{ label: "Services Access", name: "serviceAccess" },
	{ label: "Defects Access", name: "defectAccess" },
	{ label: "Defect Exports Access", name: "defectExportAccess" },
	{ label: "Notice Boards Access", name: "noticeboardAccess" },
	{ label: "Feedback Access", name: "feedbackAccess" },
	{ label: "Users Access", name: "userAccess" },
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
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [dropDownInput, setDropDownInput] = useState([
		...listOfInputs.map((input) => ({
			label: "None",
			value: "N",
		})),
	]);

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
		const result = await addPosition({
			siteAppID: applicationID,
			name: input.name,
			modelAccess: dropDownInput[0].value,
			serviceAccess: dropDownInput[1].value,
			defectAccess: dropDownInput[2].value,
			defectExportAccess: dropDownInput[3].value,
			noticeboardAccess: dropDownInput[4].value,
			feedbackAccess: dropDownInput[5].value,
			userAccess: dropDownInput[6].value,
			analyticsAccess: dropDownInput[7].value,
			settingsAccess: dropDownInput[8].value,
			allowChangeSkippedTaskStatus: input.changeSkippedTasks,
		});

		// Handling success
		if (result.status) {
			// Adding new type to state
			handleAddData({
				id: result.data,
				applicationID,
				name: input.name,
				modelAccess: dropDownInput[0].label,
				serviceAccess: dropDownInput[1].label,
				defectAccess: dropDownInput[2].label,
				defectExportAccess: dropDownInput[3].label,
				noticeboardAccess: dropDownInput[4].label,
				feedbackAccess: dropDownInput[5].label,
				userAccess: dropDownInput[6].label,
				analyticsAccess: dropDownInput[7].label,
				settingsAccess: dropDownInput[8].label,
				allowChangeSkippedTaskStatus: input.changeSkippedTasks,
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

	const onDropDownChange = (value, i) => {
		setDropDownInput([
			...dropDownInput.map((inp, index) => (index === i ? value : inp)),
		]);
	};

	useEffect(() => {
		if (Object.keys(dataToEdit).length > 0 && open) {
			const getType = (value) =>
				positionTypes.find((type) => type.value === value).label;

			setInput({
				name: dataToEdit.name,
				allowChangeSkippedTaskStatus: dataToEdit.allowChangeSkippedTaskStatus,
			});
			setDropDownInput([
				...listOfInputs.map((input) => ({
					label: getType(dataToEdit[input.name]),
					value: dataToEdit[input.name],
				})),
			]);
		}
	}, [dataToEdit, open]);
	console.log(dropDownInput);
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
						{listOfInputs.map((field, i) => (
							<Grid item xs={6} key={field.label}>
								<Dropdown
									options={positionTypes}
									selectedValue={dropDownInput[i]}
									label={field.label}
									width="100%"
									onChange={(value) => onDropDownChange(value, i)}
									required
								/>
								{/* <ADD.InputLabel>
									{field.label}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.InputLabel> */}
								{/* <TextField
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
								</TextField> */}
							</Grid>
						))}
						<Grid item xs={6}>
							<FormControlLabel
								control={
									<EMICheckbox
										changeHandler={() => {
											setInput({
												...input,
												allowChangeSkippedTaskStatus: !input.changeSkippedTasks,
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
