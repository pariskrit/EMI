import React from "react";
import PropTypes from "prop-types";
function RoleWrapper({ children, roles }) {
	const me = JSON.parse(localStorage.getItem("me"));

	if (roles.includes(me.role)) return <div>{children}</div>;

	return null;
}

RoleWrapper.defaultProps = {
	roles: [],
};

RoleWrapper.propTypes = {
	children: PropTypes.any.isRequired,
	roles: PropTypes.array,
};

export default RoleWrapper;
