import { notificationSlice } from "./reducers";
const { setNotification } = notificationSlice.actions;

export const showNotications = (payload) => (dispatch) =>
	dispatch(setNotification(payload));
