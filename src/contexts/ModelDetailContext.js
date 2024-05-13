import ColourConstants from "helpers/colourConstants";
import React, { createContext, useReducer } from "react";

const initialState = {
	modelDetail: {
		id: "",
	},
	showhistorybar: false,
	showAdd: false,
	showSave: false,
	showSaveChanges: false,
	showPasteTask: false,
	showChangeStatus: false,
	showConfirmationPopup: false,
	showVersion: false,
	isPasteTaskDisabled: true,
	isQuestionTaskDisabled: true,
	isQuestionsDisabled: true,
	isToolTaskDisabled: true,
	isPermitsTaskDisabled: true,
	isPartTaskDisabled: true,
	isImageTaskDisabled: true,
	isAttachmentsTaskDisabled: true,
	serviceLayoutDetails: {
		modelVersionId: "",
		modelVersionRoleId: "",
		modelVersionIntervalId: "",
		modelVersionArrangementId: "",
	},
};

function reducer(state, action) {
	const { payload, type } = action;
	switch (type) {
		case "SET_SERVICE_LAYOUT_DETAILS":
			return {
				...state,
				serviceLayoutDetails: {
					...state.serviceLayoutDetails,
					...payload,
				},
			};
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

		case "UPDATE_SWITCH":
			return {
				...state,
				modelDetail: {
					...state?.modelDetail,
					active: payload?.active,
				},
			};

		case "UPDATE_REVIEWDATE":
			return {
				...state,
				modelDetail: {
					...state.modelDetail,
					reviewDate: action.payload,
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
					reviewDate: payload.reviewDate,
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
					enableIntervalAutoInclude:
						!state.modelDetail.enableIntervalAutoInclude,
				},
			};
		case "DISABLE_PASTE_TASK":
			return { ...state, isPasteTaskDisabled: payload };

		case "DISABLE_QUESTION_TASK":
			return { ...state, isQuestionTaskDisabled: payload };

		case "DISABLE_QUESTIONS_TASKS":
			return { ...state, isQuestionsDisabled: payload };

		case "DISABLE_TOOL_TASK":
			return { ...state, isToolTaskDisabled: payload };

		case "DISABLE_PERMIT_TASK":
			return { ...state, isPermitsTaskDisabled: payload };

		case "DISABLE_PARTS_TASK":
			return { ...state, isPartTaskDisabled: payload };

		case "DISABLE_IMAGES_TASK":
			return { ...state, isImageTaskDisabled: payload };

		case "DISABLE_ATTACHMENTS_TASK":
			return { ...state, isAttachmentsTaskDisabled: payload };

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

		case "CHANGE_MODEL_TYPE":
			return {
				...state,
				modelDetail: {
					...state.modelDetail,
					modelTypeID: payload.value,
					modelTypeName: payload.label,
				},
			};

		case "SERIAL_NUMBER_RANGE":
			return {
				...state,
				modelDetail: {
					...state.modelDetail,
					serialNumberRange: payload,
				},
			};

		case "CHANGE_TICK":
			return {
				...state,
				modelDetail: {
					...state.modelDetail,
					[payload.name]: !payload.value,
				},
			};

		case "TOGGLE_HISTORYBAR":
			return {
				...state,
				showhistorybar: !state.showhistorybar,
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
