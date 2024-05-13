import DyanamicDropdown from "components/Elements/DyamicDropdown";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import AccordionBox from "components/Layouts/AccordionBox";
import { handleSort, isoDateFormat } from "helpers/utils";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import { getModelDeparments } from "services/models/modelDetails/details";
import { getModelAvailableAsset } from "services/models/modelDetails/modelAsset";
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
	const [modelAssest, setModelAssest] = useState([]);
	const [siteAppState, setSiteAppState] = useState(null);
	const [roles, setRoles] = useState([]);
	const [departments, setDepartments] = useState([]);

	const {
		site: { showServiceClientName },
		application: showArrangements,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	//to get the state of current application--applicatioin.showLubricants and so on.
	const fetchSiteApplicationDetails = async () => {
		try {
			const result = await getSiteApplicationDetail(siteAppID);
			const localItems =
				JSON.parse(sessionStorage.getItem("me")) ||
				JSON.parse(localStorage.getItem("me"));

			const updatedStorage = {
				...localItems,
				site: {
					...localItems.site,
					showServiceClientName: result?.data?.showServiceClientName,
				},
			};
			sessionStorage.setItem("me", JSON.stringify(updatedStorage));
			localStorage.setItem("me", JSON.stringify(updatedStorage));
			setSiteAppState(result);
		} catch (err) {
			reduxDispatch(
				showError(err?.response?.data?.detail || "Failed to fetch data. ")
			);
		}
	};

	useEffect(() => {
		fetchSiteApplicationDetails();
		const date = isoDateFormat(
			detail?.scheduledDate[detail?.scheduledDate?.length - 1] === "Z"
				? detail?.scheduledDate
				: detail?.scheduledDate + "Z"
		);
		if (detail) {
			setServiceDetail({ ...detail, scheduledDate: date });
		}
	}, [detail, siteAppID]);

	useEffect(() => {
		const fetchAssetData = async () => {
			try {
				const response = await getModelAvailableAsset(detail.modelID);
				if (response.status) {
					let newData = response.data.map((d) => {
						return {
							...d,
							id: d.siteAssetID,
						};
					});
					setModelAssest(newData);
				} else {
					reduxDispatch(
						showError(
							response?.data?.detail || "Error while getting the assest data "
						)
					);
				}
			} catch (error) {
				reduxDispatch(
					showError(
						error?.data?.detail || "Error while getting the assest data"
					)
				);
			}
		};
		if (detail?.modelID) {
			fetchAssetData();
		}
	}, [detail.modelID, reduxDispatch]);

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const res = await getModelRolesList(
					serviceDetails.activeModelVersionID
				);
				if (res.status) {
					setRoles(res?.data);
					res?.data?.forEach((data) => {
						if (data.id === serviceDetails.roleID && data?.siteDepartmentID) {
							dispatch({
								type: "UPDATE_FIELD",
								payload: {
									name: "siteDepartmentID",
									value: data?.siteDepartmentID || "",
								},
							});
							dispatch({
								type: "UPDATE_FIELD",
								payload: {
									name: "departmentName",
									value: data?.siteDepartmentName || "",
								},
							});
						}
					});
				} else {
					reduxDispatch(
						showError(
							res?.data?.detail || "Error while getting the roles data!"
						)
					);
				}
			} catch (err) {
				reduxDispatch(
					showError(err?.data?.detail || "Error while getting the roles data!")
				);
			}
		};
		if (serviceDetails.activeModelVersionID && !isReadOnly) fetchRoles();
	}, [
		serviceDetails.activeModelVersionID,
		reduxDispatch,
		isReadOnly,
		dispatch,
	]);

	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				const res = await getModelDeparments(
					serviceDetails.activeModelVersionID
				);
				if (res.status) {
					const filteredDepartments = res?.data
						?.filter((department) => department?.id)
						?.map((d) => ({
							...d,
							id: d?.modelDepartmentID,
						}));
					setDepartments(filteredDepartments);
				} else {
					reduxDispatch(
						showError(
							res?.data?.detail || "Error while getting the departments data!"
						)
					);
				}
			} catch (err) {
				reduxDispatch(
					showError(
						err?.data?.detail || "Error while getting the departments data!"
					)
				);
			}
		};
		if (serviceDetails.activeModelVersionID && !isReadOnly) fetchDepartments();
	}, [serviceDetails.activeModelVersionID, reduxDispatch, isReadOnly]);

	const handleDropDopChnage = async (val, field, actualField, otherField) => {
		if (+val.id === +serviceDetails[field]) return;

		setUpdating((prev) => ({ ...prev, [field]: true }));

		try {
			const response =
				actualField === "siteAssetID"
					? await patchServiceDetails(serviceId, [
							{ op: "replace", path: actualField, value: val.siteAssetID },
					  ])
					: await patchServiceDetails(serviceId, [
							{ op: "replace", path: actualField, value: val.id },
							...(actualField === "modelVersionRoleID" &&
							val?.siteDepartmentID &&
							val?.siteDepartmentID !== serviceDetails?.siteDepartmentID
								? [
										{
											op: "replace",
											path: "siteDepartmentID",
											value: val?.siteDepartmentID,
										},
								  ]
								: []),
					  ]);
			if (response.status) {
				if (actualField === "siteAssetID")
					dispatch({
						type: "UPDATE_FIELD",
						payload: { name: "arrangement", value: val?.arrangementName || "" },
					});
				if (actualField === "modelVersionRoleID" && val?.siteDepartmentID) {
					dispatch({
						type: "UPDATE_FIELD",
						payload: {
							name: "siteDepartmentID",
							value: val?.siteDepartmentID || "",
						},
					});
					dispatch({
						type: "UPDATE_FIELD",
						payload: {
							name: "departmentName",
							value: val?.siteDepartmentName || "",
						},
					});
				}
				dispatch({
					type: "UPDATE_FIELD",
					payload: { name: field, value: response?.data[actualField] },
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
		if (serviceDetails[name] === detail[name]) return;

		let patchData;

		if (name === "scheduledDate") {
			patchData = new Date(serviceDetails[name])?.toISOString();
		} else {
			patchData = serviceDetails[name];
		}

		setUpdating((prev) => ({ ...prev, [name]: true }));
		try {
			const response = await patchServiceDetails(serviceId, [
				{
					op: "replace",
					path: name,
					value: patchData,
				},
			]);
			if (response.status) {
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
					placeholder="Select Model"
					dataHeader={[
						{ id: 1, name: "Name" },
						{ id: 2, name: "Model" },
					]}
					columns={[
						{ id: 1, name: "name" },
						{ id: 2, name: "modelName" },
					]}
					// dataSource={dropDownDatas?.actions}
					selectedValue={{
						name:
							(serviceDetails.modelName ?? "") +
							" " +
							(serviceDetails?.model ?? ""),
						id: serviceDetails.modelID,
					}}
					handleSort={handleSort}
					onChange={(val) =>
						handleDropDopChnage(val, "modelID", "modelID", "modelName")
					}
					showHeader
					selectdValueToshow="name"
					label={customCaptions?.model}
					required
					isReadOnly={true}
					fetchData={() => getPublishedModel(serviceDetails.siteAppID)}
				/>

				<div style={{ marginBottom: 14 }}></div>
				{serviceDetails?.modelTemplateType === "A" ? (
					<DyanamicDropdown
						dataSource={modelAssest}
						isServerSide={false}
						width="100%"
						placeholder="Select Asset"
						showHeader
						dataHeader={[
							{ id: 1, name: "Asset" },
							{ id: 2, name: "Description" },
							...(state.hasArrangements
								? [{ id: 3, name: "Arrangement" }]
								: []),
						]}
						columns={[
							{ id: 1, name: "name" },
							{ id: 2, name: "description" },
							...(state.hasArrangements
								? [{ id: 3, name: "arrangementName" }]
								: []),
						]}
						// dataSource={dropDownDatas?.actions}
						selectedValue={{
							name:
								serviceDetails.siteAssetName +
								`${
									serviceDetails.arrangement
										? ` (${serviceDetails.arrangement})`
										: ""
								}`,
							id: serviceDetails.siteAssetID,
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
					/>
				) : (
					""
				)}

				<div style={{ marginBottom: 14 }}></div>
				<DyanamicDropdown
					isServerSide={false}
					dataSource={roles}
					width="100%"
					placeholder="Select Role"
					dataHeader={[{ id: 1, name: "Role" }]}
					columns={[{ id: 1, name: "name" }]}
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
				/>
				<div style={{ marginBottom: 14 }}></div>
				<DyanamicDropdown
					isServerSide={false}
					width="100%"
					placeholder="Select Department"
					dataHeader={[{ id: 2, name: "Department" }]}
					columns={[{ id: 2, name: "name" }]}
					dataSource={departments}
					selectedValue={{
						name: serviceDetails.departmentName,
						id: serviceDetails.siteDepartmentID,
					}}
					handleSort={handleSort}
					onChange={(val) =>
						handleDropDopChnage(
							val,
							"siteDepartmentID",
							"siteDepartmentID",
							"departmentName"
						)
					}
					selectdValueToshow="name"
					label={customCaptions?.department}
					required
					isReadOnly={
						isReadOnly ||
						updating["siteDepartmentID"] === true ||
						//test if the status type is scheduled i.e "S" or not
						state?.Status === "S" ||
						serviceDetails?.siteDepartmentID ||
						departments.length === 1
					}
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
					fetchData={() =>
						getModelIntervals(serviceDetails.activeModelVersionID)
					}
				/>
				<div style={{ marginBottom: 14 }}></div>
				<TextFieldContainer
					label={"Scheduled Date"}
					name={"scheduledDate"}
					value={serviceDetails?.scheduledDate}
					onChange={(e) => onInputChange(e, "scheduledDate")}
					onBlur={() => handleBlurTextField("scheduledDate")}
					isDisabled={isReadOnly}
					isRequired={true}
					type="datetime-local"
					// onKeyDown={onEnterPress}
				/>

				<div style={{ marginBottom: 14 }}></div>
				<TextFieldContainer
					label={customCaptions?.notificationNumber}
					name={"notificationNumber"}
					value={serviceDetails?.notificationNumber}
					onChange={(e) => onInputChange(e, "notificationNumber")}
					onBlur={() => handleBlurTextField("notificationNumber")}
					isRequired={false}
					isDisabled={isReadOnly}
					isFetching={updating["notificationNumber"] === true}
					onKeyDown={onEnterPress}
				/>
				{showServiceClientName && (
					<>
						<div style={{ marginBottom: 14 }}></div>
						<TextFieldContainer
							label={"Client Name"}
							name={"clientName"}
							value={serviceDetails?.clientName}
							onChange={(e) => onInputChange(e, "clientName")}
							onBlur={() => handleBlurTextField("clientName")}
							isRequired={false}
							isDisabled={isReadOnly}
							isFetching={updating["clientName"] === true}
							onKeyDown={onEnterPress}
						/>
					</>
				)}
			</div>
		</AccordionBox>
	);
}

export default DetailTile;
