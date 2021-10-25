import React, { createContext, useReducer } from "react";

const initialState = {
	showAdd: false,
	openConfirmationModal: false,
	details: {},
	isActive: false,
	defaultCustomCaptionsData: {},
	apiErrorPresent: true,
	// haveData: false,
};

function reducer(state, action) {
	switch (action.type) {
		case "ADD_TOGGLE":
			return {
				...state,
				showAdd: !state.showAdd,
			};

		case "SET_SITE_APP_DETAIL": {
			return {
				...state,
				details: action.payload,
			};
		}

		case "RESET_SITE_APP_DETAIL": {
			return {
				showAdd: false,
				openConfirmationModal: false,
				details: {},
				isActive: false,
				defaultCustomCaptionsData: {},
			};
		}

		case "TOGGLE_CONFIRMATION_MODAL": {
			return {
				...state,
				openConfirmationModal: action.payload,
			};
		}

		case "TOGGLE_ISACTIVE": {
			return {
				...state,
				isActive: action.payload,
			};
		}

		case "DEFAULT_CUSTOM_CAPTIONS_DATA": {
			return {
				...state,
				defaultCustomCaptionsData: action.payload,
			};
		}

		default:
			return state;
	}
}

export const SiteContext = createContext();

const SiteApplicationContext = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<SiteContext.Provider value={[state, dispatch]}>
			{children}
		</SiteContext.Provider>
	);
};

export default SiteApplicationContext;
