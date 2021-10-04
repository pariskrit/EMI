import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userDetail: {},
	userLoading: false,
	hasData: false,
};

export const authSlice = createSlice({
	name: "authData",
	initialState,
	reducers: {
		loginRequest: (state) => {
			state.userLoading = true;
		},
		dataSuccess: (state, { payload }) => {
			state.userLoading = false;
			state.userDetail = payload.data;
			state.hasData = true;
		},
		userFailure: (state) => {
			state.userLoading = false;
		},
	},
});
