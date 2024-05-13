import React, { createContext, useReducer } from "react";

const initialState = {
	taskInfo: {},
	current: "Details",
	taskError: {},
	stageName: "",
	stageList: [],
	hasImages: false,
	hasTools: false,
	hasParts: false,
	hasDocuments: false,
	hasSafetyCritical: false,
	hasQuestions: false,
	hasPermits: false,
};

function reducer(state, action) {
	const { payload, type } = action;
	switch (type) {
		case "SET_TASK_DETAIL":
			return {
				...state,
				taskInfo: payload,
			};

		case "TAB_COUNT":
			return {
				...state,
				taskInfo: { ...state.taskInfo, [payload.countTab]: payload.data },
			};

		case "CURRENT":
			return {
				...state,
				current: payload,
			};

		case "SET_TASK_ERROR":
			return {
				...state,
				taskError: { ...state.taskError, [payload.name]: payload.value },
			};
		case "TOGGLE_CUSTOM_INTERVALS":
			return {
				...state,
				taskInfo: {
					...state.taskInfo,
					customIntervals: !state.taskInfo.customIntervals,
				},
			};
		case "SET_STAGE_NAME":
			return { ...state, stageName: payload };

		case "SET_STAGE_LIST":
			return { ...state, stageList: payload };

		case "SET_TOOLS":
			return {
				...state,
				hasTools: payload,
			};
		case "SET_IMAGES":
			return {
				...state,
				hasImages: payload,
			};
		case "SET_QUESTIONS":
			return {
				...state,
				hasQuestions: payload,
			};
		case "SET_PERMITS":
			return {
				...state,
				hasPermits: payload,
			};
		case "SET_SAFETY":
			return {
				...state,
				hasSafetyCritical: payload,
			};
		case "SET_DOCUMENTS":
			return {
				...state,
				hasDocuments: payload,
			};
		case "SET_PARTS":
			return {
				...state,
				hasParts: payload,
			};

		default:
			return state;
	}
}

export const TaskContext = createContext();

const TaskDetailContext = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<TaskContext.Provider value={[state, dispatch]}>
			{children}
		</TaskContext.Provider>
	);
};

export default TaskDetailContext;
