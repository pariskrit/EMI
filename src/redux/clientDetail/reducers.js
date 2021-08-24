import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	clientDetail: {},
	clientDetailLoading: false,
};

export const clientDetailSlice = createSlice({
	name: "clientDetailData",
	initialState,
	reducers: {
		clientDetailInitialize: (state) => {
			state.clientDetailLoading = true;
		},
		clientDetailFetchSuccess: (state, { payload }) => {
			state.clientDetail = payload.data;
			state.clientDetailLoading = false;
		},
		clientDetailFailure: (state) => {
			state.clientDetailLoading = false;
		},
	},
});
