import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userDetail: {},
	userLoading: false,
	isAuthenticated: false,
};

export const authSlice = createSlice({
	name: "authData",
	initialState,
	reducers: {
		userRequest: (state) => {
			state.userLoading = true;
		},
		loginRequest: (state) => {
			state.userLoading = true;
		},
		dataSuccess: (state, { payload }) => {
			state.userLoading = false;
			state.userDetail = payload.data;
			state.isAuthenticated = true;
		},
		logOutSuccess: (state) => {
			state.userDetail = {};
		},
		userFailure: (state) => {
			state.userLoading = false;
		},
	},
});
