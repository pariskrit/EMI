import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	data: [],
	error: "",
};

export const testSlice = createSlice({
	name: "testData",
	initialState,
	reducers: {
		setData: (state) => {
			state.data = [{ name: "Rujal" }];
		},
	},
});
