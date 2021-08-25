import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
