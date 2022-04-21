import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import "./style.css";

import DynamicRow from "./DynamicRow";
import { CircularProgress, makeStyles } from "@material-ui/core";
import {
	getModelIntervals,
	getServiceLayoutData,
	getServiceLayoutDataByInterval,
	getServiceLayoutDataByRole,
	getServiceLayoutDataByRoleAndInterval,
	patchQuestions,
	patchTaskQuestions,
	patchTaskStages,
	patchTaskZones,
} from "services/models/modelDetails/modelservicelayout";
import DetailsPanel from "components/Elements/DetailsPanel";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import FilterListIcon from "@material-ui/icons/FilterList";
import {
	modifyResponseData,
	getUpdatedServiceLayoutAfterDragAndDrop,
	reorder,
	storePositions,
	checkIfPosAreadyExists,
} from "./helpers";
import { getModelRolesList } from "services/models/modelDetails/modelRoles";
import EMICheckbox from "components/Elements/EMICheckbox";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { useHistory } from "react-router-dom";
import withMount from "components/HOC/withMount";

const useStyles = makeStyles({
	dragDropContainer: {
		margin: "25px 0",
	},
	dropdown_container: {
		display: "flex",
		//justifyContent: "space-between",
		alignItems: "center",
		gap: "40px",
	},
});
function ServiceLayoutUI({ state, dispatch, access, modelId, isMounted }) {
	const [allServiceLayoutData, setAllServiceLayoutData] = useState([]);
	const [originalServiceLayoutData, setOriginalServiceLayoutData] = useState(
		[]
	);
	const [roles, setRoles] = useState([]);
	const [selectedRole, setSelectedRole] = useState({});
	const [intervals, setIntervals] = useState([]);
	const [selectedInterval, setSelectedInterval] = useState({});
	const [loading, setIsLoading] = useState({ dropdown: false, all: true });
	const [hideTaskQuestions, setHideTaskQuestions] = useState(false);
	const {
		customCaptions: {
			service,
			interval,
			role,
			task,
			taskPlural,
			stagePlural,
			zonePlural,
			servicePlural,
			questionPlural,
		},
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const [counts, setCounts] = useState({
		stageCount: 0,
		taskCount: 0,
		zoneCount: 0,
	});
	const reduxDispatch = useDispatch();
	const [positions, setPositions] = useState([]);
	const [isFirstRender, setIsFirstRender] = useState(true);
	const classes = useStyles();
	const history = useHistory();

	const taskIdToHighlight = history.location.state?.state?.ModelVersionTaskID;
	const questionIdToHighlight =
		history.location.state?.state?.ModelVersionQuestionID;
	const taskQuestionIdToHighlight =
		history.location.state?.modelVersionTaskQuestionID;
	const onDropdownChange = async (type, list) => {
		if (Object.values(list).length === 0) {
			return;
		}
		setIsLoading({ ...loading, dropdown: true });

		let response = null;
		const selectedRoleNotEmpty = Object.values(selectedRole).length !== 0;
		const selectedIntervalNotEmpty =
			Object.values(selectedInterval).length !== 0;
		setIsFirstRender(true);
		if (type === "role") {
			setSelectedRole(list);

			if (selectedIntervalNotEmpty) {
				response = await getServiceLayoutDataByRoleAndInterval(
					modelId,
					selectedInterval.id,
					list.id
				);
			} else {
				response = await getServiceLayoutDataByRole(modelId, list.id);
			}
		}

		if (type === "interval") {
			setSelectedInterval(list);

			if (selectedRoleNotEmpty) {
				response = await getServiceLayoutDataByRoleAndInterval(
					modelId,
					list.id,
					selectedRole.id
				);
			} else {
				response = await getServiceLayoutDataByInterval(modelId, list.id);
			}
		}

		if (response.status) {
			const modifiedResponse = modifyResponseData(
				response.data,
				hideTaskQuestions
			);
			setAllServiceLayoutData(modifiedResponse);
			setCounts({
				zoneCount: response.data.zoneCount,
				stageCount: response.data.stageCount,
				taskCount: response.data.taskCount,
			});
			setOriginalServiceLayoutData(response.data);
		} else {
			console.log("error");
		}

		setIsLoading({ ...loading, dropdown: false });
	};

	const handleClearDropdown = async (type) => {
		const isIntervalType = type === "interval";
		const isIntervalEmpty = Object.values(selectedInterval).length === 0;
		const isRoleEmpty = Object.values(selectedRole).length === 0;

		if (
			Object.values(selectedInterval).length === 0 &&
			Object.values(selectedRole).length === 0
		) {
			return;
		}

		if (
			(isIntervalType && isIntervalEmpty) ||
			(!isIntervalType && isRoleEmpty)
		) {
			return;
		}

		// setAllServiceLayoutData([]);
		setIsFirstRender(true);

		setIsLoading({ ...loading, dropdown: true });

		let response = null,
			modifiedResponse = null;
		if (type === "interval" && !isRoleEmpty) {
			setSelectedInterval({});
			response = await getServiceLayoutDataByRole(modelId, selectedRole.id);

			modifiedResponse = modifyResponseData(
				response.data,
				hideTaskQuestions,
				null,
				null,
				null
			);
			setCounts({
				zoneCount: response.data.zoneCount,
				stageCount: response.data.stageCount,
				taskCount: response.data.taskCount,
			});
			setOriginalServiceLayoutData(response.data);
			setAllServiceLayoutData(modifiedResponse);
			setPositions(storePositions(modifiedResponse));
		} else if (type === "role" && !isIntervalEmpty) {
			setSelectedRole({});
			response = await getServiceLayoutDataByInterval(
				modelId,
				selectedInterval.id
			);

			modifiedResponse = modifyResponseData(
				response.data,
				hideTaskQuestions,
				null,
				null,
				null
			);
			setCounts({
				zoneCount: response.data.zoneCount,
				stageCount: response.data.stageCount,
				taskCount: response.data.taskCount,
			});
			setAllServiceLayoutData(modifiedResponse);
			setPositions(storePositions(modifiedResponse));
			setOriginalServiceLayoutData(response.data);
		} else {
			if (isIntervalEmpty) {
				setSelectedRole({});
			} else {
				setSelectedInterval({});
			}

			await reFetchServicelayout();
		}

		setIsLoading({ ...loading, dropdown: false });
	};
	// handle dragging of zone
	const setPositionForPayload = (e, list, totalList) => {
		const { destination, source } = e;
		const indexOfFirstTask = totalList.findIndex(
			(task) => task.value.type === "task"
		);
		let tempList = destination.index < list.length - 1 ? list : totalList;

		let result =
			(tempList[destination.index]?.value.pos +
				tempList[destination.index - 1]?.value.pos) /
			2;
		if (
			destination.index === totalList.length - 1 ||
			destination.index === list.length - 1
		) {
			tempList = destination.index === list.length - 1 ? list : totalList;

			result = tempList[destination.index]?.value.pos + 1024;
			return checkIfPosAreadyExists(
				positions,
				result,
				tempList[destination.index]?.value.pos,
				result
			);
		}
		if (destination.index === 0 || destination.index === indexOfFirstTask) {
			tempList = destination.index === 0 ? list : totalList;

			result = tempList[destination.index]?.value.pos - 1024;
			return checkIfPosAreadyExists(
				positions,
				result,
				result,
				tempList[destination.index]?.value.pos
			);
		}

		if (destination.index > source.index) {
			tempList = destination.index < list.length - 1 ? list : totalList;

			result =
				(tempList[destination.index]?.value.pos +
					tempList[destination.index + 1]?.value.pos) /
				2;

			return checkIfPosAreadyExists(
				positions,
				result,
				totalList[destination.index]?.value.pos,
				totalList[destination.index + 1].value.pos
			);
		}
		return checkIfPosAreadyExists(
			positions,
			result,
			totalList[destination.index - 1].value.pos,
			totalList[destination.index]?.value.pos
		);
	};

	// common function for calling patch api after draganddrop finish
	const updateTree = async (result, list, totalList, apiCallFunction) => {
		let payload = [
			{
				path: "pos",
				op: "replace",
				value: setPositionForPayload(result, list, totalList),
			},
		];

		const response = await apiCallFunction(
			result.draggableId.split("_")[1],
			payload
		);

		if (response.status) {
			let response = null;
			const intervalIsEmpty = Object.values(selectedInterval).length === 0;
			const roleIsEmpty = Object.values(selectedRole).length === 0;

			if (intervalIsEmpty && !roleIsEmpty)
				response = await getServiceLayoutDataByRole(modelId, selectedRole.id);

			if (roleIsEmpty && !intervalIsEmpty)
				response = await getServiceLayoutDataByInterval(
					modelId,
					selectedInterval.id
				);

			if (!intervalIsEmpty && !roleIsEmpty)
				response = await getServiceLayoutDataByRoleAndInterval(
					modelId,
					selectedInterval.id,
					selectedRole.id
				);

			if (intervalIsEmpty && roleIsEmpty)
				response = await getServiceLayoutData(modelId);

			setOriginalServiceLayoutData(response.data);
			setAllServiceLayoutData(
				modifyResponseData(response.data, hideTaskQuestions, null, null, null)
			);
		} else {
			setAllServiceLayoutData(
				modifyResponseData(
					originalServiceLayoutData,
					hideTaskQuestions,
					null,
					null,
					null
				)
			);

			reduxDispatch(showError(response?.data?.detail || "Failed"));
		}
	};
	const onDragEnd = async (result) => {
		if (!result.destination) {
			return;
		}
		//drag and dropped in the same position
		if (result.destination.index === result.source.index) return;
		// dropped in another list
		if (result.source.droppableId !== result.destination.droppableId) {
			return;
		}
		const tempData = [...allServiceLayoutData];
		// Reorder start service questions
		if (result.source.droppableId === "droppable_startQuestions") {
			const updatedState = reorder(
				allServiceLayoutData[0].value,
				result.source.index,
				result.destination.index
			);

			const updatedAllData = tempData.map((data, index) =>
				index === 0 ? { ...data, value: updatedState } : data
			);

			setAllServiceLayoutData(updatedAllData);

			updateTree(result, tempData[0].value, tempData[0].value, patchQuestions);
		}

		// Reorder end service questions
		if (result.source.droppableId === "droppable_endQuestions") {
			const updatedState = reorder(
				tempData[2].value,
				result.source.index,
				result.destination.index
			);

			const updatedAllData = tempData.map((data, index) =>
				index === 2 ? { ...data, value: updatedState } : data
			);

			setAllServiceLayoutData(updatedAllData);

			updateTree(result, tempData[2].value, tempData[2].value, patchQuestions);
		}

		// reorder questions and tasks inside of a stage
		if (
			result.type === "stageQuestionsAndTasks" ||
			result.type === "stageQuestionsTasksAndZones"
		) {
			const stageId = result.draggableId.split("_")[2];
			const dragItemType = result.draggableId.split("_")[0];
			let selectedStage = tempData[1].value.find(
				(stage) => stage.value.id === +stageId
			);
			let filteredQuestions = selectedStage.children.value.filter(
				(data) => data.value.type === "question"
			);

			let filteredTasks = selectedStage.children.value.filter(
				(data) => data.value.type === "task"
			);
			let questionsAndTasks = [...filteredQuestions, ...filteredTasks];
			/// to allow drag and drop to questions list only or tasks list only.
			if (
				(dragItemType === "question" &&
					result.destination.index < filteredQuestions.length) ||
				(dragItemType === "task" &&
					result.destination.index > filteredQuestions.length - 1 &&
					result.destination.index < questionsAndTasks.length)
			) {
				const totalList = [...selectedStage.children.value];
				selectedStage.children.value = reorder(
					selectedStage.children.value,
					result.source.index,
					result.destination.index
				);

				updateTree(
					result,
					dragItemType === "question" ? filteredQuestions : filteredTasks,
					totalList,
					dragItemType === "question" ? patchQuestions : patchTaskStages
				);
				const updatedTempData = {
					...tempData[1],
					value: { ...tempData[1] }.value.map((stage) =>
						stage.value.id === stageId ? selectedStage : stage
					),
				};
				setAllServiceLayoutData([tempData[0], updatedTempData, tempData[2]]);
			}
		}
		// Reorder tasks and zones of a stage
		if (result.type === "stageTasksAndZones") {
			const stageId = result.draggableId.split("_")[2];
			let selectedStage = tempData[1].value.find(
				(stage) => stage.value.id === +stageId
			);

			let filteredTasks = selectedStage.children.value.filter(
				(data) => data.value.type === "task"
			);

			/// to allow drag and drop task item to tasks list only.
			if (result.destination.index < filteredTasks.length) {
				const totalList = [...selectedStage.children.value];

				selectedStage.children.value = reorder(
					selectedStage.children.value,
					result.source.index,
					result.destination.index
				);

				updateTree(result, filteredTasks, totalList, patchTaskStages);
				const updatedTempData = {
					...tempData[1],
					value: { ...tempData[1] }.value.map((stage) =>
						stage.value.id === stageId ? selectedStage : stage
					),
				};
				setAllServiceLayoutData([tempData[0], updatedTempData, tempData[2]]);
			}
		}
		// Reorder questions and tasks of a zone
		if (result.type === "zoneQuestionsAndTasks") {
			const stageId = result.draggableId.split("_")[2];
			const dragItemType = result.draggableId.split("_")[0];
			const zoneId = result.draggableId.split("_")[3];
			const selectedStage = tempData[1].value.find(
				(stage) => stage.value.id === +stageId
			);

			const selectedZone = selectedStage.children.value.find(
				(data) => data.value.id === +zoneId
			);
			const filteredQuestions = selectedZone.children.value.filter(
				(data) => data.value.type === "question"
			);

			let filteredTasks = selectedStage.children.value.filter(
				(data) => data.value.type === "task"
			);

			// to allow drag and drop to questions list only or tasks list only.

			if (
				(dragItemType === "question" &&
					result.destination.index < filteredQuestions.length) ||
				(dragItemType === "task" &&
					result.destination.index > filteredQuestions.length - 1)
			) {
				const totalList = [...selectedZone.children.value];

				selectedZone.children.value = reorder(
					selectedZone.children.value,
					result.source.index,
					result.destination.index
				);

				const updatedZoneData = {
					...selectedStage,
					children: {
						...selectedStage.children,
						value: selectedStage.children.value.map((zone) =>
							zone.value.id === +zoneId ? selectedZone : zone
						),
					},
				};
				updateTree(
					result,
					dragItemType === "question" ? filteredQuestions : filteredTasks,
					totalList,
					dragItemType === "question" ? patchQuestions : patchTaskZones
				);
				const updatedTempData = {
					...tempData[1],
					value: { ...tempData[1] }.value.map((stage) =>
						stage.value.id === stageId ? updatedZoneData : stage
					),
				};
				setAllServiceLayoutData([tempData[0], updatedTempData, tempData[2]]);
			}
		}
		//if the list contains only tasks or questions
		if (result.type === "tasks" || result.type === "questions") {
			const apiFunctions = {
				tasks: patchTaskStages,
				questions: patchTaskQuestions,
			};
			const temp = [...allServiceLayoutData];

			const parentId = +result.draggableId.split("_")[3];
			const parent_parentId = +result.draggableId.split("_")[2];

			let selectedStage = temp[1].value.find(
				(stage) => stage.value.id === parent_parentId
			);
			let selectedZoneOrTask = null;
			if (parentId) {
				selectedStage = temp[1].value.find(
					(stage) => stage.value.id === parent_parentId
				);
				selectedZoneOrTask = selectedStage.children.value.find(
					(data) => data.value.id === parentId
				);
			}
			updateTree(
				result,
				parentId
					? selectedZoneOrTask.children.value
					: selectedStage.children.value,
				parentId
					? selectedZoneOrTask.children.value
					: selectedStage.children.value,
				apiFunctions[result.type]
			);
			const updatedServiceData = getUpdatedServiceLayoutAfterDragAndDrop(
				{ ...tempData[1] },
				result
			);
			setAllServiceLayoutData([tempData[0], updatedServiceData, tempData[2]]);
		}

		if (result.type === "zoneTasks" || result.type === "zoneTaskQuestions") {
			const parentId = +result.draggableId.split("_")[4];
			const parent_parentId = +result.draggableId.split("_")[3];
			const parent_parent_parentId = +result.draggableId.split("_")[2];
			let selectedStage = { ...tempData[1] }.value.find(
				(stage) => stage.value.id === parent_parent_parentId
			);
			let selectedZone = selectedStage.children.value.find(
				(data) => data.value.id === parent_parentId
			);

			let selectedTask = null;

			if (parentId) {
				selectedTask = selectedZone.children.value.find(
					(data) => data.value.id === parentId
				);
			}

			updateTree(
				result,
				!parentId ? selectedZone.children.value : selectedTask.children.value,
				!parentId ? selectedZone.children.value : selectedTask.children.value,

				!parentId ? patchTaskZones : patchTaskQuestions
			);

			const updatedServiceData = getUpdatedServiceLayoutAfterDragAndDrop(
				{ ...tempData[1] },
				result
			);

			setAllServiceLayoutData([tempData[0], updatedServiceData, tempData[2]]);
		}
	};

	const onCheckboxInputChange = () => {
		setHideTaskQuestions((prev) => !prev);

		if (!hideTaskQuestions) {
			setAllServiceLayoutData((prev) =>
				modifyResponseData(
					originalServiceLayoutData,
					true,
					taskIdToHighlight,
					questionIdToHighlight,
					taskQuestionIdToHighlight
				)
			);
		} else {
			setAllServiceLayoutData(
				modifyResponseData(
					originalServiceLayoutData,
					false,
					taskIdToHighlight,
					questionIdToHighlight,
					taskQuestionIdToHighlight
				)
			);
		}
	};
	const fetchServiceLayoutData = useCallback(async () => {
		const [response, response2, response3] = await Promise.all([
			getServiceLayoutData(modelId),
			getModelRolesList(modelId),
			getModelIntervals(modelId),
		]);

		if (response.status && response2.status && response3.status) {
			if (!isMounted.aborted) {
				const modifiedResponse = modifyResponseData(
					response.data,
					false,
					taskIdToHighlight,
					questionIdToHighlight,
					taskQuestionIdToHighlight
				);
				setRoles(response2.data);
				setIntervals(response3.data);
				setAllServiceLayoutData(modifiedResponse);
				setOriginalServiceLayoutData(response.data);
				setCounts({
					zoneCount: response.data.zoneCount,
					stageCount: response.data.stageCount,
					taskCount: response.data.taskCount,
				});
				setPositions(storePositions(modifiedResponse));
			}
		} else {
			reduxDispatch(showError("Could not fetch Service Layout Data"));
		}

		if (!isMounted.aborted)
			setIsLoading((loading) => ({ dropdown: false, all: false }));
	}, [
		modelId,
		reduxDispatch,
		taskIdToHighlight,
		taskQuestionIdToHighlight,
		questionIdToHighlight,
		isMounted,
	]);

	const reFetchServicelayout = async () => {
		const response = await getServiceLayoutData(modelId);

		if (response.status) {
			const modifiedResponse = modifyResponseData(
				response.data,
				false,
				taskIdToHighlight,
				questionIdToHighlight,
				taskQuestionIdToHighlight
			);
			setAllServiceLayoutData(modifiedResponse);
			setOriginalServiceLayoutData(response.data);
			setCounts({
				zoneCount: response.data.zoneCount,
				stageCount: response.data.stageCount,
				taskCount: response.data.taskCount,
			});
			setPositions(storePositions(modifiedResponse));
		} else {
			reduxDispatch(showError("Could not fetch Service Layout Data"));
		}
	};

	useEffect(() => {
		if (allServiceLayoutData.length === 0) fetchServiceLayoutData();

		let timer = null;
		const hasIdToHighlight =
			taskIdToHighlight || questionIdToHighlight || taskQuestionIdToHighlight;
		if (allServiceLayoutData.length > 0 && hasIdToHighlight) {
			timer = setTimeout(() => {
				const element = document.getElementById("highlightedTask");
				if (element)
					element.scrollIntoView({ behavior: "smooth", block: "center" });
			}, 50);
		}

		if (allServiceLayoutData.length > 0 && isFirstRender) {
			timer = setTimeout(() => {
				setIsFirstRender(false);
			}, 1);
		}

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		fetchServiceLayoutData,
		allServiceLayoutData,
		taskIdToHighlight,
		questionIdToHighlight,
		taskQuestionIdToHighlight,
	]);

	if (loading.all) {
		return <CircularProgress />;
	}

	const isReadOnly = access === "R" || state?.modelDetail?.isPublished;
	return (
		<>
			<div className="detailsContainer">
				<DetailsPanel
					header={`${service} Layout`}
					countStyle={{ fontWeight: "normal", fontSize: "15px" }}
					dataCount={`${counts.stageCount} Stages / ${counts.zoneCount} Zones  / ${counts.taskCount} Tasks`}
					description={`Manage the order that ${taskPlural} appear within the specified ${stagePlural} and ${zonePlural} for ${servicePlural}`}
				/>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						width: "50%",
						justifyContent: "end",
					}}
				>
					<EMICheckbox
						state={hideTaskQuestions}
						changeHandler={onCheckboxInputChange}
					/>
					<p>
						Hide {task} {questionPlural}
					</p>
				</div>
			</div>
			<div className={classes.dropdown_container}>
				<DyanamicDropdown
					dataSource={intervals}
					columns={[{ name: "name", id: 1, minWidth: "130px" }]}
					columnsMinWidths={[140, 140, 140, 140, 140]}
					showHeader={false}
					width="50%"
					placeholder={`Select ${interval}`}
					onChange={(list) => onDropdownChange("interval", list)}
					selectdValueToshow="name"
					selectedValue={selectedInterval}
					label={`Filter by ${interval}`}
					isServerSide={false}
					showClear={true}
					icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
					required={false}
					onClear={() => handleClearDropdown("interval")}
					showBorderColor
				/>
				<DyanamicDropdown
					dataSource={roles}
					columns={[{ name: "name", id: 1, minWidth: "130px" }]}
					columnsMinWidths={[140, 140, 140, 140, 140]}
					showHeader={false}
					placeholder={`Select ${role}`}
					width="50%"
					onChange={(list) => onDropdownChange("role", list)}
					selectdValueToshow="name"
					selectedValue={selectedRole}
					label={`Filter by ${role}`}
					isServerSide={false}
					showClear={true}
					icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
					required={false}
					onClear={() => handleClearDropdown("role")}
					showBorderColor
				/>
			</div>
			<div className={classes.dragDropContainer}>
				{loading.dropdown ? (
					<CircularProgress />
				) : (
					<DragDropContext onDragEnd={onDragEnd}>
						{allServiceLayoutData.map((data) => (
							<DynamicRow
								rowData={data}
								key={data.id}
								isDragDisabled={isReadOnly}
								firstRender={isFirstRender}
							/>
						))}
					</DragDropContext>
				)}
			</div>
		</>
	);
}

export default withMount(ServiceLayoutUI);
