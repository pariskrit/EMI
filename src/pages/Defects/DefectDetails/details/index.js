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
import AddDialogStyle from "styles/application/AddDialogStyle";

const Add = AddDialogStyle();

function Details({ details, siteAppID, captions, defectId }) {
	const [selectedDropdown, setSelectedDropdown] = useState({
		type: {},
		riskRating: {},
	});
	const [input, setInput] = useState("");
	const [isInputChanged, setIsInputChanged] = useState(false);
	const dispatch = useDispatch();

	const handleDropdownChange = async (value, type) => {
		if (type === "type") {
			setSelectedDropdown({ ...selectedDropdown, type: value });
		}

		if (type === "riskRating")
			setSelectedDropdown({ ...selectedDropdown, riskRating: value });

		const response = await updateDefect(defectId, [
			{
				path: type === "type" ? "defectTypeID" : "defectRiskRatingID",
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
		setSelectedDropdown({
			type: { id: details.defectTypeID, name: details.defectTypeName },
			riskRating: {
				id: details.defectRiskRatingID,
				name: details.riskRatingName,
			},
		});
		setInput({ details: details.details, workOrder: details.workOrder });
	}, [details]);
	return (
		<AccordionBox
			title="Details"
			defaultExpanded
			showSafetyCritical={details.safetyCritical}
		>
			<Grid container spacing={2}>
				<Grid container item xs={12} md={6}>
					<Grid item xs={12}>
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
					<Grid item xs={12}>
						<div style={{ marginTop: "20px" }}>
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
						</div>
					</Grid>
				</Grid>
				<Grid item xs={12} md={6}>
					<Add.InputLabel>
						{captions?.defect} Details <Add.RequiredStar>*</Add.RequiredStar>
					</Add.InputLabel>

					<TextAreaInputField
						minRows={9}
						style={{ width: "100%" }}
						value={input?.details}
						onChange={handleInputChange}
						name="details"
						onKeyDown={handleEnterPress}
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
						label={captions?.model ?? "Model"}
						name={"modelModel"}
						value={details?.modelModel}
						isDisabled={true}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextFieldContainer
						label={`${captions?.asset ?? "Asset"} Number`}
						name={"siteAssetName"}
						value={details?.siteAssetName}
						isDisabled={true}
						isRequired={false}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextFieldContainer
						label={captions?.stage ?? "Stage"}
						name={"stageName"}
						value={details?.stageName}
						isDisabled={true}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextFieldContainer
						label={captions?.zone ?? "Zone"}
						name={"zoneName"}
						value={details?.zoneName}
						isDisabled={true}
					/>
				</Grid>
				<Grid item xs={6}>
					<TextFieldContainer
						label={captions?.task ?? "Task"}
						name={"taskName"}
						value={details?.taskName}
						isDisabled={true}
					/>
				</Grid>
			</Grid>
		</AccordionBox>
	);
}

export default Details;
