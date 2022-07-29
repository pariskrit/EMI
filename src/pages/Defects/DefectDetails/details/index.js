import { Grid } from "@material-ui/core";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import TextAreaInputField from "components/Elements/TextAreaInputField";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import AccordionBox from "components/Layouts/AccordionBox";
import { handleSort } from "helpers/utils";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getDefectRiskRatings } from "services/clients/sites/siteApplications/defectRiskRatings";
import { getDefectTypes } from "services/clients/sites/siteApplications/defectTypes";
import { updateDefect } from "services/defects/details";
import { getAvailabeleModelDeparments } from "services/models/modelDetails/details";
import { getModelAvailableAsset } from "services/models/modelDetails/modelAsset";
import { getModelStage } from "services/models/modelDetails/modelStages";
import { getModelZonesList } from "services/models/modelDetails/modelZones";
import { getPublishedModel } from "services/models/modelList";
import AddDialogStyle from "styles/application/AddDialogStyle";

const Add = AddDialogStyle();

function Details({ details, siteAppID, captions, defectId, fetchDefect }) {
	const [selectedDropdown, setSelectedDropdown] = useState({
		type: {},
		riskRating: {},
		department: {},
		model: {},
		stage: {},
		zone: {},
		asset: {},
	});
	const [input, setInput] = useState("");
	const [isInputChanged, setIsInputChanged] = useState(false);
	const dispatch = useDispatch();
	const [departments, setDepartments] = useState([]);
	const [modelAssets, setModelAssets] = useState([]);

	const handleDropdownChange = async (value, type) => {
		let path = null;
		if (type === "type") {
			path = "defectTypeID";
			setSelectedDropdown({ ...selectedDropdown, type: value });
		}

		if (type === "riskRating") {
			path = "defectRiskRatingID";
			setSelectedDropdown({ ...selectedDropdown, riskRating: value });
		}

		if (type === "department") {
			path = "siteDepartmentID";
			setSelectedDropdown({ ...selectedDropdown, department: value });
		}
		if (type === "modelName") {
			path = "modelID";
			setSelectedDropdown({ ...selectedDropdown, model: value });
		}
		if (type === "stage") {
			path = "modelVersionStageID";
			setSelectedDropdown({ ...selectedDropdown, stage: value });
		}
		if (type === "zone") {
			path = "modelVersionZoneID";
			setSelectedDropdown({ ...selectedDropdown, zone: value });
		}
		if (type === "asset") {
			path = "siteAssetID";
			setSelectedDropdown({ ...selectedDropdown, asset: value });
		}

		const response = await updateDefect(defectId, [
			{
				path,
				op: "replace",
				value: value.id,
			},
		]);

		if (!response.status)
			dispatch(
				showError(
					response.data.detail || response.data || "Could not update defect"
				)
			);
	};

	const handleInputChange = (e) => {
		setIsInputChanged(true);
		setInput({ ...input, [e.target.name]: e.target.value });
	};

	const handleUpdateInput = async (e) => {
		if (!isInputChanged) return;
		if (
			e.target.name === "details" &&
			(input[e.target.name] === "" || input[e.target.name] === "\n")
		) {
			fetchDefect();
			setInput({ ...input, [e.target.name]: details[e.target.name] });
			return;
		}

		const response = await updateDefect(defectId, [
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

	const handleEnterPress = (e) => {
		if (e.key === "Enter") {
			handleUpdateInput(e);
		}
	};

	useEffect(() => {
		const fetchDepartmentData = async () => {
			try {
				const response = await getAvailabeleModelDeparments(details?.modelID);
				if (response.status) {
					let newDatas = response.data.map((d) => {
						return {
							...d,
							id: d.siteDepartmentID,
						};
					});
					setDepartments(newDatas);
				} else {
					dispatch(showError("Failed to get departments"));
				}
			} catch (error) {
				dispatch(showError("Failed to get departments"));
			}
		};
		fetchDepartmentData();
	}, [details.modelID, dispatch]);

	useEffect(() => {
		setSelectedDropdown({
			type: { id: details.defectTypeID, name: details.defectTypeName },
			riskRating: {
				id: details.defectRiskRatingID,
				name: details.riskRatingName,
			},
			department: {
				id: details.siteDepartmentID,
				name: details.siteDepartmentName,
			},
			model: {
				id: details.modelID,
				name: details.modelModel
					? details.modelName + " " + details.modelModel
					: details.modelName || "",
			},
			stage: {
				name: details.stageName || "",
			},
			zone: {
				name: details.zoneName || "",
			},
			asset: {
				name: details.siteAssetName,
				id: details.siteAssetID,
			},
		});
		setInput({
			...details,
			details: details.details,
			workOrder: details.workOrder,
			tasks: `${details.actionName ?? ""} ${details.taskName ?? ""}`,
		});
	}, [details]);

	const modelAssetId = selectedDropdown?.model?.id;
	useEffect(() => {
		if (modelAssetId) {
			async function getAssets() {
				try {
					let response = await getModelAvailableAsset(modelAssetId);
					if (response.status) {
						let newData = response.data.map((d) => {
							return {
								...d,
								id: d?.siteAssetID,
							};
						});
						setModelAssets(newData);
					} else {
						dispatch(showError("Failed to get Assets"));
					}
				} catch (error) {
					dispatch(showError("Failed to get Assets"));
				}
			}
			getAssets();
		}
	}, [modelAssetId, dispatch]);

	return (
		<AccordionBox
			title="Details"
			defaultExpanded
			showSafetyCritical={details.safetyCritical}
		>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						dataSource={departments}
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.department}`}
						dataHeader={[{ id: 1, name: "Department" }]}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.department}
						onChange={(val) => handleDropdownChange(val, "department")}
						selectdValueToshow="name"
						label={captions?.department}
						required
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.riskRating}`}
						dataHeader={[{ id: 1, name: "Role" }]}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.riskRating}
						onChange={(val) => handleDropdownChange(val, "riskRating")}
						selectdValueToshow="name"
						label={captions?.riskRating}
						required
						fetchData={() => getDefectRiskRatings(siteAppID)}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextFieldContainer
						label={captions.serviceWorkOrder}
						name={"modelModel"}
						value={details?.serviceWorkOrder}
						isDisabled={true}
						isRequired={false}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.type}`}
						dataHeader={[{ id: 1, name: "Type" }]}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.type}
						onChange={(val) => handleDropdownChange(val, "type")}
						selectdValueToshow="name"
						label={captions?.defectType}
						required
						fetchData={() => getDefectTypes(siteAppID)}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						dataHeader={[
							{ id: 1, name: "Name" },
							{ id: 2, name: "Model" },
						]}
						columns={[
							{ id: 1, name: "name" },
							{ id: 2, name: "modelName" },
						]}
						showHeader
						selectedValue={selectedDropdown.model}
						onChange={(val) => {
							handleDropdownChange(val, "modelName");
							setSelectedDropdown({
								...selectedDropdown,
								model: val,
							});
						}}
						handleSort={handleSort}
						selectdValueToshow={"name"}
						label={captions?.model}
						isReadOnly={true}
						required
						fetchData={() => getPublishedModel(siteAppID)}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						dataHeader={[{ id: 1, name: "Stage" }]}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.stage}
						handleSort={handleSort}
						onChange={(val) => {
							setSelectedDropdown({
								...selectedDropdown,
								stage: val,
								zone: {},
							});
							handleDropdownChange(val, "stage");
						}}
						selectdValueToshow="name"
						label={captions?.stage}
						fetchData={() =>
							getModelStage(selectedDropdown?.model?.activeModelVersionID)
						}
						isReadOnly={true}
						placeholder={"none"}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DyanamicDropdown
						placeholder={"none"}
						isServerSide={false}
						width="100%"
						dataHeader={[{ id: 1, name: "Zone" }]}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.zone}
						handleSort={handleSort}
						onChange={(val) => {
							setSelectedDropdown({ ...selectedDropdown, zone: {} });
							handleDropdownChange(val, "zone");
						}}
						selectdValueToshow="name"
						label={captions?.zone}
						fetchData={() =>
							getModelZonesList(selectedDropdown?.model?.activeModelVersionID)
						}
						isReadOnly={true}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<DyanamicDropdown
						dataSource={modelAssets}
						isServerSide={false}
						width="100%"
						placeholder={`Select ${captions?.assest ?? "Asset"}`}
						dataHeader={[{ id: 1, name: "name" }]}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={selectedDropdown.asset}
						onChange={(val) => {
							handleDropdownChange(val, "asset");
						}}
						selectdValueToshow="name"
						label={`${captions?.asset ?? "Asset"}`}
						required
					/>
				</Grid>
				<Grid item xs={6}>
					<TextFieldContainer
						label={captions?.task ?? "Task"}
						name={"taskName"}
						value={input?.tasks}
						isDisabled={true}
						isRequired={false}
					/>
				</Grid>
				<Grid item xs={6}>
					<TextFieldContainer
						label={captions?.interval ?? "Interval"}
						name={"taskName"}
						value={input?.intervalName}
						isDisabled={true}
						isRequired={false}
					/>
				</Grid>
				<Grid item xs={6}>
					<TextFieldContainer
						label={captions?.question ?? "Question"}
						name={"taskName"}
						value={input?.question}
						isDisabled={true}
						isRequired={false}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextFieldContainer
						label="Notification Number"
						name="workOrder"
						value={input?.workOrder}
						onChange={handleInputChange}
						onBlur={handleUpdateInput}
						onKeyDown={handleEnterPress}
						isRequired={false}
					/>
				</Grid>
				<Grid item xs={12} md={12}>
					<Add.InputContainer>
						<Add.FullWidthContainer style={{ paddingRight: 0 }}>
							<Add.NameLabel>
								{`${captions.defect} Details`}
								<Add.RequiredStar>*</Add.RequiredStar>
							</Add.NameLabel>

							<TextAreaInputField
								value={input?.details}
								name="details"
								onChange={handleInputChange}
								onBlur={handleUpdateInput}
								minRows={5}
								style={{
									width: "100%",
									fontSize: "16px",
									borderRadius: "5px",
								}}
							/>
						</Add.FullWidthContainer>
					</Add.InputContainer>
				</Grid>
			</Grid>
		</AccordionBox>
	);
}

export default Details;
