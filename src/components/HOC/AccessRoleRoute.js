import React from "react";
import PropTypes from "prop-types";
import RoleRoute from "./RoleRoute";
import AccessRoute from "./AccessRoute";
import { Route } from "react-router-dom";
import roles from "helpers/roles";

const AccessRoleRoute = ({ type, ...rest }) => {
	const { role } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const typeOfAccess =
		role === roles.superAdmin
			? "role"
			: role === roles.clientAdmin
			? sessionStorage.getItem("clientAdminMode")
				? "role"
				: "access"
			: type;

	switch (typeOfAccess) {
		case "role":
			return <RoleRoute {...rest} />;
		case "access":
			return <AccessRoute {...rest} />;
		default:
			return <Route {...rest} />;
	}
};

AccessRoleRoute.defaultProps = {
	type: "role",
};

AccessRoleRoute.propTypes = {
	type: PropTypes.string,
};

export default AccessRoleRoute;
