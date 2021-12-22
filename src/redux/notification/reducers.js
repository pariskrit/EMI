import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	notification: {
		show: false,
		message: "",
		severity: "",
	},
};

export const notificationSlice = createSlice({
	name: "notificaton",
	initialState,
	reducers: {
		setNotification: (state, { payload }) => {
			state.notification = payload;
		},
	},
});
