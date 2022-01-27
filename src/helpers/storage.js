import roles from "helpers/roles";

export function setMeStorage(data) {
	return new Promise((res) => {
		localStorage.setItem("me", JSON.stringify(data));
		sessionStorage.setItem("me", JSON.stringify(data));
		res(data);
	});
}

export function setStorage(res) {
	return new Promise(async (resolve) => {
		localStorage.setItem("token", res.jwtToken);
		sessionStorage.setItem("token", res.jwtToken);
		let response = res;
		if (response.position === null && response.isAdmin === true) {
			response["role"] = roles.superAdmin;
		}
		if (response.position !== null && response.isAdmin === true) {
			response["role"] = roles.clientAdmin;
		}
		if (response.position !== null && response.isAdmin === false) {
			response["role"] = roles.siteUser;
		}
		await setMeStorage(response);

		resolve(response);
	});
}
