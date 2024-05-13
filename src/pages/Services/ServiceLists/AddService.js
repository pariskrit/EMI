import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@mui/material";
import * as yup from "yup";
import { makeStyles } from "tss-react/mui";
import AddDialogStyle from "styles/application/AddDialogStyle";
import {
	currentUTCDateTime,
	generateErrorState,
	handleSort,
	handleValidateObj,
	isChrome,
} from "helpers/utils";
import { useDispatch } from "react-redux";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getPublishedModel } from "services/models/modelList";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import {
	getModelIntervals,
	getModelVersionArrangements,
} from "services/models/modelDetails/modelIntervals";
import { getModelRolesListByInterval } from "services/models/modelDetails/modelRoles";
import { showError } from "redux/common/actions";
import { getModelAvailableAsset } from "services/models/modelDetails/modelAsset";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import { defaultPageSize } from "helpers/utils";
import { Grid } from "@mui/material";
import AddModel from "pages/Models/ModelDetails/ModelAsset/AddModel";
import DeleteIcon from "assets/icons/deleteIcon.svg";
import { getModelDeparments } from "services/models/modelDetails/details";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = (
	modelTemplateType,
	showArrangements,
	hasArrangements,
	siteAssetId,
	siteAssetName
) =>
	yup.object({
		workOrder: yup
			.string("This field must be a string")
			.required("This field is required"),
		note: yup.string("This field must be a string").nullable(),
		siteAssetDescription: yup.string("This field must be a string").nullable(),
		modelID: yup
			.string("This field is required")
			.required("The field is required"),
		modelVersionIntervalId: yup
			.string("This field is required")
			.required("The field is required"),

		modelVersionRoleId: yup
			.string("This field is required")
			.required("The field is required"),
		siteAssetId: yup
			.string("This field is required")
			.nullable()
			.when(["modelID", "siteAssetName"], {
				is: () => modelTemplateType === "A" && !siteAssetName,
				then: () =>
					yup
						.string("This field is required")
						.required("This field is required"),
			}),
		siteAssetName: yup
			.string("This field is required")
			.nullable()
			.when(["modelID", "siteAssetID"], {
				is: () => modelTemplateType === "A" && !siteAssetId,
				then: () =>
					yup
						.string("This field is required")
						.required("This field is required"),
			}),
		siteDepartmentID: yup
			.string("This field is required")
			.required("The field is required"),
		scheduledDate: yup
			.string("This field is required")
			.required("The field is required"),
		notificationNumber: yup.string("This field must be a string").nullable(),
		clientName: yup.string("This field must be a string").nullable(),
		modelVersionArrangementID: yup.string("Arragement is required").nullable(),
	});

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: 500,
	},
	assetButton: {
		width: "100%",
		marginTop: "30px",
	},
	deleteIcon: {
		cursor: "pointer",
		marginTop: 40,
	},
}));

// Default state schemas
const defaultErrorSchema = {
	workOrder: null,
	note: null,
	modelID: null,
	modelVersionRoleId: null,
	siteAssetId: null,
	scheduledDate: null,
	notificationNumber: null,
	modelVersionIntervalId: null,
	modelVersionArrangementID: null,
	siteDepartmentID: null,
	siteAssetName: null,
	clientName: null,
};
const defaultStateSchema = {
	workOrder: "",
	note: "",
	notificationNumber: "",
	modelID: {},
	modelVersionRoleId: {},
	modelVersionIntervalId: {},
	siteAssetId: {},
	siteAssetName: "",
	siteDepartmentID: {},
	scheduledDate: currentUTCDateTime(),
	siteAssetDescription: "",
	clientName: "",
	modelVersionArrangementID: "",
};

function AddNewServiceDetail({
	open,
	closeHandler,
	siteAppId,
	title,
	createProcessHandler,
	customCaptions,
	setSearchQuery,
	fetchData,
	setDataForFetchingService,
	showArrangements,
	position,
	allowRegisterAssetsForServices,
	showServiceClientName,
}) {
	// Init hooks
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [intervals, setIntervals] = useState([]);
	const [roles, setRoles] = useState([]);
	const [modelAssest, setModelAssest] = useState([]);
	const [modelFocus, setModelFocus] = useState(true);
	const [openAsset, setOpenAsset] = useState(false);
	const [arrangementsData, setArrangementDatas] = useState(undefined);
	const [departments, setDepartments] = useState([]);

	const [dataSourceAfterModelChange, setDataSourceAfterModelChange] = useState(
		[]
	);

	const modelId = input?.modelID?.activeModelVersionID;
	const intervalId = input?.modelVersionIntervalId?.id;
	const modelAssestID = input?.modelID?.id;

	// attempting to fetch interval when model is selected
	useEffect(() => {
		if (modelId) {
			const fetchInterval = async () => {
				const response = await getModelIntervals(modelId);
				if (response.status) {
					setIntervals(response.data);

					// automatically select role if role list contains single data
					if (response.data.length === 1) {
						setInput((prev) => ({
							...prev,
							modelVersionIntervalId: response?.data?.[0],
						}));
					}
				}
			};
			fetchInterval();
		}
	}, [modelId]);

	useEffect(() => {
		if (modelAssestID) {
			const fetchAssetData = async () => {
				const response = await getModelAvailableAsset(modelAssestID);
				if (response.status) {
					let newData = response.data.map((d) => {
						return {
							...d,
							id: d.siteAssetID,
						};
					});
					setModelAssest(newData);
				} else {
					dispatch(showError(response?.data || "Could not fetch Data"));
				}
			};
			fetchAssetData();
		}
	}, [modelAssestID]);

	useEffect(() => {
		if (showArrangements && modelId) {
			const getModelArrangements = async () => {
				const response = await getModelVersionArrangements(modelId);
				if (response.status) {
					setArrangementDatas(response?.data);
					// automatically select arrangement if arrangement list contains single data
					if (response.data.length === 1) {
						setInput((prev) => ({
							...prev,
							modelVersionArrangementID: response?.data?.[0]?.id,
						}));
					}
				} else {
					dispatch(showError(response?.data || "Could not fetch Data"));
				}
			};
			getModelArrangements();
		}
	}, [showArrangements, modelId, dispatch]);

	// attempting to fetch role when interval is selected
	useEffect(() => {
		if (intervalId) {
			const fetchInterval = async () => {
				const response = await getModelRolesListByInterval(intervalId);
				if (response.status) {
					setRoles(response?.data);

					// automatically select role if role list contains single data
					if (response.data.length === 1) {
						const data = response?.data?.[0];
						setInput((prev) => ({
							...prev,
							modelVersionRoleId: data,
							siteDepartmentID: data?.siteDepartmentID
								? {
										name: data?.siteDepartmentName,
										id: data?.siteDepartmentID,
								  }
								: {},
						}));
					}
				}
			};
			fetchInterval();
		}
	}, [intervalId]);

	//for fetching departments list
	useEffect(() => {
		if (
			input?.modelVersionRoleId?.id &&
			!input?.modelVersionRoleId?.siteDepartmentID
		) {
			const fetchModelDepartments = async () => {
				const response = await getModelDeparments(modelId);
				if (response.status) {
					const modifiedResponse = response.data
						.filter((d) => d.id)
						.map((data) => ({
							...data,
							id: data?.modelDepartmentID,
						}));
					setDepartments(modifiedResponse);
					if (modifiedResponse?.length === 1) {
						setInput((prev) => ({
							...prev,
							siteDepartmentID: modifiedResponse?.[0],
						}));
					}
				} else {
					dispatch(showError(response?.data || "Could not fetch Data"));
				}
			};
			fetchModelDepartments();
		}
	}, [
		input?.modelVersionRoleId?.id,
		dispatch,
		modelId,
		input?.modelVersionRoleId?.siteDepartmentID,
	]);

	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);
		closeHandler();
	};

	const handleOpenAssetModal = () => {
		setOpenAsset(true);
	};

	const handleCloseAsset = () => {
		setOpenAsset(false);
	};

	const handleAddAsset = (value) => {
		setInput((prev) => ({
			...prev,
			siteAssetName: value?.name || value?.asset?.name,
			siteAssetDescription: value?.description,
			modelVersionArrangementID: value?.modelVersionArrangementID?.id,
		}));
		setOpenAsset(false);
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
			modelID: input?.modelID?.id,
			modelVersionIntervalId: input?.modelVersionIntervalId?.id,
			modelVersionRoleId: input?.modelVersionRoleId?.id,
			siteAssetId: input?.siteAssetId?.siteAssetID,
			siteAssetName: input?.siteAssetName || undefined,
			siteAssetDescription: input?.siteAssetDescription || undefined,
			siteDepartmentID: input?.siteDepartmentID?.id,
			note: input?.note || null,
			notificationNumber: input?.notificationNumber || null,
			clientName: input?.clientName || null,

			scheduledDate: input?.scheduledDate
				? new Date(new Date(input?.scheduledDate).getTime()).toJSON()
				: "",
		};

		try {
			const localChecker = await handleValidateObj(
				schema(
					input?.modelID?.modelTemplateType,
					showArrangements,
					input?.modelID?.hasArrangements,
					input?.siteAssetId?.siteAssetID,
					input?.siteAssetName
				),
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
					setDataForFetchingService({
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
						showError(newData?.data?.detail || "Failed to add new service")
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
			dispatch(showError("Failed to add new service"));
		}
	};

	const handleRoleChange = (val) => {
		setInput({ ...input, modelVersionRoleId: val });
		if (val?.siteDepartmentID) {
			setInput((prev) => ({
				...prev,
				siteDepartmentID: {
					name: val?.siteDepartmentName,
					id: val?.siteDepartmentID,
				},
			}));
		} else {
			setInput((prev) => ({
				...prev,
				siteDepartmentID: {},
			}));
		}
	};

	const departmentReadOnly =
		!input?.modelVersionRoleId?.id ||
		input?.modelVersionRoleId?.siteDepartmentID ||
		departments.length === 1;

	return (
		<div>
			<AddModel
				open={openAsset}
				handleClose={handleCloseAsset}
				modelId={modelId}
				title={customCaptions?.asset}
				handleServiceAddComplete={handleAddAsset}
				serviceAccess={position?.serviceAccess}
				isFromService={true}
				arrangementDatas={arrangementsData}
				arrangementTitle={customCaptions?.arrangement}
				hideArrangements={
					!showArrangements ||
					!input.modelID.hasArrangements ||
					!input.modelID.modelTemplateType === "F" ||
					arrangementsData?.length === 0
				}
			/>
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
							<ADD.NameLabel>
								{"Work Order"}
								<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.workOrder === null ? null : errors.workOrder
								}
							>
								<ADD.NameInput
									error={errors.workOrder === null ? false : true}
									value={input.workOrder}
									onChange={(e) => {
										setInput({ ...input, workOrder: e.target.value });
									}}
									variant="outlined"
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={errors.modelID === null ? null : errors.modelID}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={`Select ${customCaptions.model}`}
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
											modelVersionIntervalId: {},
											modelVersionRoleId: {},
											siteAssetId: {},
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
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.modelVersionIntervalId === null
										? null
										: errors.modelVersionIntervalId
								}
							>
								<DyanamicDropdown
									dataSource={intervals}
									isServerSide={false}
									width="100%"
									placeholder={`Select ${customCaptions.interval}`}
									dataHeader={[{ id: 1, name: "Interval" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={input["modelVersionIntervalId"]}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											modelVersionIntervalId: val,
											modelVersionRoleId: {},
											siteDepartmentID: {},
										});
									}}
									selectdValueToshow="name"
									label={customCaptions?.interval}
									required
									isError={
										errors.modelVersionIntervalId === null ? false : true
									}
									isReadOnly={
										input?.modelID?.activeModelVersionID === null ||
										input?.modelID?.activeModelVersionID === undefined
									}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>

						{input?.modelID?.modelTemplateType === "A" ? (
							<ADD.RightInputContainer>
								<ErrorInputFieldWrapper
									errorMessage={
										errors.siteAssetId === null ? null : errors.siteAssetId
									}
								>
									{position?.assetAccess === "F" &&
									allowRegisterAssetsForServices ? (
										input?.siteAssetName ? (
											<Grid container spacing={2}>
												<Grid item xs={11} md={11}>
													<ADD.NameLabel>
														{customCaptions?.asset}
														<ADD.RequiredStar>*</ADD.RequiredStar>
													</ADD.NameLabel>
													<ADD.NameInput
														error={errors.siteAssetId === null ? false : true}
														value={input?.siteAssetName}
														disabled
														variant="outlined"
													/>
												</Grid>
												<Grid item xs={1} md={1}>
													<img
														className={classes.deleteIcon}
														src={DeleteIcon}
														alt=""
														onClick={() =>
															setInput((prev) => ({
																...prev,
																siteAssetName: "",
																siteAssetId: {},
															}))
														}
													/>
												</Grid>
											</Grid>
										) : (
											<ErrorInputFieldWrapper
												errorMessage={
													errors.siteAssetId === null
														? null
														: errors.siteAssetId
												}
											>
												<Grid container spacing={2}>
													<Grid item xs={12} md={9}>
														<DyanamicDropdown
															dataSource={modelAssest}
															isServerSide={false}
															width="100%"
															showHeader
															placeholder={`Select ${customCaptions.asset}`}
															dataHeader={[
																{ id: 1, name: "Asset" },
																{ id: 2, name: "Description" },
																...(input.modelID.hasArrangements
																	? [{ id: 3, name: "Arrangement" }]
																	: []),
															]}
															columns={[
																{ id: 1, name: "name" },
																{ id: 2, name: "description" },
																...(input.modelID.hasArrangements
																	? [{ id: 3, name: "arrangementName" }]
																	: []),
															]}
															selectedValue={{
																...input["siteAssetId"],
																name: input?.siteAssetId?.name
																	? input?.siteAssetId?.name +
																	  `${
																			input?.siteAssetId?.arrangementName
																				? ` (${input?.siteAssetId?.arrangementName})`
																				: ""
																	  }`
																	: "",
															}}
															handleSort={handleSort}
															onChange={(val) => {
																setInput({
																	...input,
																	siteAssetId: val,
																});
															}}
															selectdValueToshow="name"
															label={customCaptions?.asset}
															isError={
																errors.siteAssetId === null ? false : true
															}
															showClear
															onClear={() =>
																setInput((prev) => ({
																	...prev,
																	siteAssetId: {},
																}))
															}
															required
															isReadOnly={
																input?.modelID?.id === null ||
																input?.modelID?.id === undefined
															}
														/>
													</Grid>
													<Grid item xs={12} md={3}>
														<ADD.ConfirmButton
															onClick={handleOpenAssetModal}
															variant="contained"
															className={classes.assetButton}
															disabled={input?.siteAssetId?.siteAssetID}
														>
															{`Add ${customCaptions?.asset}`}
														</ADD.ConfirmButton>
													</Grid>
												</Grid>
											</ErrorInputFieldWrapper>
										)
									) : (
										<ErrorInputFieldWrapper
											errorMessage={
												errors.siteAssetId === null ? null : errors.siteAssetId
											}
										>
											<DyanamicDropdown
												dataSource={modelAssest}
												isServerSide={false}
												width="100%"
												showHeader
												placeholder={`Select ${customCaptions.asset}`}
												dataHeader={[
													{ id: 1, name: "Asset" },
													{ id: 2, name: "Description" },
													...(input.modelID.hasArrangements
														? [{ id: 3, name: "Arrangement" }]
														: []),
												]}
												columns={[
													{ id: 1, name: "name" },
													{ id: 2, name: "description" },
													...(input.modelID.hasArrangements
														? [{ id: 3, name: "arrangementName" }]
														: []),
												]}
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
									)}
								</ErrorInputFieldWrapper>
							</ADD.RightInputContainer>
						) : (
							<ADD.RightInputContainer>
								<ErrorInputFieldWrapper
									errorMessage={
										errors.modelVersionRoleId === null
											? null
											: errors.modelVersionRoleId
									}
								>
									<DyanamicDropdown
										dataSource={roles}
										isServerSide={false}
										width="100%"
										placeholder={`Select ${customCaptions.role}`}
										dataHeader={[{ id: 1, name: "Role" }]}
										columns={[{ id: 1, name: "name" }]}
										selectedValue={input["modelVersionRoleId"]}
										handleSort={handleSort}
										onChange={handleRoleChange}
										selectdValueToshow="name"
										label={customCaptions?.role}
										required
										isError={errors.modelVersionRoleId === null ? false : true}
										isReadOnly={
											input?.modelVersionIntervalId?.id === null ||
											input?.modelVersionIntervalId?.id === undefined
										}
									/>
								</ErrorInputFieldWrapper>
							</ADD.RightInputContainer>
						)}
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.scheduledDate === null ? null : errors.scheduledDate
								}
							>
								<TextFieldContainer
									label={"Scheduled Date"}
									name={"scheduledDate"}
									value={input.scheduledDate}
									onChange={(e) => {
										setInput({ ...input, scheduledDate: e.target.value });
									}}
									isRequired={true}
									type="datetime-local"
									placeholder="Select Date"
									error={errors.scheduledDate === null ? false : true}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
						{input?.modelID?.modelTemplateType === "A" && (
							<ADD.RightInputContainer>
								<ErrorInputFieldWrapper
									errorMessage={
										errors.modelVersionRoleId === null
											? null
											: errors.modelVersionRoleId
									}
								>
									<DyanamicDropdown
										dataSource={roles}
										isServerSide={false}
										width="100%"
										placeholder={`Select ${customCaptions.role}`}
										dataHeader={[{ id: 1, name: "Role" }]}
										columns={[{ id: 1, name: "name" }]}
										selectedValue={input["modelVersionRoleId"]}
										handleSort={handleSort}
										onChange={handleRoleChange}
										selectdValueToshow="name"
										label={customCaptions?.role}
										required
										isError={errors.modelVersionRoleId === null ? false : true}
										isReadOnly={
											input?.modelVersionIntervalId?.id === null ||
											input?.modelVersionIntervalId?.id === undefined
										}
									/>
								</ErrorInputFieldWrapper>
							</ADD.RightInputContainer>
						)}

						{input?.modelID?.modelTemplateType !== "A" && (
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
										placeholder={`Select ${customCaptions.department}`}
										dataHeader={[{ id: 1, name: "Department" }]}
										columns={[{ id: 1, name: "name" }]}
										selectedValue={input["siteDepartmentID"]}
										handleSort={handleSort}
										onChange={(val) => {
											setInput({ ...input, siteDepartmentID: val });
										}}
										selectdValueToshow="name"
										label={customCaptions?.department}
										required
										isError={errors.modelVersionRoleId === null ? false : true}
										isReadOnly={departmentReadOnly}
									/>
								</ErrorInputFieldWrapper>
							</ADD.RightInputContainer>
						)}
					</ADD.InputContainer>
					<ADD.InputContainer>
						{showServiceClientName && (
							<ADD.LeftInputContainer>
								<ErrorInputFieldWrapper
									errorMessage={
										errors.notificationNumber === null
											? null
											: errors.notificationNumber
									}
								>
									<TextFieldContainer
										label={"Client Name"}
										name={"clientName"}
										value={input?.clientName}
										onChange={(e) =>
											setInput({
												...input,
												clientName: e.target.value,
											})
										}
										isRequired={false}
									/>
								</ErrorInputFieldWrapper>
							</ADD.LeftInputContainer>
						)}
						{input?.modelID?.modelTemplateType === "A" && (
							<ADD.RightInputContainer
								style={{
									paddingLeft: `${showServiceClientName ? "15px" : "0px"}`,
									paddingRight: `${showServiceClientName ? "0px" : "14px"}`,
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
										dataSource={departments}
										isServerSide={false}
										width="100%"
										placeholder={`Select ${customCaptions.department}`}
										dataHeader={[{ id: 1, name: "Department" }]}
										columns={[{ id: 1, name: "name" }]}
										selectedValue={input["siteDepartmentID"]}
										handleSort={handleSort}
										onChange={(val) => {
											setInput({ ...input, siteDepartmentID: val });
										}}
										selectdValueToshow="name"
										label={customCaptions?.department}
										required
										isError={errors.modelVersionRoleId === null ? false : true}
										isReadOnly={departmentReadOnly}
									/>
								</ErrorInputFieldWrapper>
							</ADD.RightInputContainer>
						)}
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.FullWidthContainer style={{ paddingRight: 0 }}>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.notificationNumber === null
										? null
										: errors.notificationNumber
								}
							>
								<TextFieldContainer
									label={customCaptions?.notificationNumber}
									name={"notificationNumber"}
									value={input?.notificationNumber}
									onChange={(e) =>
										setInput({ ...input, notificationNumber: e.target.value })
									}
									isRequired={false}
								/>
							</ErrorInputFieldWrapper>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.FullWidthContainer style={{ paddingRight: 0 }}>
							<ADD.NameLabel>{"Notes"}</ADD.NameLabel>

							<ADD.NameInput
								value={input.note}
								onChange={(e) => {
									setInput({ ...input, note: e.target.value });
								}}
								variant="outlined"
								multiline
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

export default AddNewServiceDetail;
