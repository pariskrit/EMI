import React from "react";
import PropTypes from "prop-types";

const AccessWrapper = ({ children, access }) => {
	const { position } = JSON.parse(localStorage.getItem("me"));

	if (position === null || access.includes(position?.name))
		return <div>{children}</div>;

	return;
};

AccessWrapper.defaultProps = {
	access: [],
};

AccessWrapper.propTypes = {
	children: PropTypes.any.isRequired,
	access: PropTypes.array,
};

export default AccessWrapper;
