import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@mui/material";
import * as yup from "yup";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AddDialogStyle from "styles/application/AddDialogStyle";
import {
	generateErrorState,
	handleSort,
	handleValidateObj,
	isChrome,
} from "helpers/utils";
import { useDispatch } from "react-redux";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getPublishedModel } from "services/models/modelList";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { showError } from "redux/common/actions";
import { defaultPageSize } from "helpers/utils";
import { getModelStage } from "services/models/modelDetails/modelStages";
import { getModelZonesList } from "services/models/modelDetails/modelZones";
import TextAreaInputField from "components/Elements/TextAreaInputField";
import ColourConstants from "helpers/colourConstants";
import { getPositions } from "services/clients/sites/siteApplications/userPositions";
import { getSiteDepartmentsInService } from "services/services/serviceLists";
import { getFeedbackClassifications } from "services/clients/sites/siteApplications/feedbackClassifications";
import { getDefaultFeedbackClassifications } from "services/clients/sites/siteApplications/feedbackClassifications";
import { getFeedbackStatuses } from "services/clients/sites/siteApplications/feedbackStatuses";
import { getFeedbackPriorities } from "services/clients/sites/siteApplications/feedbackPriorities";
import { getModelAvailableAsset } from "services/models/modelDetails/modelAsset";
import { getPositionUsers } from "services/feedback/feedbackdetails";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = () =>
	yup.object({
		assignPositionID: yup.string("This field must be a string").nullable(),
		siteDepartmentID: yup.string("This field must be a string").nullable(),
		assignUserID: yup.string("This field must be a string").nullable(),
		feedbackClassificationID: yup
			.string("This field must be a string")
			.required("The field is required"),
		feedbackStatusID: yup
			.string("This field must be a string")
			.required("The field is required"),
		feedbackPriorityID: yup
			.string("This field must be a string")
			.required("The field is required"),
		modelID: yup.string("This field is required").nullable(),
		siteAssetID: yup.string("This field is required").nullable(),
		modelVersionStageID: yup.string("This field must be a string").nullable(),
		modelVersionZoneID: yup.string("This field must be a string").nullable(),
		benefit: yup
			.string("This field must be a string")
			.required("The field is required"),
		changeRequired: yup
			.string("This field is required")
			.required("The field is required"),
	});

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: 500,
	},
	createButton: {
		// width: "auto",
	},
}));

// Default state schemas
const defaultErrorSchema = {
	assignPositionID: null,
	siteDepartmentID: null,
	assignUserID: null,
	feedbackClassificationID: null,
	feedbackStatusID: null,
	feedbackPriorityID: null,
	benefit: null,
	modelID: null,
	siteAssetID: null,
	modelVersionStageID: null,
	modelVersionZoneID: null,
	changeRequired: null,
};
const defaultStateSchema = {
	assignPositionID: {},
	siteDepartmentID: {},
	assignUserID: {},
	feedbackClassificationID: {},
	feedbackStatusID: {},
	feedbackPriorityID: {},
	benefit: "",
	modelID: {},
	siteAssetID: {},
	modelVersionStageID: {},
	modelVersionZoneID: {},
	changeRequired: "",
};

function AddNewFeedbackDetail({
	open,
	closeHandler,
	siteAppId,
	title,
	createProcessHandler,
	customCaptions,
	setSearchQuery,
	fetchData,
	setDataForFetchingFeedback,
	siteID,
}) {
	// Init hooks
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [availableModel, setAvailableModel] = useState([]);
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [dataSourceAfterModelChange, setDataSourceAfterModelChange] = useState(
		[]
	);
	const [positionUsers, setPositionUsers] = useState([]);
	const [modelFocus, setModelFocus] = useState(true);

	useEffect(() => {
		if (open) {
			async function fetchSiteApp() {
				setIsUpdating(true);
				try {
					const response = await getDefaultFeedbackClassifications(siteAppId);
					if (response.status) {
						setInput((prev) => ({
							...prev,
							feedbackClassificationID: {
								...response.data,
								id: response.data.defaultFeedbackClassificationID,
								name: response.data.defaultFeedbackClassificationName,
							},
							feedbackStatusID: {
								...response.data,
								id: response.data.defaultFeedbackStatusID,
								name: response.data.defaultFeedbackStatusName,
							},
							feedbackPriorityID: {
								...response.data,
								id: response.data.defaultFeedbackPriorityID,
								name: response.data.defaultFeedbackPriorityName,
							},
						}));
					}
				} catch (error) {}
				setIsUpdating(false);
			}
			fetchSiteApp();
		}
	}, [open, siteAppId]);

	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);
		closeHandler();
	};

	const handleCreateProcess = async () => {
		// clear search data
		setSearchQuery("");

		// Rendering spinner
		setIsUpdating(true);

		// Clearing errors before attempted create
		setErrors(defaultErrorSchema);

		// cleaned Input
		const cleanInput = {
			...input,
			siteAssetID: input?.siteAssetID?.siteAssetID || null,
			benefit: input?.benefit,
			modelVersionStageID: input?.modelVersionStageID?.id || null,
			modelVersionZoneID: input?.modelVersionZoneID?.id || null,
			assignPositionID: input?.assignPositionID?.id || null,
			siteDepartmentID: input?.siteDepartmentID?.id || null,
			assignUserID: input?.assignUserID?.id || null,
			feedbackClassificationID: input?.feedbackClassificationID?.id || "",
			feedbackStatusID: input?.feedbackStatusID?.id || "",
			feedbackPriorityID: input?.feedbackPriorityID?.id || "",
			modelID: input?.modelID?.id || null,
			changeRequired: input?.changeRequired,
		};

		try {
			const localChecker = await handleValidateObj(
				schema(input?.modelID?.modelTemplateType),
				cleanInput
			);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const payload = {
					...cleanInput,
					siteAppId: siteAppId,
				};

				const newData = await createProcessHandler(payload);

				if (newData.status === true) {
					setDataForFetchingFeedback({
						pageNumber: 1,
						pageSize: defaultPageSize(),
						search: "",
						sortField: "",
						sort: "",
					});
					await fetchData();
					setIsUpdating(false);
					closeOverride();
				} else {
					setIsUpdating(false);

					dispatch(
						showError(
							newData?.data?.detail ||
								"Failed to add new " + customCaptions?.feedback
						)
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

			dispatch(showError("Failed to add new feedback"));
		}
	};

	const modelid = input?.modelID?.id;

	useEffect(() => {
		const fetchModelAvailableAssest = async (id) => {
			const response = await getModelAvailableAsset(id);
			if (response.status) {
				let newDatas = response.data.map((d) => {
					return {
						...d,
						id: d.siteAssetID,
					};
				});
				setAvailableModel(newDatas);
			} else dispatch(showError("Could not fetch Users"));
		};
		if (modelid) {
			fetchModelAvailableAssest(modelid);
		}
	}, [modelid, dispatch]);

	const positionUserId = input?.assignPositionID?.id;

	useEffect(() => {
		const fetchPositionUser = async () => {
			const response = await getPositionUsers(positionUserId);

			if (response.status) {
				let newDatas = response.data.map((d) => {
					return {
						...d,
						id: d.userID,
					};
				});
				setPositionUsers(newDatas);
			} else dispatch(showError("Could not fetch Users"));
		};
		if (positionUserId) fetchPositionUser();
	}, [positionUserId, dispatch]);

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="large-application-dailog"
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
								{title}
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.assignPositionID === null
										? null
										: errors.assignPositionID
								}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.position}
									dataHeader={[{ id: 1, name: "Name" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={{
										...input["assignPositionID"],
									}}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											assignPositionID: val,
											assignUserID: {},
										});
									}}
									selectdValueToshow={"name"}
									label={customCaptions?.position}
									isError={errors.assignPositionID === null ? false : true}
									fetchData={() => getPositions(siteAppId)}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.siteDepartmentID === null
										? null
										: errors.siteDepartmentID
								}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.department}
									dataHeader={[
										{
											id: 1,
											name: `${customCaptions?.department ?? " Department"}`,
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
									selectedValue={{
										...input["siteDepartmentID"],
									}}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											siteDepartmentID: val,
										});
									}}
									selectdValueToshow={"name"}
									label={customCaptions?.department}
									isError={errors.siteDepartmentID === null ? false : true}
									fetchData={() => getSiteDepartmentsInService(siteID)}
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.assignUserID === null ? null : errors.assignUserID
								}
							>
								<DyanamicDropdown
									dataSource={positionUsers}
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.user}
									dataHeader={[{ id: 1, name: "Name" }]}
									columns={[{ id: 1, name: "displayName" }]}
									selectedValue={{
										...input["assignUserID"],
										name: input?.assignUserID?.displayName,
									}}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											assignUserID: val,
										});
									}}
									selectdValueToshow={"name"}
									label={customCaptions?.user}
									isError={errors.assignUserID === null ? false : true}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.feedbackClassificationID === null
										? null
										: errors.feedbackClassificationID
								}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.classification}
									dataHeader={[{ id: 1, name: customCaptions?.classification }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={{
										...input["feedbackClassificationID"],
									}}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											feedbackClassificationID: val,
										});
									}}
									selectdValueToshow={"name"}
									label={customCaptions?.classification}
									isError={
										errors.feedbackClassificationID === null ? false : true
									}
									required
									fetchData={() => getFeedbackClassifications(siteAppId)}
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.feedbackStatusID === null
										? null
										: errors.feedbackStatusID
								}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.feedbackStatus}
									dataHeader={[{ id: 1, name: "Name" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={{
										...input["feedbackStatusID"],
										name: input?.feedbackStatusID?.name,
									}}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											feedbackStatusID: val,
										});
									}}
									required
									selectdValueToshow={"name"}
									label={customCaptions?.feedbackStatus}
									isError={errors.feedbackStatusID === null ? false : true}
									fetchData={() => getFeedbackStatuses(siteAppId)}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.feedbackPriorityID === null
										? null
										: errors.feedbackPriorityID
								}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.priority}
									dataHeader={[{ id: 1, name: customCaptions?.priority }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={{
										...input["feedbackPriorityID"],
									}}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											feedbackPriorityID: val,
										});
									}}
									selectdValueToshow={"name"}
									label={customCaptions?.priority}
									isError={errors.feedbackPriorityID === null ? false : true}
									required
									fetchData={() => getFeedbackPriorities(siteAppId)}
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={errors.modelID === null ? null : errors.modelID}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.model}
									dataHeader={[
										{ id: 1, name: "Name" },
										{ id: 2, name: "Model" },
									]}
									columns={[
										{ id: 1, name: "name" },
										{ id: 2, name: "modelName" },
									]}
									showHeader
									selectedValue={{
										...input["modelID"],
										name: !input?.modelID?.name
											? ""
											: !input?.modelID?.modelName
											? input?.modelID?.name
											: input?.modelID?.name + " " + input?.modelID?.modelName,
									}}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											modelID: val,
											siteAssetID: {},
											modelVersionStageID: {},
											modelVersionZoneID: {},
										});
										setDataSourceAfterModelChange([]);
									}}
									selectdValueToshow={"name"}
									label={customCaptions?.model}
									isError={errors.modelID === null ? false : true}
									fetchData={() => getPublishedModel(siteAppId)}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.siteAssetID === null ? null : errors.siteAssetID
								}
							>
								<DyanamicDropdown
									dataSource={availableModel}
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.asset}
									dataHeader={[{ id: 1, name: "Asset" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={input["siteAssetID"]}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({ ...input, siteAssetID: val });
									}}
									selectdValueToshow="name"
									label={customCaptions?.asset}
									isError={errors.siteAssetID === null ? false : true}
									isReadOnly={
										input?.modelID?.id === null ||
										input?.modelID?.id === undefined
									}
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.modelVersionStageID === null
										? null
										: errors.modelVersionStageID
								}
							>
								<DyanamicDropdown
									dataSource={dataSourceAfterModelChange}
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.stage}
									dataHeader={[{ id: 1, name: "Stage" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={input["modelVersionStageID"]}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											modelVersionStageID: val,
											modelVersionZoneID: {},
										});
									}}
									selectdValueToshow="name"
									label={customCaptions?.stage}
									isError={errors.modelVersionStageID === null ? false : true}
									fetchData={() =>
										getModelStage(input?.modelID?.activeModelVersionID)
									}
									isReadOnly={
										input?.modelID?.id === null ||
										input?.modelID?.id === undefined
									}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.modelVersionZoneID === null
										? null
										: errors.modelVersionZoneID
								}
							>
								<DyanamicDropdown
									dataSource={dataSourceAfterModelChange}
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.zone}
									dataHeader={[{ id: 1, name: "Zone" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={input["modelVersionZoneID"]}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({ ...input, modelVersionZoneID: val });
									}}
									selectdValueToshow="name"
									label={customCaptions?.zone}
									isError={errors.modelVersionZoneID === null ? false : true}
									fetchData={() =>
										getModelZonesList(input?.modelID?.activeModelVersionID)
									}
									isReadOnly={
										input?.modelID?.id === null ||
										input?.modelID?.id === undefined ||
										input?.modelVersionStageID?.id === null ||
										input?.modelVersionStageID?.id === undefined ||
										input?.modelVersionStageID?.hasZones === false
									}
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.changeRequired === null ? null : errors.changeRequired
								}
							>
								<ADD.NameLabel>
									{`${customCaptions.changeRequired}`}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>

								<TextAreaInputField
									value={input?.changeRequired}
									onChange={(e) => {
										setInput({ ...input, changeRequired: e.target.value });
									}}
									minRows={5}
									style={{
										width: "100%",
										border:
											errors.changeRequired === null
												? ""
												: "1px solid " + ColourConstants.red,
										fontFamily: "Roboto Condensed",
										fontSize: "16px",
										borderRadius: "5px",
									}}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={errors.benefit === null ? null : errors.benefit}
							>
								<ADD.NameLabel>
									{`${customCaptions.benefit}`}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>

								<TextAreaInputField
									value={input?.benefit}
									onChange={(e) => {
										setInput({ ...input, benefit: e.target.value });
									}}
									minRows={5}
									style={{
										width: "100%",
										border:
											errors.benefit === null
												? ""
												: "1px solid " + ColourConstants.red,
										fontFamily: "Roboto Condensed",
										fontSize: "16px",
										borderRadius: "5px",
									}}
									onBlur={() => {
										setModelFocus(false);
									}}
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewFeedbackDetail;
