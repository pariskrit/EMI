import DyanamicDropdown from "components/Elements/DyamicDropdown";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import AccordionBox from "components/Layouts/AccordionBox";
import { handleSort } from "helpers/utils";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getModelAsset } from "services/models/modelDetails/modelAsset";
import { getModelIntervals } from "services/models/modelDetails/modelIntervals";
import { getModelRolesList } from "services/models/modelDetails/modelRoles";
import { getPublishedModel } from "services/models/modelList";
import { patchServiceDetails } from "services/services/serviceDetails/detail";

function DetailTile({
	classes,
	isReadOnly,
	detail,
	customCaptions,
	siteAppID,
	serviceId,
	dispatch,
	state,
}) {
	const reduxDispatch = useDispatch();
	const [serviceDetails, setServiceDetail] = useState({});
	const [updating, setUpdating] = useState({});

	useEffect(() => {
		if (detail) {
			setServiceDetail(detail);
		}
	}, [detail]);

	const handleDropDopChnage = async (val, field, actualField, otherField) => {
		setUpdating((prev) => ({ ...prev, [field]: true }));

		try {
			const response = await patchServiceDetails(serviceId, [
				{ op: "replace", path: actualField, value: val.id },
			]);
			if (response.status) {
				dispatch({
					type: "UPDATE_FIELD",
					payload: { name: field, value: response.data[field] },
				});
				dispatch({
					type: "UPDATE_FIELD",
					payload: { name: otherField, value: val?.name },
				});
			} else {
				reduxDispatch(
					showError(response?.data?.detail || "could not update " + field)
				);
			}
		} catch (error) {
			reduxDispatch(
				showError(error?.data?.detail || "could not update " + field)
			);
		}
		setUpdating((prev) => ({ ...prev, [field]: false }));
	};

	const handleBlurTextField = async (name) => {
		setUpdating((prev) => ({ ...prev, [name]: true }));
		try {
			const response = await patchServiceDetails(serviceId, [
				{
					op: "replace",
					path: name,
					value: serviceDetails[name],
				},
			]);
			if (response.status) {
				console.log(response.data[name]);
				dispatch({
					type: "UPDATE_FIELD",
					payload: {
						name: name,
						value: response.data[name],
					},
				});
			} else {
				reduxDispatch(
					showError(response?.data?.detail || "could not update " + name)
				);
				setServiceDetail((prev) => ({ ...prev, [name]: detail[name] }));
			}
		} catch (error) {
			reduxDispatch(
				showError(error?.data?.detail || "could not update " + name)
			);
		}
		setUpdating((prev) => ({ ...prev, [name]: false }));
	};

	const onInputChange = (e, name) => {
		e.persist();
		setServiceDetail((prev) => ({
			...prev,
			[name]: e.target.value,
		}));
	};

	const onEnterPress = (e) => {
		if (e.key === "Enter") {
			handleBlurTextField(e.target.name);
		}
	};

	return (
		<AccordionBox title={"Details"}>
			<div className={classes.inputContainer}>
				<TextFieldContainer
					label={customCaptions?.serviceWorkOrder}
					name={"workOrder"}
					value={serviceDetails?.workOrder}
					onChange={(e) => onInputChange(e, "workOrder")}
					onBlur={() => handleBlurTextField("workOrder")}
					isFetching={updating["workOrder"] === true}
					isDisabled={isReadOnly}
					isRequired={true}
					onKeyDown={onEnterPress}
				/>
				<DyanamicDropdown
					isServerSide={false}
					width="100%"
					placeholder="Select Role"
					dataHeader={[{ id: 1, name: "Role" }]}
					columns={[{ id: 1, name: "name" }]}
					// dataSource={dropDownDatas?.actions}
					selectedValue={{
						name: serviceDetails.role,
						id: serviceDetails.roleID,
					}}
					handleSort={handleSort}
					onChange={(val) =>
						handleDropDopChnage(val, "roleID", "modelVersionRoleID", "role")
					}
					selectdValueToshow="name"
					label={customCaptions?.role}
					required
					isReadOnly={isReadOnly || updating["roleID"] === true}
					fetchData={() => getModelRolesList(serviceDetails.modelID)}
				/>
				<div style={{ marginBottom: 14 }}></div>
				<DyanamicDropdown
					isServerSide={false}
					width="100%"
					placeholder="Select Model"
					dataHeader={[{ id: 1, name: "Model" }]}
					columns={[{ id: 1, name: "name" }]}
					// dataSource={dropDownDatas?.actions}
					selectedValue={{
						name: serviceDetails.modelName,
						id: serviceDetails.modelID,
					}}
					handleSort={handleSort}
					onChange={(val) =>
						handleDropDopChnage(val, "modelID", "modelID", "modelName")
					}
					selectdValueToshow="name"
					label={customCaptions?.model}
					required
					isReadOnly={isReadOnly || updating["modelID"] === true}
					fetchData={() => getPublishedModel(serviceDetails.siteAppID)}
				/>
				<div style={{ marginBottom: 14 }}></div>
				<DyanamicDropdown
					isServerSide={false}
					width="100%"
					placeholder="Select Model"
					dataHeader={[{ id: 1, name: "Model" }]}
					columns={[{ id: 1, name: "name" }]}
					// dataSource={dropDownDatas?.actions}
					selectedValue={{
						name: serviceDetails.interval,
						id: serviceDetails.intervalID,
					}}
					handleSort={handleSort}
					onChange={(val) =>
						handleDropDopChnage(
							val,
							"intervalID",
							"modelVersionIntervalID",
							"interval"
						)
					}
					selectdValueToshow="name"
					label={customCaptions?.interval}
					required
					isReadOnly={isReadOnly || updating["intervalID"] === true}
					fetchData={() => getModelIntervals(serviceDetails.modelID)}
				/>
				<div style={{ marginBottom: 14 }}></div>
				<TextFieldContainer
					label={"Scheduled Date"}
					name={"scheduledDate"}
					value={serviceDetails.scheduledDate}
					onChange={(e) => onInputChange(e, "scheduledDate")}
					onBlur={() => handleBlurTextField("scheduledDate")}
					isDisabled={isReadOnly}
					isRequired={true}
					type="datetime-local"
					// onKeyDown={onEnterPress}
				/>
				{serviceDetails?.modelTemplateType === "A" ? (
					<DyanamicDropdown
						isServerSide={false}
						width="100%"
						placeholder="Select Asset"
						dataHeader={[{ id: 1, name: "Asset" }]}
						columns={[{ id: 1, name: "name" }]}
						// dataSource={dropDownDatas?.actions}
						selectedValue={{
							name: serviceDetails.siteAssetName,
							// id: serviceDetails.modelID,
						}}
						handleSort={handleSort}
						onChange={(val) =>
							handleDropDopChnage(
								val,
								"siteAssetID",
								"siteAssetID",
								"siteAssetName"
							)
						}
						selectdValueToshow="name"
						label={customCaptions?.asset}
						required
						isReadOnly={isReadOnly || updating["siteAssetID"] === true}
						fetchData={() => getModelAsset(serviceDetails.modelID)}
					/>
				) : (
					""
				)}
				<div style={{ marginBottom: 14 }}></div>
				<TextFieldContainer
					label={"WONN (Work Order Notification Number)"}
					name={"notificationNumber"}
					value={serviceDetails?.notificationNumber}
					onChange={(e) => onInputChange(e, "notificationNumber")}
					onBlur={() => handleBlurTextField("notificationNumber")}
					isRequired={false}
					isDisabled={isReadOnly}
					isFetching={updating["notificationNumber"] === true}
					onKeyDown={onEnterPress}
				/>
			</div>
		</AccordionBox>
	);
}

export default DetailTile;
