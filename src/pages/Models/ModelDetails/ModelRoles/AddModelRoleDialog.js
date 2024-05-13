import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	Divider,
} from "@mui/material";
import * as yup from "yup";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";
import Typography from "@mui/material/Typography";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj, isChrome } from "helpers/utils";
import Dropdown from "components/Elements/Dropdown";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { getSiteAppRoles } from "services/models/modelDetails/modelRoles";
import { getAvailabeleModelDeparments } from "services/models/modelDetails/details";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import DyanamicDropdown from "components/Elements/DyamicDropdown";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string()
		.max(100, "The field Name must be a string with a maximum length of 100")
		.required("Role Name is required"),
	roleID: yup
		.string("Map to Service Role is Required")
		.required("Map to Service Role is Required"),
	siteDepartmentID: yup.string("Department name is Required").nullable(),
});

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	createButton: {
		// width: "auto",
	},
	descriptionText: {
		fontSize: "1em",
		margin: 0,
		padding: 0,
		fontStyle: "italic",
	},
}));

// Default state schemas
const defaultErrorSchema = { roleID: null, name: null, siteDepartmentID: null };
const defaultStateSchema = {
	roleID: {},
	name: "",
	siteDepartmentID: {
		id: null,
		siteDepartmentID: null,
		name: "All",
		description: "",
	},
};

function AddNewModelRole({
	open,
	closeHandler,
	data,
	title,
	createProcessHandler,
	siteAppId,
	fetchModelRoles,
	mappedRoleName,
	customCaptions,
	showSave,
	modelId,
	mappedDepartmentName,
}) {
	// Init hooks
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [department, setDepartments] = useState([
		{
			id: null,
			siteDepartmentID: null,
			name: "All",
			description: "",
		},
	]);
	const [modelFocus, setModelFocus] = useState(true);
	// const [siteRoles, setSiteRoles] = useState([]);

	// get model types for dropdown
	// useEffect(() => {
	// 	if (open) {
	// 		setIsUpdating(true);
	// 		const getFormData = async () => {
	// 			const response = await getSiteAppRoles(siteAppId);
	// 			if (response.status) {
	// 				setSiteRoles(
	// 					response.data.map((list) => ({
	// 						label: list.name,
	// 						value: list.id,
	// 					}))
	// 				);
	// 			}
	// 			setIsUpdating(false);
	// 		};
	// 		getFormData();
	// 	}
	// }, [open, siteAppId]);

	useEffect(() => {
		if (data && open) {
			setInput({
				...data,
				roleID: { label: mappedRoleName, value: data?.roleID },
				siteDepartmentID: {
					name: mappedDepartmentName,
					id: data?.siteDepartmentID,
					siteDepartmentID: data?.siteDepartmentID,
				},
			});
		}
	}, [data, open, mappedRoleName, mappedDepartmentName]);

	useEffect(() => {
		if (open) {
			async function getDepartments() {
				const response = await getAvailabeleModelDeparments(modelId);
				let finalData = response.data?.map((x) => ({
					...x,
					id: x?.siteDepartmentID,
					name: x?.name || "All",
				}));
				setDepartments(finalData);
				if (finalData?.length === 1 && !data) {
					setInput({
						...input,
						siteDepartmentID: finalData[0],
					});
				}
			}
			getDepartments();
		}
	}, [open, modelId]);

	//display error popup
	const displayError = (errorMessage, response) =>
		dispatch(showError(errorMessage || "Something went wrong"));

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

		try {
			const payload = {
				...input,
				roleID: input?.roleID?.value,
				siteDepartmentID: input?.siteDepartmentID?.siteDepartmentID,
			};

			const localChecker = await handleValidateObj(schema, payload);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await createProcessHandler(payload);

				if (newData.status) {
					closeOverride();
					fetchModelRoles();
					setIsUpdating(false);
				} else {
					setIsUpdating(false);
					displayError(newData?.data?.detail, newData?.data);
				}
			} else {
				// show validation errors
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here
			displayError("Something went wrong");
			setIsUpdating(false);
			setErrors({ ...errors, ...err?.response?.data?.errors });
		}
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleCreateProcess();
		}
	};

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth="md"
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="application-dailog"
				disableEnforceFocus={isChrome() ? modelFocus : false}
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>{title}</ADD.HeaderText>}
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
								onClick={handleCreateProcess}
								variant="contained"
								className={classes.createButton}
								disabled={isUpdating}
							>
								{showSave ? "Close" : title}
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
					<Divider />
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								Name
								<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								value={input.name}
								onChange={(e) => {
									setInput({ ...input, name: e.target.value });
								}}
								onKeyDown={handleEnterPress}
								variant="outlined"
								fullWidth
								autoFocus
								id="roleName"
							/>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ADD.NameLabel>
								Map To {customCaptions?.service} {customCaptions?.role}
								<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={errors.roleID === null ? null : errors.roleID}
							>
								<Dropdown
									// options={siteRoles}
									selectedValue={input.roleID}
									onChange={(e) => {
										setInput((prev) => ({ ...prev, roleID: e }));
										if (input.name === "") {
											setInput((prev) => ({ ...prev, name: e?.label }));
											document.getElementById("roleName").focus();
										}
									}}
									label=""
									placeholder="Select Role"
									required={true}
									width="100%"
									isError={errors.roleID === null ? false : true}
									fetchData={() => getSiteAppRoles(siteAppId)}
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>

					<ADD.InputContainer>
						<ADD.LeftInputContainer
							onBlur={() => {
								setModelFocus(false);
							}}
						>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.siteDepartmentID === null
										? null
										: errors.siteDepartmentID
								}
							>
								<DyanamicDropdown
									dataHeader={[
										{
											id: 1,
											name: `${customCaptions?.department ?? "Department"}`,
										},
										{
											id: 2,
											name: `${customCaptions?.location ?? "Location"}`,
										},
									]}
									showHeader
									columns={[
										{ id: 1, name: "name" },
										{ id: 2, name: "description" },
									]}
									selectdValueToshow={"name"}
									dataSource={department}
									selectedValue={input?.siteDepartmentID}
									onChange={(e) => {
										setInput((prev) => ({ ...prev, siteDepartmentID: e }));
									}}
									label={customCaptions.department}
									placeholder="Select Department"
									showClear
									onClear={() =>
										setInput((prev) => ({
											...prev,
											siteDepartmentID: defaultStateSchema?.siteDepartmentID,
										}))
									}
									width="100%"
									isError={errors.siteDepartmentID === null ? false : true}
								/>
							</ErrorInputFieldWrapper>
							<Typography className={classes.descriptionText}>
								{customCaptions?.servicePlural} for this {customCaptions.role}{" "}
								will always be assigned to the following{" "}
								{customCaptions.department}
							</Typography>
						</ADD.LeftInputContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewModelRole;
