import React from "react";
import PropTypes from "prop-types";
function RoleWrapper({ children, roles }) {
	const me = JSON.parse(localStorage.getItem("me"));

	if (roles.includes(me.role)) return <>{children}</>;
	return null;
}

RoleWrapper.propTypes = {
	children: PropTypes.any.isRequired,
	roles: PropTypes.array.isRequired,
};

export default RoleWrapper;
