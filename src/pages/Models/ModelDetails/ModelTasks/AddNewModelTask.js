import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	InputAdornment,
	LinearProgress,
} from "@material-ui/core";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import Dropdown from "components/Elements/Dropdown";
import { useDispatch } from "react-redux";
import EMICheckbox from "components/Elements/EMICheckbox";
import { getOperatingModes } from "services/clients/sites/siteApplications/operatingModes";
import { getSystems } from "services/clients/sites/siteApplications/systems";
import { showError } from "redux/common/actions";
import { getActions } from "services/clients/sites/siteApplications/actions";
import { getModelRolesList } from "services/models/modelDetails/modelRoles";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup.string("This field must be a string").required("Name is required"),
	actionID: yup.string("This field must be string").nullable(),
	operatingModeID: yup.string().nullable(),
	systemID: yup.string().nullable(),
	roles: yup.string().nullable(),
	estimatedMinutes: yup.string().nullable(),
	safetyCritical: yup.boolean().nullable(),
});

const useStyles = makeStyles({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	createButton: {
		width: "auto",
	},
	inputText: {
		fontSize: 14,
	},
});

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
	roles: null,
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
}) {
	// Init hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [operatingModes, setOperatingModes] = useState([]);
	const [systems, setSystems] = useState([]);
	const [modelRoles, setModelRoles] = useState([]);
	const [actions, setActions] = useState([]);

	useEffect(() => {
		if (open && !isDuplicate) {
			const getFormData = async () => {
				setIsUpdating(true);
				try {
					const response = await Promise.all([
						getOperatingModes(siteId),
						getSystems(siteId),
						getModelRolesList(modelId),
						getActions(siteId),
					]);
					const [operatingModes, systems, modelRoles, siteActions] = response;
					if (operatingModes.status) {
						setOperatingModes(
							operatingModes.data.map((list) => ({
								label: list.name,
								value: list.id,
							}))
						);
					}
					if (systems.status) {
						setSystems(
							systems.data.map((list) => ({
								label: list.name,
								value: list.id,
							}))
						);
					}
					if (modelRoles.status) {
						setModelRoles(
							modelRoles.data.map((list) => ({
								label: list.name,
								value: list.id,
							}))
						);
					}
					if (siteActions.status) {
						setActions(
							siteActions.data.map((list) => ({
								label: list.name,
								value: list.id,
							}))
						);
					}
				} catch (error) {
					console.log("error ", error);
					dispatch(showError(error?.response?.data));
				} finally {
					setIsUpdating(false);
				}
			};
			getFormData();
		}
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
				roles: input?.roles?.value || null,
				actionID: input?.actionID?.value || null,
				estimatedMinutes: input?.estimatedMinutes || 0,
			};
			const localChecker = await handleValidateObj(schema, cleanInput);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await createProcessHandler({
					...cleanInput,
					roles: cleanInput.roles !== null ? [cleanInput.roles] : null,
				});
				if (newData.status) {
					setIsUpdating(false);
					fetchData();
					closeOverride();
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
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>{customCaptions?.actionRequired}</ADD.NameLabel>
							<Dropdown
								options={actions}
								selectedValue={input.actionID}
								onChange={(e) => {
									setInput({ ...input, actionID: e });
								}}
								label=""
								placeholder={`Select ${customCaptions?.actionRequired}`}
								width="100%"
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
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>{customCaptions?.system}</ADD.NameLabel>
							<Dropdown
								options={systems}
								selectedValue={input.systemID}
								onChange={(e) => {
									console.log(e);
									setInput({ ...input, systemID: e });
								}}
								label=""
								placeholder={`Select ${customCaptions?.system}`}
								width="100%"
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>{customCaptions?.rolePlural}</ADD.NameLabel>
							<Dropdown
								options={modelRoles}
								selectedValue={input.roles}
								onChange={(e) => {
									console.log(e);
									setInput({ ...input, roles: e });
								}}
								label=""
								placeholder={`Select ${customCaptions?.role}`}
								width="100%"
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>Estimated Minutes</ADD.NameLabel>
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
								/>
								{customCaptions?.safetyCritical}?
							</ADD.CheckboxLabel>
						</ADD.LeftInputContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewModelTask;
