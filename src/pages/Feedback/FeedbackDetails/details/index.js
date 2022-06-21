import { Grid } from "@material-ui/core";
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
import {
	getSiteAssets,
	getSiteAssetsCount,
} from "services/clients/sites/siteAssets";
import {
	getPositionUsers,
	updateFeedback,
} from "services/feedback/feedbackdetails";
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

function Details({ details, siteAppID, siteId, captions, feedbackId }) {
	const [selectedDropdown, setSelectedDropdown] = useState({
		department: {},
		riskRating: {},
	});
	const [input, setInput] = useState("");
	const [isInputChanged, setIsInputChanged] = useState(false);
	const [dropdownOptions, setDropdownOptions] = useState({});
	const [page, setPage] = useState({ pageNo: 1, pageSize: 12 });
	const [siteAsset, setSiteAsset] = useState([]);
	const [count, setCount] = useState(null);

	const dispatch = useDispatch();

	const handleDropdownChange = async (value, type) => {
		setSelectedDropdown({
			...selectedDropdown,
			[type]: value,
		});

		const response = await updateFeedback(feedbackId, [
			{
				path: dropdownIdNames[type],
				op: "replace",
				value: value.id,
			},
		]);

		if (!response.status)
			dispatch(
				showError(
					response.data?.detail || response.data || "Could not update defect"
				)
			);
	};

	const handleInputChange = (e) => {
		setIsInputChanged(true);
		setInput({ ...input, [e.target.name]: e.target.value });
	};

	const handleUpdateInput = async (e) => {
		if (!isInputChanged) return;

		const response = await await updateFeedback(feedbackId, [
			{
				path: e.target.name,
				op: "replace",
				value: input[e.target.name],
			},
		]);

		if (!response.status)
			dispatch(
				showError(response.data?.details || response.data || "Could not update")
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

	const fetchPositionUser = async () => {
		const response = await getPositionUsers(selectedDropdown.position?.id);

		if (response.status)
			setDropdownOptions({
				users: response.data.map((res) => ({
					id: res.userID,
					name: res.displayName,
				})),
			});
		else dispatch(showError("Could not fetch Users"));
	};

	const fetchSiteAsset = async () => {
		const response = await getSiteAssets(siteId, 1, 12);
		const response2 = await getSiteAssetsCount(siteId);
		if (response.status) {
			setCount(response2.data);
			setSiteAsset(response.data);
		}
	};

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
				name: details.modelName,
				activeModelVersionID: details.activeModelVersionID,
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
							setSelectedDropdown({ ...selectedDropdown, user: {} });
						}}
						selectdValueToshow="name"
						label={captions?.position}
						fetchData={() => getPositions(siteAppID)}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.department}`}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.department}
						onChange={(val) => handleDropdownChange(val, "department")}
						selectdValueToshow="name"
						label={captions?.department}
						fetchData={() => getSiteDepartmentsInService(siteId)}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.user}`}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.user}
						onChange={(val) => handleDropdownChange(val, "user")}
						selectdValueToshow="name"
						label={captions?.user}
						dataSource={dropdownOptions.users}
						isReadOnly={!selectedDropdown.position?.id}
						fetchData={() => fetchPositionUser(selectedDropdown.position?.id)}
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
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.model}`}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.model}
						onChange={(val) => {
							handleDropdownChange(val, "model");
							setSelectedDropdown((prev) => ({ ...prev, stage: {}, zone: {} }));
						}}
						selectdValueToshow="name"
						label={captions?.model}
						fetchData={() => getPublishedModel(siteAppID)}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						dataSource={siteAsset}
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
						fetchData={fetchSiteAsset}
						onPageChange={pageChange}
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
							setSelectedDropdown((prev) => ({ ...prev, zone: {} }));
						}}
						selectdValueToshow="name"
						label={captions?.stage}
						isReadOnly={!selectedDropdown.model?.id}
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
							!selectedDropdown.model?.id || !selectedDropdown.stage.hasZones
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
					/>
				</Grid>
			</Grid>
		</AccordionBox>
	);
}

export default Details;
