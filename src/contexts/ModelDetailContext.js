import ColourConstants from "helpers/colourConstants";
import React, { createContext, useReducer } from "react";

const initialState = {
	modelDetail: {
		id: "",
	},
	showAdd: false,
	showSave: false,
	showSaveChanges: false,
	showPasteTask: false,
	showChangeStatus: false,
	showConfirmationPopup: false,
	showVersion: false,
	isPasteTaskDisabled: true,
	isQuestionTaskDisabled: true,
};

function reducer(state, action) {
	const { payload, type } = action;
	switch (type) {
		case "SET_MODEL_DETAIL":
			return {
				...state,
				modelDetail: {
					...payload?.detail,
					statusColor: !payload?.detail?.isPublished
						? ColourConstants.orange
						: payload?.detail?.version === payload.activeModelVersion
						? ColourConstants.green
						: ColourConstants.red,
					activeModelVersion: payload.activeModelVersion,
				},
			};

		case "SET_ISPUBLISHED":
			return {
				...state,
				modelDetail: {
					...state.modelDetail,
					isPublished: payload.isPublished,
					modelStatusName: payload.modelStatusName,
					statusColor: !payload.isPublished
						? ColourConstants.orange
						: ColourConstants.green,
					activeModelVersion: state.modelDetail.version,
				},
			};
		case "REVERT_VERSION":
			return {
				...state,
				modelDetail: {
					...state.modelDetail,
					statusColor: ColourConstants.green,
					activeModelVersion: payload,
				},
			};

		case "SET_IMAGE":
			return {
				...state,
				modelDetail: {
					...state.modelDetail,
					imageURL: payload.imageURL,
					thumbnailURL: payload.thumbnailURL,
				},
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
		case "TOGGLE_CONFIRMATION_POPUP":
			return {
				...state,
				showConfirmationPopup: payload,
			};

		case "TOOGLE_VERSION":
			return {
				...state,
				showVersion: payload,
			};

		case "TOGGLE_ENABLE_INTERVALS":
			return {
				...state,
				modelDetail: {
					...state.modelDetail,
					enableIntervalAutoInclude: !state.modelDetail
						.enableIntervalAutoInclude,
				},
			};
		case "DISABLE_PASTE_TASK":
			return { ...state, isPasteTaskDisabled: payload };

		case "DISABLE_QUESTION_TASK":
			return { ...state, isQuestionTaskDisabled: payload };

		case "TAB_COUNT":
			return {
				...state,
				modelDetail: { ...state.modelDetail, [payload.countTab]: payload.data },
			};
		case "TASK_DETAIL":
			return {
				...state,
				taskDetail: payload,
			};

		case "TASK_DETAIL_UPDATE":
			return {
				...state,
				taskDetail: { ...state.taskDetail, [payload.countTab]: payload.data },
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
