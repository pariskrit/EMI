import React from "react";
import PropTypes from "prop-types";
import RoleRoute from "./RoleRoute";
import AccessRoute from "./AccessRoute";
import { Route } from "react-router-dom";

const AccessRoleRoute = ({ type, ...rest }) => {
	switch (type) {
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
