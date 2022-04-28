import React, { createContext, useReducer } from "react";

const initialState = {
	taskInfo: {},
	current: "Details",
	taskError: {},
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
		case "TOGGLE_CUSTOM_INTERVALS":
			return {
				...state,
				taskInfo: {
					...state.taskInfo,
					customIntervals: !state.taskInfo.customIntervals,
				},
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
