import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	LinearProgress,
	Radio,
	RadioGroup,
} from "@mui/material";
import * as yup from "yup";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import Dropdown from "components/Elements/Dropdown";
import { getModelTypes } from "services/clients/sites/siteApplications/modelTypes";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { showNotications } from "redux/notification/actions";
import { useDispatch } from "react-redux";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	make: yup
		.string("This field must be a string")
		.required("This field is required"),
	model: yup.string("This field must be a string").nullable(),
	type: yup
		.number("The field must be string")
		.typeError("must be a number")
		.integer()
		.required("The field is required"),
	location: yup.number("This field must be a string").nullable(),
	modelTemplateType: yup.string("This field must be a string").nullable(),
});

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: 500,
	},
	createButton: {
		width: "auto",
	},
}));

// Default state schemas
const defaultErrorSchema = {
	make: null,
	model: null,
	type: null,
	location: null,
	modelTemplateType: null,
};
const defaultStateSchema = {
	make: "",
	model: null,
	type: {},
	location: {},
	modelTemplateType: null,
};

function AddNewModelDetail({
	open,
	closeHandler,
	siteId,
	data,
	title,
	createProcessHandler,
}) {
	// Init hooks
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(true);
	const [input, setInput] = useState(data || defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [modelTypes, setModelTypes] = useState([]);
	const [locations, setLocations] = useState([]);

	// get model types for dropdown
	useEffect(() => {
		if (open) {
			const getFormData = async () => {
				const response = await Promise.all([getModelTypes(siteId)]);
				const [modeltypeslist] = response;
				if (modeltypeslist.status === true) {
					setModelTypes(
						modeltypeslist.data.map((list) => ({
							label: list.name,
							value: list.id,
						}))
					);
				}
				setIsUpdating(false);
			};
			getFormData();
		}
	}, [open, siteId]);

	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);

		closeHandler();
	};

	const handleCreateProcess = async () => {
		// Rendering spinner
		setIsUpdating(true);

		// Clearing errors before attempted create
		setErrors(defaultErrorSchema);

		// cleaned Input
		const cleanInput = {
			...input,
			type: input?.type?.value || null,
			location: input?.location?.value || null,
		};

		try {
			const localChecker = await handleValidateObj(schema, cleanInput);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const payload = {
					siteAppId: siteId,
					name: input.make,
					modelName: input.model || null,
					type: input.modelTemplateType || null,
					modelTypeID: input.type.value,
				};
				const newData = await createProcessHandler(payload);
				if (newData.status === 201) {
					setIsUpdating(false);
					// push to model details
				} else {
					setIsUpdating(false);
					dispatch(
						showNotications({
							show: true,
							message: "Could not add model intial data.",
							severity: "error",
						})
					);
				}
			} else {
				// show validation errors
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here

			setIsUpdating(false);
			setErrors({ ...errors, ...err?.response?.data?.errors });
		}
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="application-dailog"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>{title}</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<div className="modalButton">
							<ADD.CancelButton onClick={closeOverride} variant="contained">
								Cancel
							</ADD.CancelButton>
						</div>
						<div className="modalButton">
							<ADD.ConfirmButton
								onClick={handleCreateProcess}
								variant="contained"
								className={classes.createButton}
								disabled={isUpdating}
							>
								{title}
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								Make<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.make === null ? false : true}
								helperText={errors.make === null ? null : errors.make}
								value={input.make}
								onChange={(e) => {
									setInput({ ...input, make: e.target.value });
								}}
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>Model</ADD.NameLabel>
							<ADD.NameInput
								error={errors.model === null ? false : true}
								helperText={errors.model === null ? null : errors.model}
								required
								value={input.model}
								onChange={(e) => {
									setInput({ ...input, model: e.target.value });
								}}
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.FullWidthContainer>
							<ADD.NameLabel>
								Type<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={errors.type === null ? null : errors.type}
							>
								<Dropdown
									options={modelTypes}
									selectedValue={input.type}
									onChange={(e) => {
										setInput({ ...input, type: e });
									}}
									label=""
									placeholder="Select Type"
									required={true}
									width="100%"
									isError={errors.type === null ? false : true}
								/>
							</ErrorInputFieldWrapper>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.FullWidthContainer>
							<ADD.NameLabel>Location</ADD.NameLabel>
							<Dropdown
								options={locations}
								selectedValue={input.location}
								onChange={(e) => {
									setInput({ ...input, location: e });
								}}
								label=""
								placeholder="Select Location"
								width="100%"
							/>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>Model Template Type</ADD.NameLabel>
							<RadioGroup
								aria-label="ModelTemplateType"
								name="ModelTemplateType"
								value={input.modelTemplateType}
								onChange={(e) =>
									setInput({ ...input, modelTemplateType: e.target.value })
								}
								required
							>
								<FormControlLabel
									value="F"
									control={<Radio color="default" />}
									label="Facility-Based"
								/>
								<FormControlLabel
									value="A"
									control={<Radio color="default" />}
									label="Asset-Based"
								/>
							</RadioGroup>
						</ADD.LeftInputContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewModelDetail;
