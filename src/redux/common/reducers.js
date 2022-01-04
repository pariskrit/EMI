import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	error: { status: false, message: "" },
	loading: false,
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
	},
});
