import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userDetail: {},
	userLoading: false,
	hasData: false,
};

export const authSlice = createSlice({
	name: "authData",
	initialState,
	reducers: {},
});
