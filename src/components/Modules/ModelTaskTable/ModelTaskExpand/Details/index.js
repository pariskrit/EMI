import React, { useEffect, useState } from "react";
import { DialogContent, InputAdornment } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AddDialogStyle from "styles/application/AddDialogStyle";
import { handleSort } from "helpers/utils";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import EMICheckbox from "components/Elements/EMICheckbox";
import TaskDetailNotes from "./Notes/TaskDetailNotes";
import { getOperatingModes } from "services/clients/sites/siteApplications/operatingModes";
import { getSystems } from "services/clients/sites/siteApplications/systems";
import { getModelRolesList } from "services/models/modelDetails/modelRoles";
import { getActions } from "services/clients/sites/siteApplications/actions";
import { useContext } from "react";
import { ModelContext } from "contexts/ModelDetailContext";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { patchModelTask } from "services/models/modelDetails/modelTasks";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import { Facebook } from "react-spinners-css";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import {
	addModelVersionTaskRoles,
	removeModelVersionTaskRole,
} from "services/models/modelDetails/modelVersionTaskRole";
import withMount from "components/HOC/withMount";
import ErrorMessageWithErrorIcon from "components/Elements/ErrorMessageWithErrorIcon";
import { TaskContext } from "contexts/TaskDetailContext";
import { getStages } from "services/models/modelDetails/modelTasks/stages";

const ADD = AddDialogStyle();

const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
		overflowY: "unset",
	},
	createButton: {
		[media]: {
			width: "auto",
		},
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
		marginBottom: "10px",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	inputText: {
		fontSize: 14,
	},
	inputContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		marginBottom: 20,
	},
}));

const TaskDetails = ({
	state,
	taskInfo,
	setTaskInfo,
	access,
	isMounted,
	isFetching = false,
	fetchFunction = () => {},
}) => {
	const { classes, cx } = useStyles();

	// const [loading, setLoading] = useState(false);
	// const [dropDownDatas, setDropDownDatas] = useState({});
	const [localTaskInfo, setLocalTaskInfo] = useState({});
	const [isUpdating, setUpdating] = useState({});

	const reduxDispatch = useDispatch();

	const [modelState] = useContext(ModelContext);
	const [, taskDispatch] = useContext(TaskContext);
	const {
		modelDetail: { id, modelID: modelDefaultId, isPublished },
	} = modelState;

	const {
		position: { siteAppID },
		customCaptions,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	useEffect(() => {
		if (taskInfo) {
			setLocalTaskInfo(taskInfo);
			const getStage = async () => {
				const result = await getStages(taskInfo.id);
				if (result.status) {
					taskDispatch({ type: "SET_STAGE_LIST", payload: result.data });
				}
			};
			getStage();
		}
	}, [taskInfo, taskDispatch]);

	useEffect(() => {
		if (
			localTaskInfo?.roles === null ||
			localTaskInfo?.roles?.filter((r) => r.id !== null).length === 0
		) {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "role",
					value: `No ${customCaptions?.rolePlural} Assigned`,
				},
			});
		} else {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "role",
					value: "",
				},
			});
		}
		if (+localTaskInfo.estimatedMinutes <= 0) {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "estimatedMinutes",
					value: `Invalid Estimated Minutes`,
				},
			});
		} else {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "estimatedMinutes",
					value: "",
				},
			});
		}
	}, [
		customCaptions.rolePlural,
		localTaskInfo.roles,
		taskDispatch,
		localTaskInfo.estimatedMinutes,
	]);

	// checking the access of the user to allow or disallow edit add.
	const isReadOnly = access === "R";
	const isEditOnly = access === "E";

	// useEffect(() => {
	// 	const fetchDropDownDatas = async () => {
	// 		!isMounted.aborted && setLoading(true);
	// 		const response = await Promise.all([
	// 			// getOperatingModes(siteAppID),
	// 			// getSystems(siteAppID),
	// 			// getModelRolesList(id),
	// 			// getActions(siteAppID),
	// 		]);
	// 		const isResponseError = response.some((data) => !data.status);

	// 		if (isResponseError) {
	// 			reduxDispatch(showError("Error: Could not fetch Dropdown datas"));
	// 			if (!isMounted.aborted) {
	// 				setDropDownDatas({
	// 					operatingModes: [],
	// 					systems: [],
	// 					roles: [],
	// 					actions: [],
	// 				});
	// 			}
	// 		} else {
	// 			if (!isMounted.aborted) {
	// 				setDropDownDatas({
	// 					// operatingModes: response[0].data,
	// 					// systems: response[1].data,
	// 					// roles: response[2].data,
	// 					// actions: response[3].data,
	// 				});
	// 			}
	// 		}
	// 		!isMounted.aborted && setLoading(false);
	// 	};
	// 	!isReadOnly && fetchDropDownDatas();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [id, reduxDispatch, siteAppID, isReadOnly]);

	const handleEnterPress = (e, name) => {
		// 13 is the enter keycode

		if (e.keyCode === 13) {
			handleOnBlur(e.target.value, name);
		}
	};

	const checklistChangeHandler = async (id) => {
		const roleToFind = localTaskInfo?.roles?.find(
			(r) => r.modelVersionRoleID === id
		);
		setUpdating((prev) => ({ ...prev, role: true }));

		if (roleToFind?.id === null) {
			try {
				const response = await addModelVersionTaskRoles({
					ModelVersionTaskID: taskInfo?.id,
					ModelVersionRoleID: id,
				});
				if (response.status) {
					setTaskInfo((prev) => ({
						...prev,
						roles: localTaskInfo?.roles?.map((r) =>
							r.modelVersionRoleID === id ? { ...r, id: response.data?.id } : r
						),
					}));
					taskDispatch({
						type: "TAB_COUNT",
						payload: {
							countTab: "roles",
							data: localTaskInfo?.roles?.map((r) =>
								r.modelVersionRoleID === id
									? { ...r, id: response?.data?.id }
									: r
							),
						},
					});

					setLocalTaskInfo({
						...localTaskInfo,
						roles: localTaskInfo?.roles?.map((r) =>
							r.modelVersionRoleID === id ? { ...r, id: response?.data?.id } : r
						),
					});

					const dataCell = document
						.getElementById(`taskExpandable${taskInfo.id}`)
						?.querySelector(`#dataCellroles > div > p`);
					if (dataCell) {
						dataCell.innerHTML = response?.data?.roles;
					}
				} else {
					reduxDispatch(
						showError(
							response?.data?.title ||
								response?.data ||
								"Could not update task detail"
						)
					);
				}
			} catch (error) {
				reduxDispatch(
					showError(
						error?.response?.data ||
							error?.response ||
							"Could not update task detail"
					)
				);
			} finally {
				setUpdating((prev) => ({ ...prev, role: false }));
			}
		} else {
			try {
				const response = await removeModelVersionTaskRole(roleToFind?.id);
				if (response.status) {
					setTaskInfo((prev) => ({
						...prev,
						roles: localTaskInfo?.roles?.map((r) =>
							r.modelVersionRoleID === id ? { ...r, id: null } : r
						),
					}));
					taskDispatch({
						type: "TAB_COUNT",
						payload: {
							countTab: "roles",
							data: localTaskInfo?.roles?.map((r) =>
								r.modelVersionRoleID === id ? { ...r, id: null } : r
							),
						},
					});
					setLocalTaskInfo({
						...localTaskInfo,
						roles: localTaskInfo?.roles?.map((r) =>
							r.modelVersionRoleID === id ? { ...r, id: null } : r
						),
					});

					const dataCell = document
						.getElementById(`taskExpandable${taskInfo.id}`)
						?.querySelector(`#dataCellroles > div > p`);
					if (dataCell) {
						dataCell.innerHTML = response?.data?.roles;
					}
				} else {
					reduxDispatch(
						showError(
							response?.data?.title ||
								response?.data ||
								"Could not update task detail"
						)
					);
				}
			} catch (error) {
				reduxDispatch(
					showError(
						error?.response?.data ||
							error?.response ||
							"Could not update task detail"
					)
				);
			} finally {
				setUpdating((prev) => ({ ...prev, role: false }));
			}
		}
	};

	const dropdownHandleChange = async (value, name, actualName) => {
		setLocalTaskInfo({
			...localTaskInfo,
			[name]: value?.id || null,
			[actualName]: value?.name,
		});

		setUpdating((prev) => ({ ...prev, [name]: true }));

		try {
			const response = await patchModelTask(taskInfo?.id, [
				{
					op: "replace",
					path: name,
					value: value?.id || null,
				},
			]);
			if (response.status) {
				setTaskInfo((prev) => ({
					...prev,
					[name]: value?.id || null,
					[actualName]: value?.name,
				}));
				const rowDataCell = document
					.getElementById(`taskExpandable${taskInfo.id}`)
					?.querySelector(`#dataCell${actualName} > div`);

				if (rowDataCell) {
					rowDataCell.innerHTML = value.name || "";
				}
				if (isFetching) {
					await fetchFunction();
				}
			} else {
				reduxDispatch(
					showError(
						response?.data?.title ||
							response?.data ||
							"Could not update task detail"
					)
				);
				setLocalTaskInfo(taskInfo);
			}
		} catch (error) {
			setLocalTaskInfo(taskInfo);
			reduxDispatch(
				showError(
					error?.response?.data ||
						error?.response ||
						"Could not update task detail"
				)
			);
		} finally {
			setUpdating((prev) => ({ ...prev, [name]: false }));
		}
	};
	const handleOnChange = (value, name) => {
		if (name === "estimatedMinutes") {
			if (value.includes(".")) {
				value = value.split(".");
				setLocalTaskInfo({
					...localTaskInfo,
					[name]: value[0] + "." + value[1][0],
				});
			} else {
				setLocalTaskInfo({ ...localTaskInfo, [name]: value });
			}
		} else {
			setLocalTaskInfo({ ...localTaskInfo, [name]: value });
		}
	};

	const handleOnBlur = async (value, name) => {
		if (value === "") {
			setLocalTaskInfo({ ...localTaskInfo, [name]: taskInfo?.name });
			return;
		}
		if (value === taskInfo[name]) return;

		setUpdating((prev) => ({ ...prev, [name]: true }));

		try {
			const response = await patchModelTask(taskInfo?.id, [
				{
					op: "replace",
					path: name,
					value: value,
				},
			]);
			if (response.status) {
				setTaskInfo((prev) => ({ ...prev, [name]: value }));
				taskDispatch({
					type: "TAB_COUNT",
					payload: {
						countTab: name,
						data: value,
					},
				});

				const rowDataCell = document
					.getElementById(`taskExpandable${taskInfo.id}`)
					?.querySelector(`#dataCell${name} > div`);

				if (rowDataCell) {
					rowDataCell.innerHTML = value || "";
				}

				if (isFetching) {
					await fetchFunction();
				}
			} else {
				reduxDispatch(
					showError(
						response?.data?.title ||
							response?.data ||
							"Could not update task detail"
					)
				);
				setLocalTaskInfo(taskInfo);
			}
		} catch (error) {
			setLocalTaskInfo(taskInfo);
			reduxDispatch(
				showError(
					error?.response?.data ||
						error?.response ||
						"Could not update task detail"
				)
			);
		} finally {
			setUpdating((prev) => ({ ...prev, [name]: false }));
		}
	};
	return (
		<>
			<DialogContent className={classes.dialogContent}>
				<div>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<DyanamicDropdown
								isServerSide={false}
								width="100%"
								placeholder="Select Action"
								dataHeader={[{ id: 1, name: "Actions" }]}
								columns={[{ id: 1, name: "name" }]}
								// dataSource={dropDownDatas?.actions}
								showHeader
								selectedValue={{
									name: localTaskInfo?.actionName,
									id: localTaskInfo?.actionID,
								}}
								handleSort={handleSort}
								onChange={(val) =>
									dropdownHandleChange(val, "actionID", "actionName")
								}
								selectdValueToshow="name"
								showClear
								disabled={isUpdating.actionID}
								label={customCaptions?.actionRequired}
								isReadOnly={isReadOnly || isPublished}
								fetchData={() => getActions(siteAppID)}
							/>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<DyanamicDropdown
								isServerSide={false}
								width="100%"
								placeholder="Select Roles"
								dataHeader={[{ id: 1, name: "Roles" }]}
								columns={[{ id: 1, name: "name" }]}
								// dataSource={dropDownDatas?.roles}
								label={customCaptions?.rolePlural}
								showHeader
								handleSort={handleSort}
								selectedValue={
									localTaskInfo?.roles
										?.filter((r) => r.id !== null)
										?.map((r) => r.name)
										?.join(", ") ?? ""
								}
								rolesChecklist={
									localTaskInfo?.roles
										?.filter((r) => r.id !== null)
										?.map((r) => ({
											id: r?.modelVersionRoleID,
											name: r?.name,
										})) ?? []
								}
								hasCheckBoxList={true}
								checklistChangeHandler={checklistChangeHandler}
								isReadOnly={isReadOnly || isPublished}
								disabled={isUpdating.role}
								fetchData={() => getModelRolesList(id)}
								showErrorIcon={
									localTaskInfo?.roles === null ||
									localTaskInfo?.roles?.filter((r) => r.id !== null).length ===
										0
								}
								errorMessage={`No ${customCaptions?.rolePlural} Assigned`}
								required
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer
							style={{
								paddingRight: state?.data?.application?.showSystem
									? "15px"
									: "0px",
								width: state?.data?.application?.showSystem ? "50%" : "100%",
							}}
						>
							<TextFieldContainer
								label="Name"
								name="name"
								value={localTaskInfo?.name}
								onChange={(e) => handleOnChange(e.target.value, "name")}
								onBlur={(e) => {
									handleOnBlur(e.target.value, "name");
								}}
								isFetching={isUpdating?.name}
								isDisabled={isUpdating?.name || isReadOnly || isPublished}
								onKeyDown={(e) => handleEnterPress(e, "name")}
							/>
						</ADD.LeftInputContainer>
						{state?.data?.application?.showSystem && (
							<ADD.RightInputContainer>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder="Select System"
									// dataSource={dropDownDatas?.systems}
									dataHeader={[{ id: 1, name: "System" }]}
									columns={[{ id: 1, name: "name" }]}
									showHeader
									selectedValue={{
										name: localTaskInfo?.systemName,
										id: localTaskInfo?.systemID,
									}}
									handleSort={handleSort}
									onChange={(val) =>
										dropdownHandleChange(val, "systemID", "systemName")
									}
									selectdValueToshow="name"
									showClear
									disabled={isUpdating.systemID}
									label={customCaptions?.system}
									isReadOnly={isReadOnly || isPublished}
									fetchData={() => getSystems(siteAppID)}
								/>
							</ADD.RightInputContainer>
						)}
					</ADD.InputContainer>
					<ADD.InputContainer>
						{state?.data?.application?.showOperatingMode && (
							<ADD.LeftInputContainer>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={`Select ${customCaptions?.operatingMode}`}
									dataHeader={[{ id: 1, name: "Operating Mode" }]}
									columns={[{ id: 1, name: "name" }]}
									// dataSource={dropDownDatas?.operatingModes}
									showHeader
									selectedValue={{
										name: localTaskInfo?.operatingModeName,
										id: localTaskInfo?.operatingModeID,
									}}
									handleSort={handleSort}
									onChange={(val) =>
										dropdownHandleChange(
											val,
											"operatingModeID",
											"operatingModeName"
										)
									}
									selectdValueToshow="name"
									isReadOnly={isReadOnly || isPublished}
									disabled={isUpdating?.operatingModeID}
									label={customCaptions?.operatingMode}
									fetchData={() => getOperatingModes(siteAppID)}
									showClear
								/>
							</ADD.LeftInputContainer>
						)}
						<ADD.RightInputContainer
							style={{
								paddingLeft: state?.data?.application?.showOperatingMode
									? "15px"
									: "0px",
								width: state?.data?.application?.showOperatingMode
									? "50%"
									: "100%",
							}}
						>
							<ADD.NameLabel>
								<div className="caption-label">
									<span>
										Estimated Minutes{" "}
										<span style={{ color: "#E31212" }}>*</span>{" "}
									</span>
									{+localTaskInfo.estimatedMinutes <= 0 && (
										<ErrorMessageWithErrorIcon message="Invalid Estimated Minutes" />
									)}
								</div>
							</ADD.NameLabel>
							<ADD.NameInput
								value={localTaskInfo?.estimatedMinutes ?? 0}
								onChange={(e) =>
									handleOnChange(e.target.value, "estimatedMinutes")
								}
								onBlur={(e) => {
									handleOnBlur(+e.target.value, "estimatedMinutes");
								}}
								onKeyDown={(e) => handleEnterPress(e, "estimatedMinutes")}
								name="estimatedMinutes"
								variant="outlined"
								type="number"
								fullWidth
								disabled={
									isUpdating?.estimatedMinutes || isReadOnly || isPublished
								}
								InputProps={{
									classes: {
										input: classes.inputText,
									},
									startAdornment: (
										<InputAdornment
											style={{ marginRight: 10 }}
											position="start"
										>
											<QueryBuilderIcon />
										</InputAdornment>
									),
									endAdornment: isUpdating?.estimatedMinutes ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
								}}
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.CheckboxLabel>
								<EMICheckbox
									state={localTaskInfo?.safetyCritical || false}
									changeHandler={(e) => {
										taskDispatch({
											type: "SET_SAFETY",
											payload: e.target.checked,
										});
										handleOnChange(e.target.checked, "safetyCritical");
										handleOnBlur(e.target.checked, "safetyCritical");
									}}
									name="safetyCritical"
									disabled={isReadOnly || isPublished}
								/>
								{customCaptions?.safetyCritical}
							</ADD.CheckboxLabel>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ADD.CheckboxLabel>
								<EMICheckbox
									state={localTaskInfo?.notSkippable || false}
									changeHandler={(e) => {
										handleOnChange(e.target.checked, "notSkippable");
										handleOnBlur(e.target.checked, "notSkippable");
									}}
									name="notSkippable"
									disabled={isReadOnly || isPublished}
								/>
								Cannot Be Skipped
							</ADD.CheckboxLabel>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<TaskDetailNotes
							modelId={modelDefaultId}
							taskGroupId={taskInfo?.taskGroupID}
							taskId={taskInfo?.id}
							customCaptions={customCaptions}
							disabled={isReadOnly || isPublished || isEditOnly}
						/>
					</ADD.InputContainer>
				</div>
			</DialogContent>
		</>
	);
};

export default withMount(TaskDetails);
