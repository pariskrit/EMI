import API from "helpers/api";
import { encryptToken } from "helpers/authenticationCrypto";
import { setStorage } from "helpers/storage";
import { authSlice } from "./reducers";

const {
	userRequest,
	dataSuccess,
	logOutSuccess,
	userFailure,
} = authSlice.actions;

export const loginUser = (input) => async (dispatch) => {
	dispatch(userRequest());
	return new Promise(async (resolve, reject) => {
		API.post("/api/Users/Login", input)
			.then(async (res) => {
				const d = await setStorage(res.data);
				const modifiedData = {
					...d,
					jwtToken: encryptToken(d.jwtToken),
					refreshToken: encryptToken(d.refreshToken),
				};
				localStorage.setItem("originalLogin", JSON.stringify(modifiedData));
				sessionStorage.setItem("originalLogin", JSON.stringify(modifiedData));
				dispatch(dataSuccess({ data: modifiedData }));
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
			.then(async (res) => {
				const d = await setStorage(res.data);
				const modifiedData = {
					...d,
					jwtToken: encryptToken(d.jwtToken),
					refreshToken: encryptToken(d.refreshToken),
				};
				localStorage.setItem("loginType", loginType);
				sessionStorage.setItem("loginType", loginType);
				localStorage.setItem("originalLogin", JSON.stringify(modifiedData));
				sessionStorage.setItem("originalLogin", JSON.stringify(modifiedData));
				dispatch(dataSuccess({ data: modifiedData }));
				resolve(res);
			})
			.catch((err) => {
				dispatch(
					userFailure(err?.response?.data?.detail || err?.response?.data)
				);
				reject(err);
			});
	});
};

export const getUserDetail = () => async (dispatch) => {
	dispatch(userRequest());
	API.get("/api/Users/me")
		.then((res) => {
			const loginType =
				sessionStorage.getItem("loginType") ||
				localStorage.getItem("loginType");

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
