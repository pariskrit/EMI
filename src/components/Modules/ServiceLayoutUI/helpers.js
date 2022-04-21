import questionIcon from "assets/question.png";
import stageIcon from "assets/stage.png";
import zoneIcon from "assets/zone.png";
import taskIcon from "assets/task.png";

export const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

export const modifyResponseData = (
	data,
	hideTaskQuestions,
	taskId = null,
	questionId = null,
	taskQuestionId = null
) => {
	const changedData = {
		startQuestions: data.startQuestions,
		stages: data.stages,
		endQuestions: data.endQuestions,
	};
	let modifiedResponse = [];
	let id = 1;
	for (let property in changedData) {
		let sn = 0;
		const isStages = property === "stages";
		const field = {
			id: "" + id,
			parentId: 0,
			rowName: property,
			name: property,
			value: changedData[property].map((value) => {
				sn += 1;
				return {
					value: {
						...value,
						id: isStages
							? value.modelVersionStageID
							: value.modelVersionQuestionID,
						type: "startQuestion",
						sn,
						highlightQuestion: value.modelVersionQuestionID === questionId,
						icon: isStages ? stageIcon : questionIcon,
						isDraggable: !isStages,
					},
					children: isStages
						? getFields(
								getDataType(
									value,
									hideTaskQuestions,
									taskId,
									questionId,
									taskQuestionId
								)
						  )
						: [],
				};
			}),
		};
		modifiedResponse.push(field);
		id++;
	}

	return modifiedResponse;
};

export const getUpdatedServiceLayoutAfterDragAndDrop = (data, result) => {
	let tempMainData = { ...data };
	const parentId =
		result.draggableId.split("_")[4] !== "undefined" &&
		result.draggableId.split("_")[4] !== "null"
			? +result.draggableId.split("_")[4]
			: result.draggableId.split("_")[3] !== "null" &&
			  result.draggableId.split("_")[3] !== "undefined"
			? +result.draggableId.split("_")[3]
			: +result.draggableId.split("_")[2];
	const uniqueId = `${result.destination.droppableId.split("_")[1]}${parentId}`;

	tempMainData.value.forEach((stage) => {
		const stageId = `${stage.children.rowName}${stage.children.parentId}`;
		//if the children id and the draggable element's id is same then reorder the children array
		if (stageId === uniqueId) {
			stage.children.value = reorder(
				stage.children.value,
				result.source.index,
				result.destination.index
			);
		} else if (stage?.children?.value) {
			stage.children = getUpdatedServiceLayoutAfterDragAndDrop(
				stage.children,
				result
			);
		}
	});

	return tempMainData;
};

export const storePositions = (data) => {
	let tempMainData = [...data];
	let positions = [];
	tempMainData.forEach((stage) => {
		if (stage.name === "startQuestions" || stage.name === "endQuestions") {
			positions = [
				...positions,
				...stage.value.reduce(
					(accPos, current) => [...accPos, current.value.pos],
					[]
				),
			];
		} else if (stage.name === "stages") {
			positions = [
				...positions,
				...stage.value.reduce(
					(accPos, current) => [...accPos, current.value.pos],
					[]
				),
				...storePositions(stage.value),
			];
		} else {
			if (stage.children?.name) {
				positions = [
					...positions,
					...stage.children.value.reduce(
						(accPos, current) => [...accPos, current.value.pos],
						[]
					),
					...storePositions(stage.children.value),
				];
			}
		}
	});

	return positions;
};

export const getDataType = (
	data,
	hideTaskQuestions,
	taskId = null,
	questionId = null,
	taskQuestionId = null
) => {
	if (data.type === "questions") return null;

	const hasQuestions = data?.questions?.length > 0;
	const hasTasks = data?.tasks?.length > 0;
	const hasZones = data?.zones?.length > 0;
	let sn = 0;

	const icons = {
		questions: questionIcon,
		zones: zoneIcon,
		tasks: taskIcon,
	};

	if (hasQuestions && hasTasks && hasZones) {
		return {
			id: data.modelVersionStageID || data.id,
			marginLeft: data.marginLeft ?? 0,
			taskIdToHighlight: taskId,
			questionIdToHighlight: questionId,
			taskQuestionIdToHighlight: taskQuestionId,
			rowName: data?.name,
			arrayData: [
				...data.questions.map((question) => {
					sn += 1;
					return {
						...question,
						icon: icons["questions"],
						isDraggable: true,
						type: "question",
						sn,
						id: question.modelVersionQuestionID,
						highlightQuestion: question.modelVersionQuestionID === questionId,
						grandParentId: data.modelVersionStageID || data.id,
					};
				}),
				...data.tasks.map((task) => {
					sn += 1;
					return {
						...task,
						id: task.id,
						icon: icons["tasks"],
						type: "task",
						sn,
						isDraggable: true,
						hideTaskQuestions,
						highlightTask: task.modelVersionTaskID === taskId,

						grandParentId: data.modelVersionStageID || data.id,
					};
				}),
				...data.zones.map((zone) => {
					sn += 1;
					return {
						...zone,
						icon: icons["zones"],
						isDraggable: false,
						type: "zones",
						sn,
						id: zone.modelVersionZoneID,
						grandParentId: data.modelVersionStageID || data.id,
					};
				}),
			],
			type: "stageQuestionsTasksAndZones",
		};
	}
	if (hasQuestions && hasTasks) {
		return {
			id: data.id || data.modelVersionStageID,
			marginLeft: data.marginLeft ?? 0,
			taskQuestionIdToHighlight: taskQuestionId,
			rowName: data?.name,
			arrayData: [
				...data.questions.map((question) => {
					sn += 1;
					return {
						...question,
						sn: sn,
						icon: icons["questions"],
						isDraggable: true,
						type: "question",
						highlightQuestion: question.modelVersionQuestionID === questionId,
						grandParentId:
							data.modelVersionStageID || data.grandParentId || null,
						parentId: data.id ?? null,
						id: question.modelVersionQuestionID,
					};
				}),
				...data.tasks.map((task) => {
					sn += 1;

					return {
						...task,
						sn: sn,
						id: task.id,
						icon: icons["tasks"],
						type: "task",
						isDraggable: true,
						questionId,
						hideTaskQuestions,
						highlightTask: task.modelVersionTaskID === taskId,
						grandParentId:
							data.modelVersionStageID || data.grandParentId || null,
						parentId: data.id ?? null,
					};
				}),
			],
			type:
				data.type === "zone"
					? "zoneQuestionsAndTasks"
					: "stageQuestionsAndTasks",
		};
	}

	if (hasTasks && hasZones) {
		return {
			id: data.modelVersionStageID || data.id,
			hideTaskQuestions,
			rowName: data?.name,
			marginLeft: 0,
			taskIdToHighlight: taskId,
			questionIdToHighlight: questionId,
			taskQuestionIdToHighlight: taskQuestionId,
			arrayData: [
				...data.tasks.map((task) => {
					sn += 1;
					return {
						...task,
						id: task.id,
						icon: icons["tasks"],
						type: "task",
						isDraggable: true,
						sn,
						hideTaskQuestions,
						highlightTask: task.modelVersionTaskID === taskId,
						grandParentId:
							data.modelVersionStageID || data.grandParentId || null,
					};
				}),
				...data.zones.map((zone) => {
					sn += 1;
					return {
						...zone,
						icon: icons["zones"],
						isDraggable: false,
						type: "zones",
						sn,
						id: zone.modelVersionZoneID,
						grandParentId: data.modelVersionStageID || data.id,
					};
				}),
			],
			type: "stageTasksAndZones",
		};
	}

	if (hasQuestions && hasZones) {
		return {
			id: data.modelVersionStageID || data.id,
			hideTaskQuestions,
			rowName: data?.name,
			marginLeft: 0,
			taskIdToHighlight: taskId,
			questionIdToHighlight: questionId,
			taskQuestionIdToHighlight: taskQuestionId,
			arrayData: [
				...data.questions.map((question) => {
					sn += 1;
					return {
						...question,
						id: question.modelVersionQuestionID,
						icon: icons["questions"],
						type: "question",
						sn,
						isDraggable: true,
						highlightQuestion: question.modelVersionQuestionID === questionId,
					};
				}),
				...data.zones.map((zone) => {
					sn += 1;
					return {
						...zone,
						icon: icons["zones"],
						isDraggable: false,
						type: "zones",
						sn,
						id: zone.modelVersionZoneID,
						grandParentId: data.modelVersionStageID,
					};
				}),
			],
			type: "questionsAndZones",
		};
	}

	if (hasZones) {
		return {
			id: data.modelVersionStageID || data.id,
			hideTaskQuestions,
			rowName: data?.name,
			marginLeft: data.marginLeft ?? 0,
			taskIdToHighlight: taskId,
			questionIdToHighlight: questionId,
			taskQuestionIdToHighlight: taskQuestionId,
			arrayData: [
				...data.zones.map((zone) => {
					sn += 1;
					return {
						...zone,
						icon: icons["zones"],
						id: zone.modelVersionZoneID,
						type: "zone",
						isDraggable: false,
						sn,
						grandParentId: data.modelVersionStageID,
					};
				}),
			],
			type: "zones",
		};
	}

	if (hasTasks) {
		return {
			id: data.modelVersionStageID || data.id,
			marginLeft: data.marginLeft ?? 0,
			questionIdToHighlight: questionId,
			rowName: data?.name,
			taskQuestionIdToHighlight: taskQuestionId,

			arrayData: [
				...data.tasks.map((task) => {
					sn += 1;
					return {
						...task,
						id: task.id,
						icon: icons["tasks"],
						type: "task",
						sn,
						isDraggable: true,
						hideTaskQuestions,
						highlightTask: task.modelVersionTaskID === taskId,
						grandParentId:
							data.modelVersionStageID || data.grandParentId || null,
						parentId: data.id ?? null,
					};
				}),
			],
			type: data.type === "zone" ? "zoneTasks" : "tasks",
		};
	}

	if (hasQuestions) {
		return {
			id: data.modelVersionStageID || data.id,
			marginLeft: data.marginLeft ?? 0,
			rowName: data?.name,
			parentId: data?.parentId ?? null,
			arrayData: [
				...data.questions.map((question) => {
					sn += 1;
					return {
						...question,
						icon: icons["questions"],
						isDraggable: true,
						type: "question",
						sn,
						id:
							question.modelVersionQuestionID ||
							question.modelVersionTaskQuestionID,
						highlightQuestion:
							question.modelVersionQuestionID === questionId ||
							question.modelVersionTaskQuestionID === taskQuestionId,

						grandParentId:
							data.modelVersionStageID || data.grandParentId || null,
						parentId: data.parentId ?? data?.id ?? null,
						childId: data.parentId ? data?.id : null,
					};
				}),
			],
			type:
				data.grandParentId && data.parentId ? "zoneTaskQuestions" : "questions",
		};
	}

	return null;
};

export const getFields = (data) => {
	if (data === null) {
		return [];
	}

	return {
		parentId: data.id,
		rowName: data.rowName,
		childId: data.childId,
		name: data.type,
		marginLeft: 15 + data.marginLeft,
		value: data.arrayData.map((value) => ({
			value,
			children: getFields(
				getDataType(
					{ ...value, marginLeft: data.marginLeft ? 15 : 17 },
					data.hideTaskQuestions,
					data.taskIdToHighlight,
					data.questionIdToHighlight,
					data.taskQuestionIdToHighlight
				)
			),
		})),
	};
};

export const checkIfPosAreadyExists = (positions, calculatedPos, min, max) => {
	let avg = calculatedPos;
	if (positions.includes(avg)) {
		avg = (Math.random() * (max - min) + min).toFixed(3);
	}
	if (positions.includes(avg)) {
		checkIfPosAreadyExists(positions, avg);
	}
	return avg;
};
