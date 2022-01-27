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

	// Check whether the user is superAdmin, clientAdmin or SiteUser
	const typeOfAccess =
		role === roles.superAdmin // If superAdmin, type is role
			? "role"
			: role === roles.clientAdmin // If clientAdmin, depends where it is from clientAdmin mode or not
			? sessionStorage.getItem("clientAdminMode") ||
			  localStorage.getItem("clientAdminMode")
				? "role" // If from clientAdmin mode, type is role
				: "access" // If directly logged in, type is access
			: type; // If siteUser, type is received from props which selects route

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
