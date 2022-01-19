import roles from "helpers/roles";

export function setStorage(res) {
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
	localStorage.setItem("me", JSON.stringify(response));
	sessionStorage.setItem("me", JSON.stringify(response));
}
