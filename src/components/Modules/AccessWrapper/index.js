import React from "react";
import PropTypes from "prop-types";

const AccessWrapper = ({ children, access }) => {
	const me = JSON.parse(localStorage.getItem("me"));

	if (me?.isAdmin === true || access.includes(me?.position?.name))
		return <div>{children}</div>;

	return null;
};

AccessWrapper.defaultProps = {
	access: [],
};

AccessWrapper.propTypes = {
	children: PropTypes.any.isRequired,
	access: PropTypes.array,
};

export default AccessWrapper;
