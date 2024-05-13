import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	error: { status: false, message: "" },
	loading: false,
	isHistoryDrawerOpen: false,
	showData: { isRedirected: false, data: {} },
};

export const commonSlice = createSlice({
	name: "commonData",
	initialState,
	reducers: {
		setError: (state, { payload }) => {
			state.error = { status: true, message: payload.message };
		},
		removeError: (state) => {
			state.error = { status: false, message: "" };
		},
		setLoading: (state, { payload }) => {
			state.loading = payload.loading;
		},
		openHistoryDrawer: (state, { payload }) => {
			state.isHistoryDrawerOpen = payload.historyDrawerState;
		},
		setShowData: (state, { payload }) => {
			state.showData = {
				isRedirected: payload.showDataState,
				data: payload.showData,
			};
		},
	},
});
