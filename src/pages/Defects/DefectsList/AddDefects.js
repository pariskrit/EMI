import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@material-ui/core";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import {
	generateErrorState,
	handleSort,
	handleValidateObj,
} from "helpers/utils";
import { useDispatch } from "react-redux";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getPublishedModel } from "services/models/modelList";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { showError } from "redux/common/actions";
import { getModelAvailableAsset } from "services/models/modelDetails/modelAsset";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import { getDefectTypes } from "services/clients/sites/siteApplications/defectTypes";
import { getDefectRiskRatings } from "services/clients/sites/siteApplications/defectRiskRatings";
import { getDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";
import { DefaultPageSize } from "helpers/constants";
import { getModelStage } from "services/models/modelDetails/modelStages";
import { getModelZonesList } from "services/models/modelDetails/modelZones";
import TextAreaInputField from "components/Elements/TextAreaInputField";
import ColourConstants from "helpers/colourConstants";
import { getSiteAssets } from "services/clients/sites/siteAssets";
import { getAvailabeleModelDeparments } from "services/models/modelDetails/details";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = () =>
	yup.object({
		details: yup
			.string("This field must be a string")
			.required("The field is required"),
		modelID: yup
			.string("This field is required")
			.required("The field is required"),
		defectTypeID: yup
			.string("This field is required")
			.required("The field is required"),
		defectRiskRatingID: yup
			.string("This field is required")
			.required("The field is required"),
		defectStatusID: yup
			.string("This field is required")
			.required("The field is required"),
		siteAssetId: yup
			.string("This field is required")
			.required("The field is required"),
		workOrder: yup.string("This field must be a string").nullable(),
		modelVersionStageID: yup.string("This field must be a string").nullable(),
		modelVersionZoneID: yup.string("This field must be a string").nullable(),
		siteDepartmentID: yup
			.string("The field is required")
			.required("The field is required"),
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
	details: null,
	modelID: null,
	defectTypeID: null,
	defectStatusID: null,
	siteAssetId: null,
	scheduledDate: null,
	workOrder: null,
	defectRiskRatingID: null,
	modelVersionStageID: null,
	modelVersionZoneID: null,
	siteDepartmentID: null,
};
const defaultStateSchema = {
	details: "",
	workOrder: "",
	modelID: {},
	defectTypeID: {},
	defectStatusID: {},
	defectRiskRatingID: {},
	siteAssetId: {},
	modelVersionStageID: {},
	modelVersionZoneID: {},
	siteDepartmentID: {},
};

function AddNewDefectDetail({
	open,
	closeHandler,
	siteAppId,
	siteId,
	title,
	createProcessHandler,
	customCaptions,
	setSearchQuery,
	fetchData,
	setDataForFetchingDefect,
}) {
	// Init hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [departments, setDepartments] = useState([]);
	const [dataSourceAfterModelChange, setDataSourceAfterModelChange] = useState(
		[]
	);
	const [modelAsset, setModelAsset] = useState([]);

	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);
		closeHandler();
	};

	useEffect(() => {
		if (input?.modelID?.id) {
			async function getAssets() {
				try {
					let response = await getModelAvailableAsset(input?.modelID?.id);
					if (response.status) {
						let newData = response.data.map((d) => {
							return {
								...d,
								id: d?.siteAssetID,
							};
						});
						setModelAsset(newData);
					} else {
						dispatch(showError("Failed to get Assets"));
					}
				} catch (error) {
					dispatch(showError("Failed to get Assets"));
				}
			}
			getAssets();
		}
	}, [input?.modelID?.id]);

	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				const response = await getAvailabeleModelDeparments(
					input?.modelID?.activeModelVersionID
				);
				if (response.status) {
					let newDatas = response.data.map((d) => {
						return {
							...d,
							id: d.siteDepartmentID,
						};
					});
					setDepartments(newDatas);
				} else {
					dispatch(showError("Failed to get departments."));
				}
			} catch (error) {
				dispatch(showError("Failed to get departments."));
			}
		};
		if (input?.modelID?.activeModelVersionID) {
			fetchDepartments();
		}
	}, [input.modelID.activeModelVersionID, dispatch]);

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
			modelID: input?.modelID?.id,
			siteDepartmentID: input?.siteDepartmentID?.id,
			defectTypeID: input?.defectTypeID?.id,
			defectRiskRatingID: input?.defectRiskRatingID?.id,
			defectStatusID: input?.defectStatusID?.id,
			siteAssetId: input?.siteAssetId?.siteAssetID,
			details: input?.details,
			workOrder: input?.workOrder || null,
			modelVersionStageID: input?.modelVersionStageID?.id || null,
			modelVersionZoneID: input?.modelVersionZoneID?.id || null,
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
					setDataForFetchingDefect({
						pageNumber: 1,
						pageSize: DefaultPageSize,
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
							newData.data.detail ||
								"Failed to add new " + customCaptions?.defect
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
			console.log(err);
			setIsUpdating(false);
			setErrors({ ...errors, ...err?.response?.data?.errors });

			dispatch(showError("Failed to add new defect"));
		}
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="large-application-dailog"
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
											siteAssetId: {},
											modelVersionStageID: {},
											modelVersionZoneID: {},
											siteDepartmentID: {},
										});
										setDataSourceAfterModelChange([]);
									}}
									selectdValueToshow={"name"}
									label={customCaptions?.model}
									required
									isError={errors.modelID === null ? false : true}
									fetchData={() => getPublishedModel(siteAppId)}
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
									dataSource={departments}
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.department}
									dataHeader={[{ id: 1, name: "Department" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={{ ...input["siteDepartmentID"] }}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({ ...input, siteDepartmentID: val });
									}}
									selectdValueToshow="name"
									label={customCaptions?.department}
									isError={errors.siteDepartmentID === null ? false : true}
									required
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
									errors.defectTypeID === null ? null : errors.defectTypeID
								}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.defectType}
									dataHeader={[{ id: 1, name: customCaptions?.defectType }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={{
										...input["defectTypeID"],
									}}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											defectTypeID: val,
										});
									}}
									selectdValueToshow={"name"}
									label={customCaptions?.defectType}
									required
									isError={errors.defectTypeID === null ? false : true}
									fetchData={() => getDefectTypes(siteAppId)}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.siteAssetId === null ? null : errors.siteAssetId
								}
							>
								<DyanamicDropdown
									dataSource={modelAsset}
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.asset}
									dataHeader={[{ id: 1, name: "Asset" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={input["siteAssetId"]}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({ ...input, siteAssetId: val });
									}}
									selectdValueToshow="name"
									label={customCaptions?.asset}
									isError={errors.siteAssetId === null ? false : true}
									required
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
									errors.defectStatusID === null ? null : errors.defectStatusID
								}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.defectStatus}
									dataHeader={[{ id: 1, name: "Status" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={input["defectStatusID"]}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({ ...input, defectStatusID: val });
									}}
									selectdValueToshow="name"
									label={customCaptions?.defectStatus}
									required
									isError={errors.defectStatusID === null ? false : true}
									fetchData={() => getDefectStatuses(siteAppId)}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.defectRiskRatingID === null
										? null
										: errors.defectRiskRatingID
								}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.riskRating}
									dataHeader={[{ id: 1, name: "Risk Rating" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={input["defectRiskRatingID"]}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({ ...input, defectRiskRatingID: val });
									}}
									selectdValueToshow="name"
									label={customCaptions?.riskRating}
									required
									isError={errors.defectRiskRatingID === null ? false : true}
									fetchData={() => getDefectRiskRatings(siteAppId)}
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
									errors.workOrder === null ? null : errors.workOrder
								}
							>
								<TextFieldContainer
									label={"Notification Number"}
									name={"workOrder"}
									value={input?.workOrder}
									onChange={(e) =>
										setInput({ ...input, workOrder: e.target.value })
									}
									isRequired={false}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.FullWidthContainer style={{ paddingRight: 0 }}>
							<ErrorInputFieldWrapper
								errorMessage={errors.details === null ? null : errors.details}
							>
								<ADD.NameLabel>
									{`${customCaptions.defect} Details`}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>

								<TextAreaInputField
									value={input?.details}
									onChange={(e) => {
										setInput({ ...input, details: e.target.value });
									}}
									minRows={5}
									style={{
										width: "100%",
										border:
											errors.details === null
												? ""
												: "1px solid " + ColourConstants.red,
										fontSize: "16px",
										borderRadius: "5px",
									}}
								/>
							</ErrorInputFieldWrapper>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewDefectDetail;
