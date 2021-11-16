import axios from "axios";

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
if (
	localStorage.getItem("token") !== null ||
	localStorage.getItem("token") !== undefined
) {
	instance.defaults.headers.common[
		"Authorization"
	] = `bearer ${localStorage.getItem("token")}`;
}

instance.interceptors.response.use(
	(response) => {
		const url = response.config.url;
		if (
			url === "/api/Users/Login" ||
			url === "/Account/google" ||
			url === "/Account/microsoft"
		) {
			instance.defaults.headers.common[
				"Authorization"
			] = `bearer ${response.data.jwtToken}`;
		}
		return response;
	},
	async (error) => {
		// if (error.response.status === 401 || error.response.status === 403) {
		// 	localStorage.clear();
		// 	window.location = "/login";
		// }
		// Storing original request
		const originalRequest = error.config;

		// Checking if 401 and ensuring not already attempted refresh
		if (error.response.status === 401 && !originalRequest._retry) {
			// Setting retry to prevent infinite loop
			originalRequest._retry = true;

			// Attempting to refresh token
			try {
				let refreshToken = await fetch(
					`${
						process.env.REACT_APP_API_ENDPOINT !== undefined
							? process.env.REACT_APP_API_ENDPOINT
							: "https://localhost:44310"
					}/api/Token/RefreshToken`,
					{
						withCredentials: true,
						credentials: "include",
						method: "POST",
						headers: {
							Authorization: `bearer ${localStorage.getItem("token")}`,
							"Content-Type": "application/json",
						},
					}
				);

				// Getting JSON stream
				refreshToken = await refreshToken.json();

				// Updating original request's JWT
				originalRequest.headers.Authorization = `bearer ${refreshToken.jwtToken}`;

				// Updating refresh token in localStorage
				localStorage.setItem("token", refreshToken.jwtToken);

				// Updating instance token
				instance.defaults.headers.common[
					"Authorization"
				] = `bearer ${localStorage.getItem("token")}`;

				return instance(originalRequest);
			} catch (err) {
				// Returning error if present
				return Promise.reject(err);
			}
		}

		// const url = error.config.url;
		// if (
		// 	url !== "/Account/google" ||
		// 	url !== "/Account/microsoft" ||
		// 	url !== "/api/Users/Login"
		// ) {
		// 	localStorage.clear();
		// 	window.location = "/login";
		// }

		// Returning with error if this is the second instance OR not 401
		return Promise.reject(error);
	}
);

export default instance;
