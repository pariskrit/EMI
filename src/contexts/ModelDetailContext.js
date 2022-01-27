import React, { createContext, useReducer } from "react";

const initialState = {
	modelDetail: {},
	showAdd: false,
	showSave: false,
	showSaveChanges: false,
	showPasteTask: false,
	showChangeStatus: false,
};

function reducer(state, action) {
	const { payload, type } = action;
	switch (type) {
		case "SET_MODEL_DETAIL":
			return {
				...state,
				modelDetail: payload,
			};
		case "TOGGLE_ADD":
			return {
				...state,
				showAdd: payload,
			};
		case "TOGGLE_SAVE":
			return {
				...state,
				showSave: payload,
			};
		case "TOGGLE_SAVE_CHANGES":
			return {
				...state,
				showSaveChanges: payload,
			};
		case "TOGGLE_PASTE_TASK":
			return {
				...state,
				showPasteTask: payload,
			};
		case "TOGGLE_CHANGE_STATUS":
			return {
				...state,
				showChangeStatus: payload,
			};

		default:
			return state;
	}
}

export const ModelContext = createContext();

const ModelDetailContext = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<ModelContext.Provider value={[state, dispatch]}>
			{children}
		</ModelContext.Provider>
	);
};

export default ModelDetailContext;