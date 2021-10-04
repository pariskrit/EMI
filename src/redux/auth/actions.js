import API from "helpers/api";
import { authSlice } from "./reducers";

const { loginRequest, dataSuccess, userFailure } = authSlice.actions;

export const loginUser = (input) => async (dispatch) => {
	dispatch(loginRequest());
	return new Promise((resolve, reject) => {
		API.post("/api/Users/Login", input)
			.then((res) => {
				dispatch(dataSuccess({ payload: res.data }));
				resolve(res.data);
			})
			.catch((err) => {
				dispatch(userFailure());
				reject(err);
			});
	});
};
export const getUserDetail = () => async (dispatch) => {};
