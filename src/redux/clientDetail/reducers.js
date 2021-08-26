import { createSlice } from "@reduxjs/toolkit";

const initial = {
	clientDetail: {
		name: "",
		licenseType: { label: "", value: "" },
		licenses: 0,
		registeredBy: "",
		registeredDate: "11/11/2019",
	},
	clientDetailLoading: false,
};

export const clientDetailSlice = createSlice({
	name: "clientDetailData",
	initialState: initial,
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
		clientReset: (state) => {
			state.clientDetail = initial.clientDetail;
		},
	},
});
