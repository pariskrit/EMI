import { commonSlice } from "./reducers";
const { setError, removeError } = commonSlice.actions;

export const showError = (message) => (dispatch) =>
	dispatch(setError({ message }));

export const hideError = () => (dispatch) => dispatch(removeError());
