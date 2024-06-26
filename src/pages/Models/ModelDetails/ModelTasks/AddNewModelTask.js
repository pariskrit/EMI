import React, { useContext, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	InputAdornment,
	LinearProgress,
} from "@mui/material";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import * as yup from "yup";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AddDialogStyle from "styles/application/AddDialogStyle";
import {
	generateErrorState,
	handleSort,
	handleValidateObj,
	isChrome,
	makeTableAutoScrollAndExpand,
} from "helpers/utils";
import Dropdown from "components/Elements/Dropdown";
import { useDispatch } from "react-redux";
import EMICheckbox from "components/Elements/EMICheckbox";
import { getOperatingModes } from "services/clients/sites/siteApplications/operatingModes";
import { getSystems } from "services/clients/sites/siteApplications/systems";
import { showError } from "redux/common/actions";
import { getActions } from "services/clients/sites/siteApplications/actions";
import { getModelRolesList } from "services/models/modelDetails/modelRoles";
import { ModelContext } from "contexts/ModelDetailContext";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.max(255, "The field Name must be a string with a maximum length of 255")
		.required("Name is required"),
	actionID: yup.string("This field must be string").nullable(),
	operatingModeID: yup.string().nullable(),
	systemID: yup.string().nullable(),
	roles: yup.array().nullable(),
	estimatedMinutes: yup.string().nullable(),
	safetyCritical: yup.boolean().nullable(),
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
	inputText: {
		fontSize: 14,
	},
}));

// Default state schemas
const defaultErrorSchema = {
	name: null,
	actionID: null,
	operatingModeID: null,
	systemID: null,
	roles: null,
	estimatedMinutes: null,
	safetyCritical: null,
};
const defaultStateSchema = {
	name: "",
	actionID: null,
	operatingModeID: null,
	systemID: null,
	roles: [],
	estimatedMinutes: "",
	safetyCritical: false,
};

function AddNewModelTask({
	open,
	closeHandler,
	siteId,
	data,
	title,
	createProcessHandler,
	modelId,
	fetchData,
	isDuplicate = false,
	customCaptions,
	totalTaskCount,
	showSave,
}) {
	// Init hooks
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [operatingModes, setOperatingModes] = useState([]);
	// const [systems, setSystems] = useState([]);
	const [modelRoles, setModelRoles] = useState([]);
	// const [actions, setActions] = useState([]);
	const [apiRoles, setApiRoles] = useState([]);

	const [modelFocus, setModelFocus] = useState(true);

	const [, Ctxdispatch] = useContext(ModelContext);

	useEffect(() => {
		if (open && !isDuplicate) {
			const getFormData = async () => {
				setIsUpdating(true);
				try {
					const response = await Promise.all([
						getOperatingModes(siteId),
						getModelRolesList(modelId),
						getSiteApplicationDetail(siteId),
					]);
					const [
						operatingModes,
						modelRolesResponse,
						siteApplications,
					] = response;
					if (operatingModes.status) {
						setOperatingModes(
							operatingModes.data.map((list) => ({
								label: list.name,
								value: list.id,
							}))
						);
					}

					if (modelRolesResponse.status) {
						setModelRoles(modelRolesResponse?.data);

						if (modelRolesResponse.data.length === 1) {
							let firstData = modelRolesResponse?.data[0];

							firstData = {
								...firstData,
								modelVersionRoleID: firstData?.id,
							};

							setApiRoles([firstData]);
							setInput((prev) => ({
								...prev,
								roles: [firstData?.id],
							}));
						} else {
							setApiRoles(
								modelRolesResponse?.data.map((role) => ({
									...role,
									id: null,
									modelVersionRoleID: role?.id,
								}))
							);
						}
					}
					if (siteApplications.status) {
						const tempOperatingMode = operatingModes?.data.find(
							(mode) =>
								mode.id === siteApplications?.data?.defaultOperatingModeID
						);

						if (tempOperatingMode) {
							setInput((prev) => ({
								...prev,
								operatingModeID: {
									label: tempOperatingMode?.name,
									value: tempOperatingMode?.id,
								},
							}));
						}
					}
				} catch (error) {
					dispatch(showError(error?.response?.data));
				} finally {
					setIsUpdating(false);
				}
			};
			getFormData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, siteId, modelId, dispatch, isDuplicate]);

	useEffect(() => {
		if (data) {
			setInput(data);
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

		try {
			const cleanInput = {
				...input,
				operatingModeID: input?.operatingModeID?.value || null,
				systemID: input?.systemID?.value || null,
				roles: input?.roles || null,
				actionID: input?.actionID?.value || null,
				estimatedMinutes: input?.estimatedMinutes || 0,
			};
			const localChecker = await handleValidateObj(schema, cleanInput);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await createProcessHandler({
					...cleanInput,
					roles: cleanInput.roles !== null ? [...cleanInput.roles] : null,
				});
				if (newData.status) {
					await fetchData();
					Ctxdispatch({
						type: "TAB_COUNT",
						payload: { countTab: "taskCount", data: totalTaskCount + 1 },
					});
					closeOverride();
					makeTableAutoScrollAndExpand(newData?.data);
				} else {
					setIsUpdating(false);
					dispatch(showError(newData?.data?.title || "something went wrong"));
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
			dispatch(showError(err?.response?.data || "something went wrong"));
		}
	};

	const handleCheckListClick = (id, clickedData) => {
		const roleToFind = apiRoles.find((r) => r.modelVersionRoleID === id);

		if (roleToFind?.id === null) {
			setInput({
				...input,
				roles: [...input.roles, roleToFind.modelVersionRoleID],
			});
			setApiRoles([
				...apiRoles.map((role) =>
					role.modelVersionRoleID === id
						? { ...role, id: role.modelVersionRoleID }
						: role
				),
			]);
		} else {
			setInput({
				...input,
				roles: [...input.roles.filter((role) => role !== id)],
			});

			setApiRoles([
				...apiRoles.map((role) =>
					role.modelVersionRoleID === id ? { ...role, id: null } : role
				),
			]);
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
								{showSave ? "Cancel" : "Close"}
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
							<ADD.NameLabel>{customCaptions?.actionRequired}</ADD.NameLabel>
							<Dropdown
								// options={actions}
								selectedValue={input.actionID}
								onChange={(e) => {
									setInput({ ...input, actionID: e });
								}}
								label=""
								placeholder={`Select ${customCaptions?.actionRequired}`}
								width="100%"
								disabled={isDuplicate}
								fetchData={() => getActions(siteId)}
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>
								Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								value={input.name}
								onChange={(e) => {
									setInput({ ...input, name: e.target.value });
								}}
								variant="outlined"
								fullWidth
								autoFocus
								disabled={isDuplicate}
								onKeyDown={handleEnterPress}
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>{customCaptions?.operatingMode}</ADD.NameLabel>
							<Dropdown
								options={operatingModes}
								selectedValue={input.operatingModeID}
								onChange={(e) => {
									setInput({ ...input, operatingModeID: e });
								}}
								label=""
								placeholder={`Select ${customCaptions?.operatingMode}`}
								width="100%"
								disabled={isDuplicate}
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>{customCaptions?.system}</ADD.NameLabel>
							<Dropdown
								// options={systems}
								selectedValue={input.systemID}
								onChange={(e) => {
									setInput({ ...input, systemID: e });
								}}
								label=""
								placeholder={`Select ${customCaptions?.system}`}
								width="100%"
								disabled={isDuplicate}
								fetchData={() => getSystems(siteId)}
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<DyanamicDropdown
								isServerSide={false}
								width="100%"
								placeholder={`Select ${customCaptions?.role}`}
								dataHeader={[{ id: 1, name: "Roles" }]}
								columns={[{ id: 1, name: "name" }]}
								dataSource={modelRoles ?? []}
								label={customCaptions?.rolePlural}
								showHeader
								handleSort={handleSort}
								selectedValue={
									apiRoles
										?.filter((r) => r.id !== null)
										?.map((r) => r.name)
										?.join(", ") ?? ""
								}
								rolesChecklist={
									apiRoles
										?.filter((r) => r.id !== null)
										?.map((r) => ({
											id: r?.id,
											name: r?.name,
										})) ?? []
								}
								hasCheckBoxList={true}
								checklistChangeHandler={handleCheckListClick}
								disabled={isDuplicate}
								required
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>
								<div className="caption-label">
									<span>
										Estimated Minutes{" "}
										<span style={{ color: "#E31212" }}>*</span>{" "}
									</span>
								</div>
							</ADD.NameLabel>
							<ADD.NameInput
								value={input.estimatedMinutes}
								onChange={(e) => {
									setInput({ ...input, estimatedMinutes: e.target.value });
								}}
								variant="outlined"
								type="number"
								fullWidth
								InputProps={{
									classes: {
										input: classes.inputText,
									},
									startAdornment: (
										<InputAdornment
											style={{ marginRight: 10 }}
											position="start"
										>
											<QueryBuilderIcon />
										</InputAdornment>
									),
								}}
								disabled={isDuplicate}
								onKeyDown={handleEnterPress}
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.CheckboxLabel>
								<EMICheckbox
									state={input.safetyCritical}
									changeHandler={() => {
										setInput({
											...input,
											safetyCritical: !input.safetyCritical,
										});
									}}
									disabled={isDuplicate}
									onBlur={() => {
										setModelFocus(false);
									}}
									onKeyDown={() => {
										setInput({
											...input,
											safetyCritical: !input.safetyCritical,
										});
									}}
								/>
								{customCaptions?.safetyCritical}
							</ADD.CheckboxLabel>
						</ADD.LeftInputContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewModelTask;
