import roles from "helpers/roles";
import { encryptToken } from "./authenticationCrypto";

export function setMeStorage(data) {
	return new Promise((res) => {
		const modifiedData = {
			...data,
			jwtToken: encryptToken(data.jwtToken),
			refreshToken: encryptToken(data.refreshToken),
		};
		localStorage.setItem("me", JSON.stringify(modifiedData));
		sessionStorage.setItem("me", JSON.stringify(modifiedData));
		res(data);
	});
}

export function setStorage(res) {
	return new Promise(async (resolve) => {
		localStorage.setItem("token", encryptToken(res.jwtToken));
		sessionStorage.setItem("token", encryptToken(res.jwtToken));
		let response = res;
		if (response.position !== null) {
			response["role"] = roles.siteUser;
		}
		await setMeStorage(response);

		resolve(response);
	});
}
