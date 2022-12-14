import React, { createContext, useReducer } from "react";

const initialState = {
	serviceDetail: {
		id: "",
	},
	// showAdd: false,
	// showSave: false,
	// showSaveChanges: false,
	// showPasteTask: false,
	showChangeStatus: false,
	// showVersion: false,
	// isPasteTaskDisabled: true,
	// isQuestionTaskDisabled: true,
};

function reducer(state, action) {
	const { payload, type } = action;
	switch (type) {
		case "SET_SERVICE_DETAIL":
			return {
				...state,
				serviceDetail: payload,
			};
		case "SET_SERVICE_STATUS":
			return {
				...state,
				serviceDetail: { ...state.serviceDetail, status: payload },
			};

		case "UPDATE_FIELD":
			return {
				...state,
				serviceDetail: {
					...state.serviceDetail,
					[payload.name]: payload.value,
				},
			};

		// case "SET_ISPUBLISHED":
		// 	return {
		// 		...state,
		// 		modelDetail: {
		// 			...state.modelDetail,
		// 			isPublished: payload.isPublished,
		// 			modelStatusName: payload.modelStatusName,
		// 		},
		// 	};
		// case "TOGGLE_ADD":
		// 	return {
		// 		...state,
		// 		showAdd: payload,
		// 	};
		// case "TOGGLE_SAVE":
		// 	return {
		// 		...state,
		// 		showSave: payload,
		// 	};
		// case "TOGGLE_SAVE_CHANGES":
		// 	return {
		// 		...state,
		// 		showSaveChanges: payload,
		// 	};
		// case "TOGGLE_PASTE_TASK":
		// 	return {
		// 		...state,
		// 		showPasteTask: payload,
		// 	};
		case "TOGGLE_CHANGE_STATUS":
			return {
				...state,
				showChangeStatus: payload,
			};

		// case "TOOGLE_VERSION":
		// 	return {
		// 		...state,
		// 		showVersion: payload,
		// 	};
		// case "DISABLE_PASTE_TASK":
		// 	return { ...state, isPasteTaskDisabled: payload };

		// case "DISABLE_QUESTION_TASK":
		// 	return { ...state, isQuestionTaskDisabled: payload };

		// case "TAB_COUNT":
		// 	return {
		// 		...state,
		// 		modelDetail: { ...state.modelDetail, [payload.countTab]: payload.data },
		// 	};
		// case "TASK_DETAIL":
		// 	return {
		// 		...state,
		// 		taskDetail: payload,
		// 	};

		// case "TASK_DETAIL_UPDATE":
		// 	return {
		// 		...state,
		// 		taskDetail: { ...state.taskDetail, [payload.countTab]: payload.data },
		// 	};

		default:
			return state;
	}
}

export const ServiceContext = createContext();

const ServiceDetailContext = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<ServiceContext.Provider value={[state, dispatch]}>
			{children}
		</ServiceContext.Provider>
	);
};

export default ServiceDetailContext;
