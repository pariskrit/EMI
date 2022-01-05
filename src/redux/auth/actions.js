import API from "helpers/api";
import { authSlice } from "./reducers";

const {
	userRequest,
	dataSuccess,
	logOutSuccess,
	userFailure,
} = authSlice.actions;

export const loginUser = (input) => async (dispatch) => {
	dispatch(userRequest());
	return new Promise((resolve, reject) => {
		API.post("/api/Users/Login", input)
			.then((res) => {
				localStorage.setItem("token", res.data.jwtToken);
				localStorage.setItem("me", JSON.stringify(res.data));
				dispatch(dataSuccess({ data: res.data }));
				resolve(res);
			})
			.catch((err) => {
				dispatch(userFailure(err?.response?.data?.detail));
				reject(err);
			});
	});
};

export const loginSocialAccount = (input, loginType, url) => async (
	dispatch
) => {
	dispatch(userRequest());
	return new Promise((resolve, reject) => {
		API.post(url, input)
			.then((res) => {
				localStorage.setItem("token", res.data.jwtToken);
				localStorage.setItem("me", JSON.stringify(res.data));
				localStorage.setItem("loginType", loginType);
				dispatch(dataSuccess({ data: res.data }));

				resolve(res);
			})
			.catch((err) => {
				dispatch(userFailure(err.response.data.detail));
				reject(err);
			});
	});
};

export const getUserDetail = () => async (dispatch) => {
	dispatch(userRequest());
	API.get("/api/Users/me")
		.then((res) => {
			const loginType = localStorage.getItem("loginType");
			dispatch(dataSuccess({ data: { ...res.data, loginType } }));
		})
		.catch((err) => {
			dispatch(userFailure());
		});
};

export const logOutUser = () => (dispatch) => {
	return new Promise((res, rej) => {
		API.post("/api/Users/Logout")
			.then((response) => {
				dispatch(logOutSuccess());
				res(response);
			})
			.catch((err) => {
				dispatch(userFailure());
				rej(err);
			});
	});
};
