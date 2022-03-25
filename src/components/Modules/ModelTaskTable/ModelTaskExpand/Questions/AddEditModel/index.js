import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	makeStyles,
	FormGroup,
	FormControlLabel,
	Typography,
	LinearProgress,
} from "@material-ui/core";
import AddDialogStyle from "styles/application/AddDialogStyle";
import schema from "./schema";
import {
	postQuestions,
	patchQuestions,
} from "services/models/modelDetails/modelTasks/questions";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import Dropdown from "components/Elements/Dropdown";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import EMICheckbox from "components/Elements/EMICheckbox";
import ListAnswers from "./ListAnswers";

const questionTypeOptions = [
	{ label: "Checkbox", value: "B" },
	{ label: "Checkbox List", value: "C" },
	{ label: "Date", value: "D" },
	{ label: "Dropdown", value: "O" },
	{ label: "Long Text", value: "L" },
	{ label: "Number", value: "N" },
	{ label: "Short Text", value: "S" },
	{ label: "Time", value: "T" },
];

const ADD = AddDialogStyle();

const useStyles = makeStyles({
	paper: { minWidth: "90%" },
	numberFields: { display: "flex", width: "100%", gap: 5, flexWrap: "wrap" },
});

const initialState = {
	caption: "",
	type: "",
	decimalPlaces: null,
	minValue: null,
	maxValue: null,
	checkboxCaption: "",
	isCompulsory: false,
};

const defaultError = {
	caption: null,
	type: null,
	decimalPlaces: null,
	minValue: null,
	maxValue: null,
	checkboxCaption: null,
	isCompulsory: null,
};

function AddEditModel({
	open,
	questionDetail,
	handleClose,
	title,
	taskId,
	handleAddEditComplete,
	getError,
}) {
	const classes = useStyles();

	const [input, setInput] = useState(initialState);
	const [errors, setErrors] = useState(defaultError);
	const [loading, setLoading] = useState(false);

	const setState = (value) => setInput((th) => ({ ...th, ...value }));

	useEffect(() => {
		// If Edit Mode
		if (questionDetail) {
			const {
				caption,
				checkboxCaption,
				decimalPlaces,
				isCompulsory,
				maxValue,
				minValue,
				type,
			} = questionDetail;
			setInput({
				caption,
				checkboxCaption,
				decimalPlaces,
				isCompulsory,
				maxValue,
				minValue,
				type,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [questionDetail]);

	const handleType = (val) => {
		setState({ type: val.value });
	};

	const handleAddTaskQuestion = async (data) => {
		data["ModelVersionTaskID"] = taskId;
		setLoading(true);
		try {
			let result = await postQuestions(data);
			setLoading(false);
			if (result.status) {
				handleAddEditComplete();
			} else {
				console.log(result);
			}
		} catch (e) {
			return;
		}
	};

	const handleEditTaskQuestion = async (data) => {
		const main = Object.entries(data).map(([key, value]) => ({
			op: "replace",
			path: key,
			value: value,
		}));

		setLoading(true);
		try {
			let result = await patchQuestions(questionDetail.id, main);
			setLoading(false);
			if (result.status) {
				handleAddEditComplete();
			} else {
				console.log(result);
			}
		} catch (e) {
			return;
		}
	};

	const handleSave = async () => {
		const d = { ...input };

		if (input.type === "B") {
			// For Checkbox Type
			d["decimalPlaces"] = null;
			d["maxValue"] = null;
			d["minValue"] = null;
		} else if (input.type === "N") {
			// For Number Type
			d["checkboxCaption"] = "";
		} else {
			d["decimalPlaces"] = null;
			d["maxValue"] = null;
			d["minValue"] = null;
			d["checkboxCaption"] = "";
		}

		try {
			const localChecker = await handleValidateObj(schema(input.type), d);
			if (!localChecker.some((el) => el.valid === false)) {
				setErrors(defaultError);
				if (questionDetail) {
					handleEditTaskQuestion(input);
				} else {
					handleAddTaskQuestion(input);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
			}
		} catch (e) {
			return;
		}
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	const closeOverride = () => {
		handleClose();
	};

	return (
		<Dialog
			classes={{ paper: classes.paper }}
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					<ADD.HeaderText>
						{questionDetail ? "Edit" : "Add"} {title}
					</ADD.HeaderText>
				</DialogTitle>

				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton variant="contained" onClick={handleSave}>
						Save
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<ADD.DialogContent>
				<ADD.InputContainer>
					<ADD.LeftInputContainer>
						<ADD.NameLabel>
							Question Caption<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ADD.NameInput
							error={errors.caption === null ? false : true}
							helperText={errors.caption === null ? null : errors.caption}
							variant="outlined"
							size="medium"
							value={input.caption}
							autoFocus
							onKeyDown={handleEnterPress}
							onChange={(e) => {
								setState({ caption: e.target.value });
							}}
						/>
					</ADD.LeftInputContainer>
					<ADD.RightInputContainer>
						<ADD.NameLabel>
							Question Type<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ErrorInputFieldWrapper errorMessage={errors.type}>
							<Dropdown
								options={questionTypeOptions}
								selectedValue={questionTypeOptions.find(
									(x) => x.value === input.type
								)}
								width="100%"
								onChange={handleType}
							/>
						</ErrorInputFieldWrapper>
					</ADD.RightInputContainer>
				</ADD.InputContainer>
				<ADD.InputContainer>
					<ADD.LeftInputContainer>
						<FormGroup>
							<FormControlLabel
								style={{ marginLeft: 0, marginTop: -20 }}
								control={
									<EMICheckbox
										state={input.isCompulsory}
										changeHandler={() => {
											setState({
												isCompulsory: !input.isCompulsory,
											});
										}}
									/>
								}
								label={<Typography>Compulsory</Typography>}
							/>
						</FormGroup>
					</ADD.LeftInputContainer>
				</ADD.InputContainer>
				<ADD.InputContainer>
					{input.type === "B" ? (
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								Checkbox Caption<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.checkboxCaption === null ? false : true}
								helperText={
									errors.checkboxCaption === null
										? null
										: errors.checkboxCaption
								}
								variant="outlined"
								size="medium"
								value={input.checkboxCaption}
								autoFocus
								onKeyDown={handleEnterPress}
								onChange={(e) => {
									setState({ checkboxCaption: e.target.value });
								}}
							/>
						</ADD.LeftInputContainer>
					) : input.type === "N" ? (
						<div className={classes.numberFields}>
							<div style={{ flexBasis: "33%" }}>
								<ADD.NameLabel>
									Decimal Places<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>
								<ADD.NameInput
									type="number"
									error={errors.decimalPlaces === null ? false : true}
									helperText={
										errors.decimalPlaces === null ? null : errors.decimalPlaces
									}
									variant="outlined"
									size="medium"
									value={input.decimalPlaces}
									autoFocus
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setState({ decimalPlaces: e.target.value });
									}}
								/>
							</div>
							<div style={{ flexBasis: "33%" }}>
								<ADD.NameLabel>Minimum Value</ADD.NameLabel>
								<ADD.NameInput
									type="number"
									error={errors.minValue === null ? false : true}
									helperText={errors.minValue === null ? null : errors.minValue}
									variant="outlined"
									size="medium"
									value={input.minValue}
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setState({ minValue: e.target.value });
									}}
								/>
							</div>
							<div style={{ flexBasis: "33%" }}>
								<ADD.NameLabel>Maximum Value</ADD.NameLabel>
								<ADD.NameInput
									type="number"
									error={errors.maxValue === null ? false : true}
									helperText={errors.maxValue === null ? null : errors.maxValue}
									variant="outlined"
									size="medium"
									value={input.maxValue}
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setState({ maxValue: e.target.value });
									}}
								/>
							</div>
						</div>
					) : input.type === "C" || input.type === "O" ? (
						<>
							{questionDetail && (
								<ListAnswers
									type={input.type}
									modelVersionTaskQuestionID={questionDetail.id}
									getError={getError}
								/>
							)}
						</>
					) : null}
				</ADD.InputContainer>
			</ADD.DialogContent>
		</Dialog>
	);
}

export default AddEditModel;
