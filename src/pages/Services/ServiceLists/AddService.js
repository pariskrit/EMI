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
	currentUTCDateTime,
	generateErrorState,
	handleSort,
	handleValidateObj,
} from "helpers/utils";
import { useDispatch } from "react-redux";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getPublishedModel } from "services/models/modelList";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { getModelIntervals } from "services/models/modelDetails/modelIntervals";
import { getModelRolesListByInterval } from "services/models/modelDetails/modelRoles";
import { showError } from "redux/common/actions";
import { getModelAsset } from "services/models/modelDetails/modelAsset";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import { getAvailabeleModelDeparments } from "services/models/modelDetails/details";
import { DefaultPageSize } from "helpers/constants";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = (modelTemplateType) =>
	yup.object({
		workOrder: yup
			.string("This field must be a string")
			.required("This field is required"),
		note: yup.string("This field must be a string").nullable(),
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
			.when("modelID", {
				is: () => modelTemplateType === "A",
				then: yup
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
	workOrder: null,
	note: null,
	modelID: null,
	modelVersionRoleId: null,
	siteAssetId: null,
	scheduledDate: null,
	notificationNumber: null,
	modelVersionIntervalId: null,
	siteDepartmentID: null,
};
const defaultStateSchema = {
	workOrder: "",
	note: "",
	notificationNumber: "",
	modelID: {},
	modelVersionRoleId: {},
	modelVersionIntervalId: {},
	siteAssetId: {},
	siteDepartmentID: {},
	scheduledDate: currentUTCDateTime(),
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
}) {
	// Init hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [intervals, setIntervals] = useState([]);
	const [roles, setRoles] = useState([]);

	const [dataSourceAfterModelChange, setDataSourceAfterModelChange] = useState(
		[]
	);

	const modelId = input?.modelID?.activeModelVersionID;
	const intervalId = input?.modelVersionIntervalId?.id;

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
							modelVersionIntervalId: response.data[0],
						}));
					}
				}
			};
			fetchInterval();
		}
	}, [modelId]);

	// attempting to fetch role when interval is selected
	useEffect(() => {
		if (intervalId) {
			const fetchInterval = async () => {
				const response = await getModelRolesListByInterval(intervalId);
				if (response.status) {
					setRoles(response.data);

					// automatically select role if role list contains single data
					if (response.data.length === 1) {
						setInput((prev) => ({
							...prev,
							modelVersionRoleId: response.data[0],
						}));
					}
				}
			};
			fetchInterval();
		}
	}, [intervalId]);

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
			modelID: input?.modelID?.id,
			modelVersionIntervalId: input?.modelVersionIntervalId?.id,
			modelVersionRoleId: input?.modelVersionRoleId?.id,
			siteAssetId: input?.siteAssetId?.siteAssetID,
			siteDepartmentID: input?.siteDepartmentID?.siteDepartmentID,
			note: input?.note || null,
			notificationNumber: input?.notificationNumber || null,
			scheduledDate: input?.scheduledDate
				? new Date(new Date(input?.scheduledDate).getTime()).toJSON()
				: "",
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
					setDataForFetchingService({
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
						showError(newData.data.detail || "Failed to add new service")
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

			dispatch(showError("Failed to add new service"));
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
									placeholder="Select Model"
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
									placeholder="Select Interval"
									dataHeader={[{ id: 1, name: "Interval" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={input["modelVersionIntervalId"]}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											modelVersionIntervalId: val,
											modelVersionRoleId: {},
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
									placeholder="Select Role"
									dataHeader={[{ id: 1, name: "Role" }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={input["modelVersionRoleId"]}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({ ...input, modelVersionRoleId: val });
									}}
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
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.siteDepartmentID === null
										? null
										: errors.siteDepartmentID
								}
							>
								<DyanamicDropdown
									dataSource={dataSourceAfterModelChange}
									isServerSide={false}
									width="100%"
									placeholder="Select Department"
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
									isError={errors.siteDepartmentID === null ? false : true}
									fetchData={() =>
										getAvailabeleModelDeparments(input?.modelID?.id)
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
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					{input?.modelID?.modelTemplateType === "A" && (
						<ADD.InputContainer>
							<ADD.FullWidthContainer style={{ paddingRight: 0 }}>
								<ErrorInputFieldWrapper
									errorMessage={
										errors.siteAssetId === null ? null : errors.siteAssetId
									}
								>
									<DyanamicDropdown
										dataSource={dataSourceAfterModelChange}
										isServerSide={false}
										width="100%"
										placeholder="Select Asset"
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
										fetchData={() => getModelAsset(input?.modelID?.id)}
										required
										isReadOnly={
											input?.modelID?.id === null ||
											input?.modelID?.id === undefined
										}
									/>
								</ErrorInputFieldWrapper>
							</ADD.FullWidthContainer>
						</ADD.InputContainer>
					)}
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
									label={"WONN (Work Order Notification Number)"}
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
							/>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewServiceDetail;
