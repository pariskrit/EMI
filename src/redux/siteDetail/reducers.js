import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	siteDetails: {},
	crumbs: [],
};

export const siteDetailSlice = createSlice({
	name: "siteDetailData",
	initialState,
	reducers: {
		setSiteDetail: (state, { payload }) => {
			state.siteDetails = payload.data;
			state.crumbs = [
				payload.data.clientName,
				payload.data.regionName,
				payload.data.name,
			];
		},
		setCrumbs: (state, { payload }) => {
			state.crumbs = payload;
		},
	},
});
