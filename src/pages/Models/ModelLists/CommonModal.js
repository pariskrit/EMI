import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	LinearProgress,
	Radio,
	RadioGroup,
} from "@material-ui/core";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import Dropdown from "components/Elements/Dropdown";
import { getModelTypes } from "services/clients/sites/siteApplications/modelTypes";
import { getSiteLocations } from "services/clients/sites/siteLocations";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { showNotications } from "redux/notification/actions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { modelsPath } from "helpers/routePaths";

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

	location: yup.number("This field must be a string").nullable(),
	modelTemplateType: yup.string("This field must be a string").nullable(),
	serialNumberRange: yup.string("This field must be a string").nullable(),
});

const useStyles = makeStyles({
	dialogContent: {
		width: 500,
	},
	createButton: {
		// width: "auto",
	},
});

// Default state schemas
const defaultErrorSchema = {
	name: null,
	model: null,
	type: null,
	location: null,
	modelTemplateType: "F",
	serialNumberRange: null,
};
const defaultStateSchema = {
	name: "",
	model: "",
	type: {},
	location: {},
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
}) {
	// Init hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [modelTypes, setModelTypes] = useState([]);
	const [locations, setLocations] = useState([]);
	const { application, customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const history = useHistory();

	// get model types for dropdown
	useEffect(() => {
		if (open && !isDuplicate) {
			setIsUpdating(true);
			const getFormData = async () => {
				const response = await Promise.all([
					getModelTypes(siteId),
					getSiteLocations(siteId),
				]);
				const [modeltypeslist, locationList] = response;
				if (modeltypeslist.status === true) {
					setModelTypes(
						modeltypeslist.data.map((list) => ({
							label: list.name,
							value: list.id,
						}))
					);
				}
				if (locationList.status === true) {
					setLocations(
						locationList.data.map((list) => ({
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
		if (data) {
			setInput(() => ({
				...data,
				type: { label: data.modelType, value: 0 },
				location: { label: data.locationName, value: 0 },
				model: data.modelName,
			}));
		}
	}, [data]);

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
			location: input?.location?.value || null,
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
					siteLocationID: input.location.value || null,
					serialNumberRange: input.serialNumberRange || null,
				};

				const newData = await createProcessHandler(payload);

				if (newData.status) {
					// setIsUpdating(false);
					history.push(`${modelsPath}/${newData?.data?.modelVersionID}`);
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

		const newData = await createProcessHandler();

		if (newData.status) {
			history.push(`${modelsPath}/${newData.data.modelVersionID}`);
		} else {
			console.log(newData);
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
	console.log(input);
	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="medium-application-dailog"
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
								onClick={
									isDuplicate ? handleDuplicateModel : handleCreateProcess
								}
								variant="contained"
								className={classes.createButton}
								disabled={isUpdating}
							>
								{isDuplicate ? "Duplicate" : title}
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					{application?.allowFacilityBasedModels &&
						application?.allowIndividualAssetModels && (
							<ADD.InputContainer>
								<ADD.LeftInputContainer>
									<ADD.NameLabel>{customCaptions?.modelTemplate}</ADD.NameLabel>
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
						{application?.showModel && input.modelTemplateType === "A" ? (
							<ADD.LeftInputContainer>
								<ADD.NameLabel>
									{customCaptions?.make}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>
								<ADD.NameInput
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
									{customCaptions?.make}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>
								<ADD.NameInput
									error={errors.name === null ? false : true}
									helperText={errors.name === null ? null : errors.name}
									value={input.name}
									onChange={(e) => {
										setInput({ ...input, name: e.target.value });
									}}
								/>
							</ADD.FullWidthContainer>
						)}

						{application?.showModel && input.modelTemplateType === "A" && (
							<ADD.RightInputContainer>
								<ADD.NameLabel>{customCaptions?.model}</ADD.NameLabel>
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
									placeholder="Select Type"
									required={true}
									width="100%"
									isError={errors.type === null ? false : true}
								/>
							</ErrorInputFieldWrapper>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
					{application?.showLocations && (
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
					)}
					{application?.showSerialNumberRange &&
						input.modelTemplateType === "A" && (
							<ADD.InputContainer>
								<ADD.FullWidthContainer>
									<ADD.NameLabel>Serial Number Range</ADD.NameLabel>
									<ADD.NameInput
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
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewModelDetail;
