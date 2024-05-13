import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import "./style.css";
import { makeStyles } from "tss-react/mui";
import DynamicRow from "./DynamicRow";
import { CircularProgress } from "@mui/material";
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
import FilterListIcon from "@mui/icons-material/FilterList";
import {
	modifyResponseData,
	getUpdatedServiceLayoutAfterDragAndDrop,
	reorder,
	storePositions,
	checkIfPosAreadyExists,
} from "./helpers";
import {
	getModelRolesList,
	getModelRolesListByInterval,
} from "services/models/modelDetails/modelRoles";
import EMICheckbox from "components/Elements/EMICheckbox";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { useLocation } from "react-router-dom";
import withMount from "components/HOC/withMount";
import AutoFitContentInScreen from "components/Layouts/AutoFitContentInScreen";
import TabTitle from "components/Elements/TabTitle";
import { coalesc } from "helpers/utils";
import { getModelVersionArrangements } from "services/models/modelDetails/modelIntervals";
import {
	QUESTION,
	QUESTIONPLURAL,
	TASK,
	TASKPLURAL,
} from "constants/modelDetails";

const useStyles = makeStyles()((theme) => ({
	dragDropContainer: {
		margin: "25px 0",
	},
	dropdown_container: {
		display: "flex",
		//justifyContent: "space-between",
		alignItems: "center",
		gap: "40px",
	},
}));
function ServiceLayoutUI({ state, dispatch, access, modelId, isMounted }) {
	const [allServiceLayoutData, setAllServiceLayoutData] = useState([]);
	const [originalServiceLayoutData, setOriginalServiceLayoutData] = useState(
		[]
	);
	const [roles, setRoles] = useState([]);
	const [selectedRole, setSelectedRole] = useState({});
	const [selectedArrangement, setSelectedArrangement] = useState({});
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
			arrangement,
		},
		application,
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
	const { classes } = useStyles();
	const location = useLocation();

	const serviceLayoutData =
		JSON.parse(localStorage.getItem("serviceLayoutData")) ?? {};

	const taskIdToHighlight = location.state?.ModelVersionTaskID;
	const questionIdToHighlight = location.state?.ModelVersionQuestionID;
	const taskQuestionIdToHighlight = location.state?.modelVersionTaskQuestionID;

	const onDropdownChange = async (type, list) => {
		if (Object.values(list).length === 0) {
			return;
		}

		setIsLoading({ ...loading, dropdown: true });

		let response = null;
		const selectedRoleNotEmpty = Object.values(selectedRole).length !== 0;
		const selectedIntervalNotEmpty =
			Object.values(selectedInterval).length !== 0;
		const selectedArrangementNotEmpty =
			Object.values(selectedArrangement).length !== 0;
		const serviceLayoutDataBackup = { ...serviceLayoutData };
		setIsFirstRender(true);
		if (type === "role") {
			setSelectedRole(list);

			if (selectedIntervalNotEmpty || selectedArrangementNotEmpty) {
				response = await getServiceLayoutDataByRoleAndInterval(
					modelId,
					selectedInterval?.id ?? "",
					list.id,
					selectedArrangement?.id ?? ""
				);
			} else {
				response = await getServiceLayoutDataByRole(modelId, list.id);
			}
		}
		if (type === "arrangement") {
			setSelectedArrangement(list);
			response = await getServiceLayoutDataByRoleAndInterval(
				modelId,
				selectedInterval?.id ?? "",
				selectedRole?.id ?? "",
				list.id
			);
		}

		if (type === "interval") {
			setSelectedInterval(list);
			let reqData = null;
			let res = await getModelRolesListByInterval(list.id);
			if (res.status) {
				reqData = res.data;
			}

			if (
				reqData.length > 0 &&
				(selectedRoleNotEmpty || selectedArrangementNotEmpty)
			) {
				response = await getServiceLayoutDataByRoleAndInterval(
					modelId,
					list.id,
					selectedRole?.id ?? "",
					selectedArrangement?.id ?? ""
				);
			} else {
				response = await getServiceLayoutDataByInterval(modelId, list.id);
			}
		}
		localStorage.setItem(
			"serviceLayoutData",
			JSON.stringify({
				...serviceLayoutData,
				[type]: list,
			})
		);

		if (response.status) {
			initialDataSetup(response);
		} else {
			localStorage.setItem(
				"serviceLayoutData",
				JSON.stringify(serviceLayoutDataBackup)
			);
		}

		setIsLoading({ all: false, dropdown: false });
	};

	const initialDataSetup = (response, hideTask = false) => {
		const modifiedResponse = modifyResponseData(
			response.data,
			hideTask,
			taskIdToHighlight,
			questionIdToHighlight,
			taskQuestionIdToHighlight
		);
		setAllServiceLayoutData(modifiedResponse);
		setCounts({
			zoneCount: response.data.zoneCount,
			stageCount: response.data.stageCount,
			taskCount: response.data.taskCount,
		});
		setOriginalServiceLayoutData(response.data);
	};

	const handleClearDropdown = async (type) => {
		const isIntervalType = type === "interval";
		const isIntervalEmpty = Object.values(selectedInterval).length === 0;
		const isRoleEmpty = Object.values(selectedRole).length === 0;
		const isArrangementEmpty = Object.values(selectedArrangement).length === 0;

		// if (isIntervalEmpty && isRoleEmpty && isArrangementEmpty) {
		// 	return;
		// }

		if (
			(isIntervalType && isIntervalEmpty) ||
			(type === "role" && isRoleEmpty) ||
			(type === "arrangement" && isArrangementEmpty)
		) {
			return;
		}

		// setAllServiceLayoutData([]);
		setIsFirstRender(true);

		setIsLoading({ ...loading, dropdown: true });
		let response = null,
			modifiedResponse = null;
		// if (type === "interval" && !isRoleEmpty) {
		if (type === "interval" && (!isRoleEmpty || !isArrangementEmpty)) {
			setSelectedInterval({});
			response = await getServiceLayoutDataByRoleAndInterval(
				modelId,
				"",
				selectedRole?.id ?? "",
				selectedArrangement?.id ?? ""
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
			setOriginalServiceLayoutData(response.data);
			setAllServiceLayoutData(modifiedResponse);
			setPositions(storePositions(modifiedResponse));
			localStorage.setItem(
				"serviceLayoutData",
				JSON.stringify({ ...serviceLayoutData, interval: null })
			);
		} else if (type === "role" && (!isIntervalEmpty || !isArrangementEmpty)) {
			setSelectedRole({});
			response = await getServiceLayoutDataByRoleAndInterval(
				modelId,
				selectedInterval?.id ?? "",
				"",
				selectedArrangement?.id ?? ""
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
			localStorage.setItem(
				"serviceLayoutData",
				JSON.stringify({ ...serviceLayoutData, role: null })
			);
		} else if (type === "arrangement") {
			setSelectedArrangement({});
			response = await getServiceLayoutDataByRoleAndInterval(
				modelId,
				selectedInterval?.id ?? "",
				selectedRole?.id ?? "",
				""
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
			localStorage.setItem(
				"serviceLayoutData",
				JSON.stringify({ ...serviceLayoutData, arrangement: null })
			);
		} else {
			if (isIntervalEmpty) {
				setSelectedRole({});
			} else {
				setSelectedInterval({});
			}
			localStorage.setItem(
				"serviceLayoutData",
				JSON.stringify({ ...serviceLayoutData, interval: null, role: null })
			);

			await reFetchServicelayout();
		}

		setIsLoading({ ...loading, dropdown: false });
	};
	// handle dragging of zone
	const setPositionForPayload = (e, list, totalList) => {
		const { destination, source } = e;
		const indexOfFirstTask = totalList.findIndex(
			(task) => task.value.type === TASK
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
			const arrangementIsEmpty =
				Object.values(selectedArrangement).length === 0;

			if (intervalIsEmpty && roleIsEmpty && arrangementIsEmpty)
				response = await getServiceLayoutData(modelId);
			else {
				response = await getServiceLayoutDataByRoleAndInterval(
					modelId,
					selectedInterval?.id ?? "",
					selectedRole?.id ?? "",
					selectedArrangement?.id ?? ""
				);
			}

			// if (intervalIsEmpty && !roleIsEmpty)
			// 	response = await getServiceLayoutDataByRole(modelId, selectedRole.id);

			// if (roleIsEmpty && !intervalIsEmpty)
			// 	response = await getServiceLayoutDataByInterval(
			// 		modelId,
			// 		selectedInterval.id
			// 	);

			// if (!intervalIsEmpty && !roleIsEmpty)
			// 	response = await getServiceLayoutDataByRoleAndInterval(
			// 		modelId,
			// 		selectedInterval.id,
			// 		selectedRole.id,

			// 	);

			// else{
			// 	response = await
			// }

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
				(data) => data.value.type === QUESTION
			);

			let filteredTasks = selectedStage.children.value.filter(
				(data) => data.value.type === TASK
			);
			let questionsAndTasks = [...filteredQuestions, ...filteredTasks];
			/// to allow drag and drop to questions list only or tasks list only.
			if (
				(dragItemType === QUESTION &&
					result.destination.index < filteredQuestions.length) ||
				(dragItemType === TASK &&
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
					dragItemType === QUESTION ? filteredQuestions : filteredTasks,
					totalList,
					dragItemType === QUESTION ? patchQuestions : patchTaskStages
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
				(data) => data.value.type === TASK
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
				(data) => data.value.type === QUESTION
			);

			let filteredTasks = selectedStage.children.value.filter(
				(data) => data.value.type === TASK
			);

			// to allow drag and drop to questions list only or tasks list only.

			if (
				(dragItemType === QUESTION &&
					result.destination.index < filteredQuestions.length) ||
				(dragItemType === TASK &&
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
					dragItemType === QUESTION ? filteredQuestions : filteredTasks,
					totalList,
					dragItemType === QUESTION ? patchQuestions : patchTaskZones
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
		if (result.type === TASKPLURAL || result.type === QUESTIONPLURAL) {
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
		localStorage.setItem(
			"serviceLayoutData",
			JSON.stringify({ ...serviceLayoutData, hideTask: !hideTaskQuestions })
		);
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
		let isIntervalId = null;
		if (selectedInterval.id) {
			isIntervalId = getModelRolesListByInterval(selectedInterval.id);
		} else {
			isIntervalId = getModelRolesList(modelId);
		}
		const [response, response2, response3] = await Promise.all([
			getServiceLayoutData(modelId),
			// getModelRolesList(modelId),
			isIntervalId,
			getModelIntervals(modelId),
		]);

		if (response.status && response2.status && response3.status) {
			if (!isMounted.aborted) {
				const modifiedResponse = modifyResponseData(
					response.data,
					serviceLayoutData["hideTask"] ? serviceLayoutData["hideTask"] : false,
					taskIdToHighlight,
					questionIdToHighlight,
					taskQuestionIdToHighlight
				);
				setAllServiceLayoutData(modifiedResponse);
				setRoles(response2.data);
				setIntervals(response3.data);
				setOriginalServiceLayoutData(response.data);
				setCounts({
					zoneCount: response.data.zoneCount,
					stageCount: response.data.stageCount,
					taskCount: response.data.taskCount,
				});
				setPositions(storePositions(modifiedResponse));
				if (serviceLayoutData["hideTask"])
					setHideTaskQuestions(serviceLayoutData["hideTask"]);
			}
		} else {
			reduxDispatch(showError("Could not fetch Service Layout Data"));
		}

		if (!isMounted.aborted)
			setIsLoading((loading) => ({ dropdown: false, all: false }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		modelId,
		reduxDispatch,
		taskIdToHighlight,
		taskQuestionIdToHighlight,
		questionIdToHighlight,
		isMounted?.aborted,
		selectedInterval.id,
	]);

	const reFetchServicelayout = async () => {
		const response = await getServiceLayoutData(modelId);

		if (response.status) {
			const modifiedResponse = modifyResponseData(
				response.data,
				serviceLayoutData["hideTask"] ? serviceLayoutData["hideTask"] : false,

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

	const fetchServiceLayoutUsingLocalStorage = useCallback(async () => {
		let isIntervalId = null;
		if (selectedInterval.id) {
			isIntervalId = getModelRolesListByInterval(selectedInterval.id);
		} else {
			isIntervalId = getModelRolesList(modelId);
		}
		const [response, response2] = await Promise.all([
			isIntervalId,
			getModelIntervals(modelId),
		]);

		setRoles(response.data);
		setIntervals(response2.data);
		if (
			serviceLayoutData["role"] ||
			serviceLayoutData["interval"] ||
			serviceLayoutData["arrangement"]
		) {
			const response = await getServiceLayoutDataByRoleAndInterval(
				modelId,
				serviceLayoutData["interval"]?.id ?? "",
				serviceLayoutData["role"]?.id ?? "",
				serviceLayoutData?.["arrangement"]?.id ?? ""
			);
			serviceLayoutData["role"] && setSelectedRole(serviceLayoutData["role"]);
			serviceLayoutData["interval"] &&
				setSelectedInterval(serviceLayoutData["interval"]);
			serviceLayoutData["arrangement"] &&
				setSelectedArrangement(serviceLayoutData["arrangement"]);
			initialDataSetup(response, serviceLayoutData["hideTask"]);
		}

		if (serviceLayoutData["hideTask"])
			setHideTaskQuestions(serviceLayoutData["hideTask"]);

		// if (serviceLayoutData["role"] && !serviceLayoutData["interval"]) {
		// 	onDropdownChange("role", serviceLayoutData?.role);
		// }

		// if (serviceLayoutData["interval"] && !serviceLayoutData["role"]) {
		// 	onDropdownChange("interval", serviceLayoutData?.interval);
		// }

		setIsLoading((loading) => ({ dropdown: false, all: false }));
	}, []);

	useEffect(() => {
		if (
			allServiceLayoutData.length === 0 &&
			!serviceLayoutData?.role &&
			!serviceLayoutData?.interval &&
			!serviceLayoutData?.arrangement
		) {
			fetchServiceLayoutData();
		}
	}, [
		fetchServiceLayoutData,
		allServiceLayoutData,
		serviceLayoutData.role,
		serviceLayoutData.interval,
		serviceLayoutData.arrangement,
	]);

	useEffect(() => {
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
			}, 500);
		}

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		allServiceLayoutData,
		taskIdToHighlight,
		questionIdToHighlight,
		taskQuestionIdToHighlight,
	]);

	useEffect(() => {
		if (
			serviceLayoutData["role"] ||
			serviceLayoutData["interval"] ||
			serviceLayoutData["arrangement"]
		)
			fetchServiceLayoutUsingLocalStorage();

		localStorage.setItem(
			"serviceLayoutData",
			JSON.stringify({ ...serviceLayoutData, modelId: modelId })
		);
	}, []);

	useEffect(() => {
		async function apiCall() {
			if (selectedInterval?.id) {
				let response = await getModelRolesListByInterval(selectedInterval?.id);
				if (response.status) {
					setRoles(response.data);
					let isInterval = response.data.some(
						(data) => data.id === selectedRole.id
					);
					if (!isInterval) {
						setSelectedRole({});
					}
				}
			} else if (selectedRole?.id) {
				let response = await getModelRolesList(modelId);
				if (response.status) {
					setRoles(response.data);
				}
			} else {
				return;
			}
		}
		apiCall();
	}, [selectedInterval, modelId]);

	useEffect(() => {
		dispatch({
			type: "SET_SERVICE_LAYOUT_DETAILS",
			payload: {
				modelVersionId: modelId,
				modelVersionRoleId: selectedRole?.id,
				modelVersionIntervalId: selectedInterval?.id,
				modelVersionArrangementId: selectedArrangement?.id,
			},
		});
	}, [selectedRole, selectedArrangement, selectedInterval, modelId]);

	if (loading.all) {
		return <CircularProgress />;
	}

	const isReadOnly = access === "R" || state?.modelDetail?.isPublished;
	return (
		<>
			<TabTitle
				title={`${state?.modelDetail?.name} ${coalesc(
					state?.modelDetail?.modelName
				)} ${service} Layout | ${application.name}`}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={`${service} Layout`}
					countStyle={{ fontWeight: "normal", fontSize: "15px" }}
					dataCount={`${counts.stageCount} ${stagePlural} / ${counts.zoneCount} ${zonePlural}  / ${counts.taskCount} ${taskPlural}`}
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
				{/* checking if modelType is "F" i.e. facility based model */}
				{(application?.showArrangements ||
					state?.modelDetail?.arrangementCount) &&
					state?.modelDetail?.modelType !== "F" && (
						<DyanamicDropdown
							columns={[{ name: "name", id: 1, minWidth: "130px" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							showHeader={false}
							placeholder={`Select ${arrangement}`}
							width="50%"
							onChange={(list) => onDropdownChange("arrangement", list)}
							selectdValueToshow="name"
							selectedValue={selectedArrangement || "hello"}
							label={`Filter by ${arrangement}`}
							isServerSide={false}
							showClear={true}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							onClear={() => handleClearDropdown("arrangement")}
							showBorderColor
							fetchData={() => getModelVersionArrangements(modelId)}
						/>
					)}
			</div>
			<div className={classes.dragDropContainer}>
				<AutoFitContentInScreen>
					<div style={{ marginRight: "10px" }}>
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
										taskIdToHighlight={taskIdToHighlight}
										taskQuestionIdToHighlight={taskQuestionIdToHighlight}
									/>
								))}
							</DragDropContext>
						)}
					</div>
				</AutoFitContentInScreen>
			</div>
		</>
	);
}

export default withMount(ServiceLayoutUI);
