import axios from "axios";
import { decryptToken, encryptToken } from "./authenticationCrypto";

let isRefreshing = false;
let failedRequest = [];

const requestQueue = (error, token = null) => {
	failedRequest.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedRequest = [];
};

// Setting base URL for backend requests
const instance = axios.create({
	baseURL:
		process.env.REACT_APP_API_ENDPOINT !== undefined
			? process.env.REACT_APP_API_ENDPOINT
			: "https://localhost:44310",
	withCredentials: true,
	credentials: "include",
});

// Setting auth (if JWT present)

instance.interceptors.request.use(
	(config) => {
		const localToken =
			sessionStorage.getItem("token") || localStorage.getItem("token");
		const token = decryptToken(localToken);

		if (token) {
			config.headers["Authorization"] = `bearer ${token}`;
		}

		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

instance.interceptors.response.use(
	(response) => {
		const url = response.config.url;
		if (
			url === "/api/Users/Login" ||
			url === "/api/Account/google" ||
			url === "/api/Account/microsoft"
		) {
			instance.defaults.headers.common[
				"Authorization"
			] = `bearer ${response.data.jwtToken}`;
		}
		return response;
	},
	async (error) => {
		// Storing original request
		const originalRequest = error.config;

		// Checking if 401 and ensuring not already attempted refresh
		if (error.response.status === 401 && !originalRequest._retry) {
			// Setting retry to prevent infinite loop
			originalRequest._retry = true;

			// Attempting to refresh token
			try {
				if (isRefreshing) {
					return new Promise(function (resolve, reject) {
						failedRequest.push({ resolve, reject });
					})
						.then((token) => {
							originalRequest.headers["Authorization"] = "bearer " + token;
							return instance(originalRequest);
						})
						.catch((err) => {
							return Promise.reject(err);
						});
				}
				originalRequest._retry = true;
				isRefreshing = true;

				const sessionToken =
					JSON.parse(sessionStorage.getItem("me")) ||
					JSON.parse(localStorage.getItem("me"));

				const sessionRefreshToken = decryptToken(sessionToken?.refreshToken);
				let refreshToken = await fetch(
					`${
						process.env.REACT_APP_API_ENDPOINT !== undefined
							? process.env.REACT_APP_API_ENDPOINT
							: "https://localhost:44310"
					}/api/Token/RefreshToken?token=${encodeURIComponent(
						sessionRefreshToken
					)}`,
					{
						withCredentials: true,
						credentials: "include",
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (refreshToken.status === 401) {
					throw new Error(refreshToken);
				}
				// Getting JSON stream
				refreshToken = await refreshToken.json();

				// Updating original request's JWT
				originalRequest.headers.Authorization = `bearer ${refreshToken.jwtToken}`;

				// Updating refresh token in localStorage
				localStorage.setItem("token", encryptToken(refreshToken.jwtToken));
				sessionStorage.setItem("token", encryptToken(refreshToken.jwtToken));

				let newRefreshData = {
					...sessionToken,
					refreshToken: encryptToken(refreshToken.refreshToken),
					jwtToken: encryptToken(refreshToken.jwtToken),
				};

				sessionStorage.setItem("me", JSON.stringify(newRefreshData));

				localStorage.setItem("me", JSON.stringify(newRefreshData));

				requestQueue(null, refreshToken.jwtToken);
				isRefreshing = false;

				// Updating instance token
				instance.defaults.headers.common["Authorization"] = `bearer ${
					sessionStorage.getItem("token") || localStorage.getItem("token")
				}`;

				return instance(originalRequest);
			} catch (err) {
				// Returning error if present
				sessionStorage.clear();
				localStorage.clear();
				window.location = "/login";
				return Promise.reject(err);
			}
		}

		// Returning with error if this is the second instance OR not 401
		return Promise.reject(error);
	}
);

export default instance;
