import React, { createContext, useReducer } from "react";

const initialState = {
	showAdd: false,
	applicationName: "",
	siteAppDetail: {},
};

function reducer(state, action) {
	switch (action.type) {
		case "ADD_TOGGLE":
			return {
				...state,
				showAdd: !state.showAdd,
			};
		case "SET_APP_NAME":
			return {
				...state,
				applicationName: action.payload,
			};
		case "SET_SITE_APP_DETAIL": {
			return {
				...state,
				siteAppDetail: action.payload,
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
