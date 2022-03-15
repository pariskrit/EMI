import React, { useEffect, useState } from "react";
import { DialogContent, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import {
	addModelVersionTaskRoles,
	removeModelVersionTaskRole,
} from "services/models/modelDetails/modelVersionTaskRole";
import withMount from "components/HOC/withMount";

const ADD = AddDialogStyle();

const media = "@media (max-width: 414px)";

const useStyles = makeStyles({
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
});

const TaskDetails = ({ taskInfo, access, isMounted }) => {
	const classes = useStyles();

	const [loading, setLoading] = useState(false);
	const [dropDownDatas, setDropDownDatas] = useState({});
	const [localTaskInfo, setLocalTaskInfo] = useState({});
	const [isUpdating, setUpdating] = useState({});

	const reduxDispatch = useDispatch();
	const [modelState] = useContext(ModelContext);
	const {
		modelDetail: { id },
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
		}
	}, [taskInfo]);

	// checking the access of the user to allow or disallow edit add.
	const isReadOnly = access === "R";
	const isEditOnly = access === "E";

	useEffect(() => {
		const fetchDropDownDatas = async () => {
			!isMounted.aborted && setLoading(true);
			const response = await Promise.all([
				getOperatingModes(siteAppID),
				getSystems(siteAppID),
				getModelRolesList(id),
				getActions(siteAppID),
			]);
			const isResponseError = response.some((data) => !data.status);

			if (isResponseError) {
				reduxDispatch(showError("Error: Could not fetch Dropdown datas"));
				if (!isMounted.aborted) {
					setDropDownDatas({
						operatingModes: [],
						systems: [],
						roles: [],
						actions: [],
					});
				}
			} else {
				if (!isMounted.aborted) {
					setDropDownDatas({
						operatingModes: response[0].data,
						systems: response[1].data,
						roles: response[2].data,
						actions: response[3].data,
					});
				}
			}
			!isMounted.aborted && setLoading(false);
		};
		!isReadOnly && fetchDropDownDatas();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, reduxDispatch, siteAppID, isReadOnly]);

	const handleEnterPress = (e, name) => {
		// 13 is the enter keycode
		if (!loading) {
			if (e.keyCode === 13) {
				handleOnBlur(e.target.value, name);
			}
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
					setLocalTaskInfo({
						...localTaskInfo,
						roles: localTaskInfo?.roles?.map((r) =>
							r.modelVersionRoleID === id ? { ...r, id: response.data } : r
						),
					});
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
					setLocalTaskInfo({
						...localTaskInfo,
						roles: localTaskInfo?.roles?.map((r) =>
							r.modelVersionRoleID === id ? { ...r, id: null } : r
						),
					});
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
				taskInfo[name] = value?.id || null;
				taskInfo[actualName] = value.name;
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
				taskInfo[name] = value;
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
								dataSource={dropDownDatas?.actions}
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
								disabled={loading || isUpdating.actionID}
								label={customCaptions?.actionRequired}
								isReadOnly={isReadOnly}
							/>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<DyanamicDropdown
								isServerSide={false}
								width="100%"
								placeholder="Select Roles"
								dataHeader={[{ id: 1, name: "Roles" }]}
								columns={[{ id: 1, name: "name" }]}
								dataSource={dropDownDatas?.roles}
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
								disabled={loading || isUpdating.role}
								isReadOnly={isReadOnly}
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<TextFieldContainer
								label="Name"
								name="name"
								value={localTaskInfo?.name}
								onChange={(e) => handleOnChange(e.target.value, "name")}
								onBlur={(e) => {
									handleOnBlur(e.target.value, "name");
								}}
								isFetching={isUpdating?.name}
								isDisabled={isUpdating?.name || isReadOnly}
								onKeyDown={(e) => handleEnterPress(e, "name")}
							/>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<DyanamicDropdown
								isServerSide={false}
								width="100%"
								placeholder="Select System"
								dataSource={dropDownDatas?.systems}
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
								disabled={loading || isUpdating.systemID}
								label={customCaptions?.system}
								isReadOnly={isReadOnly}
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<DyanamicDropdown
								isServerSide={false}
								width="100%"
								placeholder="Select Operating Mode"
								dataHeader={[{ id: 1, name: "Operating Mode" }]}
								columns={[{ id: 1, name: "name" }]}
								dataSource={dropDownDatas?.operatingModes}
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
								disabled={loading || isUpdating?.operatingModeID}
								isReadOnly={isReadOnly}
								label={customCaptions?.operatingMode}
								showClear
							/>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ADD.NameLabel>Estimated Minutes</ADD.NameLabel>
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
								disabled={isUpdating?.estimatedMinutes || isReadOnly}
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
										handleOnChange(e.target.checked, "safetyCritical");
										handleOnBlur(e.target.checked, "safetyCritical");
									}}
									name="safetyCritical"
									disabled={isReadOnly}
								/>
								{customCaptions?.safetyCritical}?
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
									disabled={isReadOnly}
								/>
								Cannot Be Skipped?
							</ADD.CheckboxLabel>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<TaskDetailNotes
							modelId={id}
							taskGroupId={taskInfo?.taskGroupID}
							taskId={taskInfo?.id}
							customCaptions={customCaptions}
							disabled={isReadOnly || isEditOnly}
						/>
					</ADD.InputContainer>
				</div>
			</DialogContent>
		</>
	);
};

export default withMount(TaskDetails);
