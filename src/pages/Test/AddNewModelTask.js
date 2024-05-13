// import React, { useEffect, useState } from "react";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogTitle,
// 	FormControlLabel,
// 	LinearProgress,
// 	Radio,
// 	RadioGroup,
// } from "@mui/material";
// import * as yup from "yup";
// import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from "@mui/styles";

// import AddDialogStyle from "styles/application/AddDialogStyle";
// import { generateErrorState, handleValidateObj } from "helpers/utils";
// import Dropdown from "components/Elements/Dropdown";
// import { getModelTypes } from "services/clients/sites/siteApplications/modelTypes";
// import { getSiteLocations } from "services/clients/sites/siteLocations";
// import { showNotications } from "redux/notification/actions";
// import { useDispatch } from "react-redux";

// // Init styled components
// const ADD = AddDialogStyle();

// // Yup validation schema
// const schema = yup.object({
// 	name: yup.string("This field must be a string").required("Name is required"),
// });

// const useStyles =  makeStyles()((theme) =>({
// 	dialogContent: {
// 		width: 500,
// 	},
// 	createButton: {
// 		width: "auto",
// 	},
// }))

// // Default state schemas
// const defaultErrorSchema = {
// 	name: null,
// };
// const defaultStateSchema = {
// 	action: "",
// 	name: "",
// 	OperatingModel: {},
// 	system: {},
// 	roles: {},
// 	EstimatedMinutes: "",
// 	SafetyCritical: false,
// };

// function AddNewModelDetail({
// 	open,
// 	closeHandler,
// 	siteId,
// 	data,
// 	title,
// 	createProcessHandler,
// }) {
// 	// Init hooks
// 	const { classes,cx } = useStyles()
// 	const dispatch = useDispatch();

// 	// Init state
// 	const [isUpdating, setIsUpdating] = useState(false);
// 	const [input, setInput] = useState(data || defaultStateSchema);
// 	const [errors, setErrors] = useState(defaultErrorSchema);
// 	const [modelTypes, setModelTypes] = useState([]);
// 	const [locations, setLocations] = useState([]);

// 	// get model types for dropdown
// 	useEffect(() => {
// 		if (open) {
// 			const getFormData = async () => {
// 				const response = await Promise.all([
// 					getModelTypes(siteId),
// 					getSiteLocations(siteId),
// 				]);
// 				const [modeltypeslist, locationList] = response;
// 				if (modeltypeslist.status === true) {
// 					setModelTypes(
// 						modeltypeslist.data.map((list) => ({
// 							label: list.name,
// 							value: list.id,
// 						}))
// 					);
// 				}
// 				if (locationList.status === true) {
// 					setLocations(
// 						locationList.data.map((list) => ({
// 							label: list.name,
// 							value: list.id,
// 						}))
// 					);
// 				}
// 				setIsUpdating(false);
// 			};
// 			// getFormData();
// 		}
// 	}, [open, siteId]);

// 	const closeOverride = () => {
// 		// Clearing input state and errors
// 		setInput(defaultStateSchema);
// 		setErrors(defaultErrorSchema);

// 		closeHandler();
// 	};

// 	const handleCreateProcess = async () => {
// 		// Rendering spinner
// 		setIsUpdating(true);

// 		// Clearing errors before attempted create
// 		setErrors(defaultErrorSchema);

// 		// cleaned Input

// 		try {
// 			const localChecker = await handleValidateObj(schema, input);
// 			console.log(localChecker);

// 			// Attempting API call if no local validaton errors
// 			if (!localChecker.some((el) => el.valid === false)) {
// 				const newData = await createProcessHandler(input);
// 				if (newData.status === 201) {
// 					setIsUpdating(false);
// 					// push to model details
// 					console.log("model details posted");
// 				} else {
// 					setIsUpdating(false);
// 					dispatch(
// 						showNotications({
// 							show: true,
// 							message: "Could not add model intial data.",
// 							severity: "error",
// 						})
// 					);
// 				}
// 			} else {
// 				// show validation errors
// 				const newErrors = generateErrorState(localChecker);
// 				setErrors({ ...errors, ...newErrors });
// 				setIsUpdating(false);
// 			}
// 		} catch (err) {
// 			// TODO: handle non validation errors here

// 			setIsUpdating(false);
// 			setErrors({ ...errors, ...err?.response?.data?.errors });
// 		}
// 	};

// 	return (
// 		<div>
// 			<Dialog
// 				open={open}
// 				onClose={closeOverride}
// 				aria-labelledby="alert-dialog-title"
// 				aria-describedby="alert-dialog-description"
// 				className="application-dailog"
// 			>
// 				{isUpdating ? <LinearProgress /> : null}

// 				<ADD.ActionContainer>
// 					<DialogTitle id="alert-dialog-title">
// 						{<ADD.HeaderText>{title}</ADD.HeaderText>}
// 					</DialogTitle>
// 					<ADD.ButtonContainer>
// 						<div className="modalButton">
// 							<ADD.CancelButton onClick={closeOverride} variant="contained">
// 								Cancel
// 							</ADD.CancelButton>
// 						</div>
// 						<div className="modalButton">
// 							<ADD.ConfirmButton
// 								onClick={handleCreateProcess}
// 								variant="contained"
// 								className={classes.createButton}
// 								disabled={isUpdating}
// 							>
// 								{title}
// 							</ADD.ConfirmButton>
// 						</div>
// 					</ADD.ButtonContainer>
// 				</ADD.ActionContainer>

// 				<DialogContent className={classes.dialogContent}>
// 					<ADD.InputContainer>
// 						<ADD.LeftInputContainer>
// 							<ADD.NameLabel>
// 								Name<ADD.RequiredStar>*</ADD.RequiredStar>
// 							</ADD.NameLabel>
// 							<ADD.NameInput
// 								error={errors.name === null ? false : true}
// 								helperText={errors.name === null ? null : errors.name}
// 								value={input.name}
// 								onChange={(e) => {
// 									setInput({ ...input, name: e.target.value });
// 								}}
// 							/>
// 						</ADD.LeftInputContainer>

// 						<ADD.RightInputContainer>
// 							<ADD.NameLabel>Action</ADD.NameLabel>
// 							<ADD.NameInput
// 								value={input.action}
// 								onChange={(e) => {
// 									setInput({ ...input, action: e.target.value });
// 								}}
// 							/>
// 						</ADD.RightInputContainer>
// 					</ADD.InputContainer>
// 					<ADD.InputContainer>
// 						<ADD.FullWidthContainer>
// 							<ADD.NameLabel>Operating Mode</ADD.NameLabel>
// 							<Dropdown
// 								options={modelTypes}
// 								selectedValue={input.type}
// 								onChange={(e) => {
// 									setInput({ ...input, type: e });
// 								}}
// 								label=""
// 								placeholder="Select Type"
// 								width="100%"
// 							/>
// 						</ADD.FullWidthContainer>
// 					</ADD.InputContainer>
// 					<ADD.InputContainer>
// 						<ADD.FullWidthContainer>
// 							<ADD.NameLabel>Location</ADD.NameLabel>
// 							<Dropdown
// 								options={locations}
// 								selectedValue={input.location}
// 								onChange={(e) => {
// 									console.log(e);
// 									setInput({ ...input, location: e });
// 								}}
// 								label=""
// 								placeholder="Select Location"
// 								width="100%"
// 							/>
// 						</ADD.FullWidthContainer>
// 					</ADD.InputContainer>
// 					<ADD.InputContainer>
// 						<ADD.LeftInputContainer>
// 							<ADD.NameLabel>Model Template Type</ADD.NameLabel>
// 							<RadioGroup
// 								aria-label="ModelTemplateType"
// 								name="ModelTemplateType"
// 								value={input.modelTemplateType}
// 								onChange={(e) =>
// 									setInput({ ...input, modelTemplateType: e.target.value })
// 								}
// 								required
// 							>
// 								<FormControlLabel
// 									value="F"
// 									control={<Radio color="default" />}
// 									label="Facility-Based"
// 								/>
// 								<FormControlLabel
// 									value="A"
// 									control={<Radio color="default" />}
// 									label="Asset-Based"
// 								/>
// 							</RadioGroup>
// 						</ADD.LeftInputContainer>
// 					</ADD.InputContainer>
// 				</DialogContent>
// 			</Dialog>
// 		</div>
// 	);
// }

// export default AddNewModelDetail;
