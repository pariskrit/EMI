import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userDetail: {},
	userLoading: false,
	isAuthenticated: false,
	errorMessage: "",
};

export const authSlice = createSlice({
	name: "authData",
	initialState,
	reducers: {
		userRequest: (state) => {
			state.userLoading = true;
		},
		dataSuccess: (state, { payload }) => {
			state.userLoading = false;
			state.userDetail = payload.data;
			state.isAuthenticated = true;
			state.errorMessage = "";
		},
		logOutSuccess: (state) => {
			state.userDetail = {};
		},
		userFailure: (state, msg) => {
			state.errorMessage = msg.payload;
			state.userLoading = false;
		},
	},
});
