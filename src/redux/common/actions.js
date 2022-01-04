import instance from "helpers/api";
import { commonSlice } from "./reducers";
const { setError, removeError, setLoading } = commonSlice.actions;

export const showError = (message) => (dispatch) =>
	dispatch(setError({ message }));

export const loginWithSiteAppId = (id) => async (dispatch) => {
	dispatch(setLoading({ loading: true }));

	const res = await instance.get(`/api/Users/LoginToSiteApp/${id}`);
	localStorage.setItem("me", JSON.stringify(res.data));
	localStorage.removeItem("siteAppId");

	dispatch(setLoading({ loading: false }));
};

export const hideError = () => (dispatch) => dispatch(removeError());
