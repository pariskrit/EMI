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
import Departments from "pages/Models/ModelDetails/ModelDetail/Departments";
import { generateErrorState, handleValidateObj, isChrome } from "helpers/utils";
import Dropdown from "components/Elements/Dropdown";
import { getModelTypes } from "services/clients/sites/siteApplications/modelTypes";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { showNotications } from "redux/notification/actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appPath, modelsPath } from "helpers/routePaths";
import { getAvailableModelDepartments } from "services/models/modelList";
import { getModelDeparments } from "services/models/modelDetails/details";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	model: yup.string("This field must be a string").nullable(),
	type: yup
		.number("The field must be string")
		.typeError("must be a number")
		.integer()
		.required("The field is required"),

	modelTemplateType: yup.string("This field must be a string").nullable(),
	serialNumberRange: yup.string("This field must be a string").nullable(),
});

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: 500,
	},
	createButton: {
		padding: "2px 0px",
		minWidth: "170px",
		// width: "auto",
	},
}));

// Default state schemas
const defaultErrorSchema = {
	name: null,
	model: null,
	type: null,
	modelTemplateType: "F",
	serialNumberRange: null,
};
const defaultStateSchema = {
	name: "",
	model: "",
	type: {},
	modelTemplateType: "F",
	serialNumberRange: null,
};

function AddNewModelDetail({
	open,
	closeHandler,
	siteId,
	data,
	title,
	createProcessHandler,
	isDuplicate,
	isShareModel,
}) {
	// Init hooks
	const { classes } = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [availableDepartments, setAvailableDepartments] = useState([]);
	const [registeredDepartments, setRegisteredDepartments] = useState([]);
	const [modelTypes, setModelTypes] = useState([]);
	const [modelFocus, setModelFocus] = useState(true);

	const { application, customCaptions, siteAppID } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const navigate = useNavigate();

	// get model types for dropdown
	useEffect(() => {
		if (open) {
			setIsUpdating(true);
			const getFormData = async () => {
				let response = null;
				if (application?.showLocations) {
					response = await Promise.all([getModelTypes(siteId)]);
				} else {
					response = await Promise.all([getModelTypes(siteId)]);
				}
				const [modeltypeslist] = response;
				if (modeltypeslist?.status === true) {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, siteId]);

	useEffect(() => {
		if (open) {
			const fetchAvailableDepartments = async () => {
				const depts = await getAvailableModelDepartments(siteAppID);
				setAvailableDepartments(depts?.data);
			};
			const fetchModelDepartments = async () => {
				const depts = await getModelDeparments(
					data?.activeModelVersionID || data?.devModelVersionID
				);
				setAvailableDepartments(depts?.data || []);
			};
			if (data) {
				setInput(() => ({
					...data,
					type: { label: data.modelType, value: data?.modelTypeID },
					model: data.modelName,
				}));
			}
			if (
				isDuplicate &&
				(data?.activeModelVersionID || data?.devModelVersionID)
			) {
				fetchModelDepartments();
			} else {
				fetchAvailableDepartments();
			}
		}
	}, [data, open]);

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
			type: input?.type?.value,
		};

		try {
			const localChecker = await handleValidateObj(schema, cleanInput);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const payload = {
					siteAppId: siteId,
					name: input.name,
					modelName: input.model || null,
					type: input.modelTemplateType || null,
					modelTypeID: input.type.value,
					serialNumberRange: input.serialNumberRange || null,
					siteDepartments: registeredDepartments
						?.filter((department) => department.checked)
						.map((department) => department.id),
				};

				const newData = await createProcessHandler(payload);

				if (newData?.status) {
					// setIsUpdating(false);
					navigate(`${appPath}${modelsPath}/${newData?.data?.modelVersionID}`);
				} else {
					setIsUpdating(false);

					dispatch(
						showNotications({
							show: true,
							message:
								newData?.data?.detail ||
								newData?.data?.errors?.type?.[0] ||
								"Could not add model.",
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

	const handleDuplicateModel = async () => {
		setIsUpdating(true);

		const payload = {
			name: input.name,
			modelName: input.model || null,
			type: input.modelTemplateType || null,
			modelTypeID: input.type.value,
			serialNumberRange: input.serialNumberRange || null,
		};

		const newData = await createProcessHandler(payload);

		if (newData?.status) {
			navigate(`${appPath}${modelsPath}/${newData.data.modelVersionID}`);
		} else {
			dispatch(
				showNotications({
					show: true,
					message:
						newData?.data?.errors?.modelId?.[0] ||
						newData?.data?.errors?.modelVersionId?.[0] ||
						newData?.data?.detail ||
						"Could not duplicate model.",
					severity: "error",
				})
			);
		}

		setIsUpdating(false);
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="medium-application-dailog"
				disableEnforceFocus={isChrome() ? modelFocus : false}
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{
							<ADD.HeaderText>
								{title}
								{customCaptions?.modelTemplate ?? "Model"}
							</ADD.HeaderText>
						}
					</DialogTitle>
					<ADD.ButtonContainer>
						<div className="modalButton">
							<ADD.CancelButton
								onClick={closeOverride}
								variant="contained"
								onFocus={(e) => {
									setModelFocus(true);
								}}
							>
								Cancel
							</ADD.CancelButton>
						</div>
						<div className="modalButton">
							<ADD.ConfirmButton
								onClick={
									isDuplicate ? handleDuplicateModel : handleCreateProcess
								}
								variant="contained"
								className={classes.createButton}
								disabled={isUpdating}
							>
								{isShareModel
									? "Transfer"
									: isDuplicate
									? "Duplicate"
									: `Add ${customCaptions?.modelTemplate ?? "Model"}`}
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					{application?.allowFacilityBasedModels &&
						application?.allowIndividualAssetModels && (
							<ADD.InputContainer>
								<ADD.LeftInputContainer>
									<ADD.NameLabel>
										{customCaptions?.modelTemplate ?? "Model Template"}
									</ADD.NameLabel>
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
						)}
					<ADD.InputContainer>
						{(input.modelTemplateType === "A" ||
							application?.allowIndividualAssetModels) &&
						(input.modelTemplateType !== "F" ||
							!application?.allowFacilityBasedModels) ? (
							<ADD.LeftInputContainer>
								<ADD.NameLabel>
									{customCaptions?.make}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>
								<ADD.NameInput
									variant="standard"
									error={errors.name === null ? false : true}
									helperText={errors.name === null ? null : errors.name}
									value={input.name}
									onChange={(e) => {
										setInput({ ...input, name: e.target.value });
									}}
								/>
							</ADD.LeftInputContainer>
						) : (
							<ADD.FullWidthContainer>
								<ADD.NameLabel>
									{customCaptions?.modelTemplate ?? "Model Template"}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>
								<ADD.NameInput
									variant="standard"
									error={errors.name === null ? false : true}
									helperText={errors.name === null ? null : errors.name}
									value={input.name}
									onChange={(e) => {
										setInput({ ...input, name: e.target.value });
									}}
								/>
							</ADD.FullWidthContainer>
						)}

						{(input.modelTemplateType === "A" ||
							application?.allowIndividualAssetModels) &&
							(input.modelTemplateType !== "F" ||
								!application?.allowFacilityBasedModels) && (
								<ADD.RightInputContainer>
									<ADD.NameLabel>{customCaptions?.model}</ADD.NameLabel>
									<ADD.NameInput
										variant="standard"
										error={errors.model === null ? false : true}
										helperText={errors.model === null ? null : errors.model}
										required
										value={input.model}
										onChange={(e) => {
											setInput({ ...input, model: e.target.value });
										}}
									/>
								</ADD.RightInputContainer>
							)}
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.FullWidthContainer>
							<ADD.NameLabel>
								{customCaptions?.modelType}
								<ADD.RequiredStar>*</ADD.RequiredStar>
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
									placeholder={`Select ${customCaptions?.modelType}`}
									required={true}
									width="100%"
									isError={errors.type === null ? false : true}
								/>
							</ErrorInputFieldWrapper>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
					{application?.showSerialNumberRange &&
						input.modelTemplateType === "A" && (
							<ADD.InputContainer>
								<ADD.FullWidthContainer>
									<ADD.NameLabel>
										{customCaptions?.serialNumberRange}
									</ADD.NameLabel>
									<ADD.NameInput
										variant="standard"
										error={errors.serialNumberRange === null ? false : true}
										helperText={
											errors.serialNumberRange === null ? null : errors.name
										}
										value={input.serialNumberRange}
										onChange={(e) => {
											setInput({ ...input, serialNumberRange: e.target.value });
										}}
									/>
								</ADD.FullWidthContainer>
							</ADD.InputContainer>
						)}
					<ADD.InputContainer>
						<ADD.FullWidthContainer>
							<Departments
								listOfDepartment={availableDepartments}
								customCaptions={customCaptions}
								isReadOnly={false}
								isPublished={false}
								setRegisteredDepartments={setRegisteredDepartments}
								isDuplicate={isDuplicate}
								onBlur={() => {
									setModelFocus(false);
								}}
							/>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewModelDetail;
