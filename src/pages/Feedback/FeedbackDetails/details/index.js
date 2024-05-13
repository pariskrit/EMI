import { Grid } from "@mui/material";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import TextAreaInputField from "components/Elements/TextAreaInputField";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import AccordionBox from "components/Layouts/AccordionBox";
import { debounce } from "helpers/utils";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getFeedbackClassifications } from "services/clients/sites/siteApplications/feedbackClassifications";
import { getFeedbackPriorities } from "services/clients/sites/siteApplications/feedbackPriorities";
import { getPositions } from "services/clients/sites/siteApplications/userPositions";
import { getSiteAssets } from "services/clients/sites/siteAssets";
import {
	getPositionUsers,
	updateFeedback,
} from "services/feedback/feedbackdetails";
import { getModelAvailableAsset } from "services/models/modelDetails/modelAsset";
import { getModelStage } from "services/models/modelDetails/modelStages";
import { getModelZonesList } from "services/models/modelDetails/modelZones";
import { getPublishedModel } from "services/models/modelList";
import { getSiteDepartmentsInService } from "services/services/serviceLists";
import AddDialogStyle from "styles/application/AddDialogStyle";

const Add = AddDialogStyle();

const dropdownIdNames = {
	department: "siteDepartmentID",
	position: "assignPositionID",
	user: "assignUserID",
	classification: "feedbackClassificationID",
	priority: "feedbackPriorityID",
	asset: "siteAssetID",
	model: "modelID",
	stage: "ModelVersionStageID",
	zone: "ModelVersionZoneID",
};

function Details({
	details,
	siteAppID,
	siteId,
	captions,
	feedbackId,
	isReadOnly,
}) {
	const [selectedDropdown, setSelectedDropdown] = useState({
		department: {},
		riskRating: {},
	});
	const [input, setInput] = useState("");
	const [isInputChanged, setIsInputChanged] = useState(false);
	const [page, setPage] = useState({ pageNo: 1, pageSize: 12 });
	const [siteAsset, setSiteAsset] = useState([]);
	const [count, setCount] = useState(null);
	const [positionUsers, setPositionUsers] = useState([]);
	const [availableModel, setAvailableModel] = useState([]);

	const dispatch = useDispatch();

	const handleDropdownChange = async (value, type) => {
		setSelectedDropdown((prev) => ({
			...prev,
			[type]: value,
		}));

		if (type === "position")
			setSelectedDropdown((prev) => ({ ...prev, user: {} }));
		if (type === "model")
			setSelectedDropdown((prev) => ({
				...prev,
				model: {
					...prev.model,
					name: `${value.name} ${value.modelName ? value.modelName : ""}`,
					id: value.id,
					modelTemplateType: value.modelTemplateType,
				},
				asset: {},
			}));

		let payload = [
			{
				path: dropdownIdNames[type],
				op: "replace",
				value: value.id,
			},
		];
		if (type === "position") {
			payload = [
				{
					path: dropdownIdNames[type],
					op: "replace",
					value: value.id,
				},
				{
					path: "assignUserID",
					op: "replace",
					value: null,
				},
			];
		} else if (type === "model") {
			payload = [
				{
					path: dropdownIdNames[type],
					op: "replace",
					value: value.id,
				},
				{
					path: "siteAssetID",
					op: "replace",
					value: null,
				},
			];
		}

		const response = await updateFeedback(feedbackId, payload);

		if (!response.status)
			dispatch(
				showError(
					response?.data?.detail || response.data || "Could not update defect"
				)
			);
	};

	const handleInputChange = (e) => {
		setIsInputChanged(true);
		setInput({ ...input, [e.target.name]: e.target.value });
	};

	const handleUpdateInput = async (e) => {
		if (!isInputChanged) return;

		const response = await updateFeedback(feedbackId, [
			{
				path: e.target.name,
				op: "replace",
				value: input[e.target.name],
			},
		]);

		if (!response.status)
			dispatch(
				showError(
					response?.data?.details || response?.data || "Could not update"
				)
			);

		setIsInputChanged(false);
	};

	const pageChange = async (p, prevData) => {
		const response = await getSiteAssets(siteId, p, page.pageSize);
		setSiteAsset([
			...prevData,
			...response.data.filter(
				(newData) => !prevData.find((prev) => newData.id === prev.id)
			),
		]);
		setPage({ pageNo: p, pageSize: page.pageSize });
	};

	const handleServerSideSearch = useCallback(
		debounce(async (searchTxt) => {
			if (searchTxt) {
				const response = await getSiteAssets(siteId, 1, 20, searchTxt);
				setSiteAsset(response.data);
			} else {
				pageChange(1, []);
			}
		}, 500),
		[]
	);

	const positionUserID = selectedDropdown?.position?.id;
	const modelid = selectedDropdown?.model?.id;

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
		if (modelid || details?.modelID) {
			fetchModelAvailableAssest(modelid || details.modelID);
		}
	}, [modelid, dispatch, details.modelID]);

	useEffect(() => {
		const fetchPositionUser = async () => {
			const response = await getPositionUsers(
				positionUserID || details.assignPositionID
			);

			if (response.status) {
				let newDatas = response.data.map((d) => {
					return {
						id: d.userID,
						name: d.displayName,
					};
				});
				setPositionUsers(newDatas);
			} else dispatch(showError("Could not fetch Users"));
		};

		if (positionUserID || details?.assignPositionID) {
			fetchPositionUser();
		}
	}, [positionUserID, dispatch, details.assignPositionID]);

	useEffect(() => {
		setSelectedDropdown({
			department: {
				id: details.siteDepartmentID,
				name: details.departmentName,
			},
			position: {
				id: details.assignPositionID,
				name: details.assignPositionName,
			},
			user: {
				id: details.assignUserID,
				name: details.assignUserName,
			},
			classification: {
				id: details.feedbackClassificationID,
				name: details.feedbackClassificationName,
			},
			priority: {
				id: details.feedbackPriorityID,
				name: details.feedbackPriorityName,
			},
			asset: {
				id: details.siteAssetID,
				name: details.name,
			},
			model: {
				id: details.modelID,
				name: details?.modelName
					? `${details?.modelName} ${details?.model ? details.model : ""}`
					: "",
				activeModelVersionID: details.activeModelVersionID,
				modelTemplateType: details.modelType,
			},
			stage: {
				id: details.modelVersionStageID,
				name: details.stageName,
			},
			zone: {
				id: details.modelVersionZoneID,
				name: details.zoneName,
			},
		});
		setInput({
			benefit: details.benefit,
			changeRequired: details.changeRequired,
		});
	}, [details]);

	return (
		<AccordionBox
			title="Details"
			defaultExpanded
			showSafetyCritical={details.safetyCritical}
		>
			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.position}`}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.position}
						onChange={(val) => {
							handleDropdownChange(val, "position");
						}}
						selectdValueToshow="name"
						label={captions?.position}
						fetchData={() => getPositions(siteAppID)}
						isReadOnly={isReadOnly}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.department}`}
						dataHeader={[
							{
								id: 1,
								name: "Name",
							},
							{
								id: 2,
								name: `${captions?.location ?? "Location"}`,
							},
						]}
						showHeader
						columns={[
							{ id: 1, name: "name" },
							{ id: 2, name: "description" },
						]}
						selectedValue={selectedDropdown.department}
						onChange={(val) => handleDropdownChange(val, "department")}
						selectdValueToshow="name"
						label={captions?.department}
						fetchData={() => getSiteDepartmentsInService(siteId)}
						isReadOnly={isReadOnly}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						dataSource={positionUsers}
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.user}`}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.user}
						onChange={(val) => handleDropdownChange(val, "user")}
						selectdValueToshow="name"
						label={captions?.user}
						isReadOnly={isReadOnly || !selectedDropdown.position?.id}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.classification}`}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.classification}
						onChange={(val) => handleDropdownChange(val, "classification")}
						selectdValueToshow="name"
						label={captions?.classification}
						required
						fetchData={() => getFeedbackClassifications(siteAppID)}
						isReadOnly={isReadOnly}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.priority}`}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.priority}
						onChange={(val) => handleDropdownChange(val, "priority")}
						selectdValueToshow="name"
						label={captions?.priority}
						required
						fetchData={() => getFeedbackPriorities(siteAppID)}
						isReadOnly={isReadOnly}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.model}`}
						columns={[
							{ id: 1, name: "name" },
							{ id: 2, name: "modelName" },
						]}
						dataHeader={[
							{ id: 1, name: "Name" },
							{ id: 2, name: "Model" },
						]}
						showHeader
						selectedValue={selectedDropdown?.model}
						onChange={(val) => {
							handleDropdownChange(val, "model");
							setSelectedDropdown((prev) => ({
								...prev,
								stage: {},
								zone: {},
								asset: {},
							}));
						}}
						selectdValueToshow="name"
						label={captions?.model}
						fetchData={() => getPublishedModel(siteAppID)}
						isReadOnly={isReadOnly}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						dataSource={availableModel}
						isServerSide
						width="100%"
						placeholder={`Select ${captions?.asset}`}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.asset}
						onChange={(val) => handleDropdownChange(val, "asset")}
						selectdValueToshow="name"
						label={captions?.asset}
						page={page.pageNo}
						count={count}
						handleServierSideSearch={handleServerSideSearch}
						onPageChange={pageChange}
						isReadOnly={isReadOnly}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.stage}`}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.stage}
						onChange={(val) => {
							handleDropdownChange(val, "stage");
							setSelectedDropdown((prev) => ({
								...prev,
								zone: {},
								assest: {},
							}));
						}}
						selectdValueToshow="name"
						label={captions?.stage}
						isReadOnly={isReadOnly || !selectedDropdown.model?.id}
						fetchData={() =>
							getModelStage(selectedDropdown.model?.activeModelVersionID)
						}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.zone}`}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.zone}
						onChange={(val) => handleDropdownChange(val, "zone")}
						selectdValueToshow="name"
						label={captions?.zone}
						isReadOnly={
							isReadOnly ||
							!selectedDropdown.model?.id ||
							!selectedDropdown.stage.hasZones
						}
						fetchData={() =>
							getModelZonesList(selectedDropdown.model?.activeModelVersionID)
						}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextFieldContainer
						label={captions?.task ?? "Task"}
						name={"task"}
						value={details?.taskName}
						isDisabled={true}
						isRequired={false}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<Add.InputLabel>
						Change Required <Add.RequiredStar>*</Add.RequiredStar>
					</Add.InputLabel>

					<TextAreaInputField
						minRows={9}
						style={{ width: "100%" }}
						value={input?.changeRequired}
						onChange={handleInputChange}
						name="changeRequired"
						onBlur={handleUpdateInput}
						disabled={isReadOnly}
					/>
				</Grid>

				<Grid item xs={12} md={6}>
					<Add.InputLabel>
						Benefit <Add.RequiredStar>*</Add.RequiredStar>
					</Add.InputLabel>

					<TextAreaInputField
						minRows={9}
						style={{ width: "100%" }}
						value={input?.benefit}
						onChange={handleInputChange}
						name="benefit"
						onBlur={handleUpdateInput}
						disabled={isReadOnly}
					/>
				</Grid>
			</Grid>
		</AccordionBox>
	);
}

export default Details;
