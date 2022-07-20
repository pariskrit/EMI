import { Grid } from "@material-ui/core";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import TextAreaInputField from "components/Elements/TextAreaInputField";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import AccordionBox from "components/Layouts/AccordionBox";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getDefectRiskRatings } from "services/clients/sites/siteApplications/defectRiskRatings";
import { getDefectTypes } from "services/clients/sites/siteApplications/defectTypes";
import { updateDefect } from "services/defects/details";
import { getAvailabeleModelDeparments } from "services/models/modelDetails/details";
import AddDialogStyle from "styles/application/AddDialogStyle";

const Add = AddDialogStyle();

function Details({ details, siteAppID, captions, defectId }) {
	const [selectedDropdown, setSelectedDropdown] = useState({
		type: {},
		riskRating: {},
		department: {},
	});
	const [input, setInput] = useState("");
	const [isInputChanged, setIsInputChanged] = useState(false);
	const dispatch = useDispatch();
	const [departments, setDepartments] = useState([]);

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

		const response = await await updateDefect(defectId, [
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
		});
		setInput({
			details: details.details,
			workOrder: details.workOrder,
			tasks: `${details.actionName ?? ""} ${details.taskName ?? ""}`,
		});
	}, [details]);
	return (
		<AccordionBox
			title="Details"
			defaultExpanded
			showSafetyCritical={details.safetyCritical}
		>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<TextFieldContainer
						label={captions?.model ?? "Model"}
						name={"modelModel"}
						value={details?.modelModel}
						isDisabled={true}
					/>
				</Grid>
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
					<TextFieldContainer
						label={`${captions?.asset ?? "Asset"}`}
						name={"siteAssetName"}
						value={details?.siteAssetName}
						isDisabled={true}
						isRequired={true}
					/>
				</Grid>

				<Grid item xs={12} md={6}>
					<TextFieldContainer
						label={captions?.stage ?? "Stage"}
						name={"stageName"}
						value={details?.stageName}
						isDisabled={true}
						isRequired={false}
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
						label="Notification Number"
						name="workOrder"
						value={input?.workOrder}
						onChange={handleInputChange}
						onBlur={handleUpdateInput}
						isRequired={true}
						onKeyDown={handleEnterPress}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextFieldContainer
						label={captions?.zone ?? "Zone"}
						name={"zoneName"}
						value={details?.zoneName}
						isDisabled={true}
						isRequired={false}
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

				<Grid item xs={12}>
					<Add.InputLabel>
						{captions?.defect} Details <Add.RequiredStar>*</Add.RequiredStar>
					</Add.InputLabel>

					<TextAreaInputField
						minRows={9}
						style={{ width: "100%" }}
						value={input?.details}
						onChange={handleInputChange}
						name="details"
						onBlur={handleUpdateInput}
					/>
				</Grid>
			</Grid>
		</AccordionBox>
	);
}

export default Details;
