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
	children: PropTypes.element.isRequired,
	access: PropTypes.string,
};

export default AccessWrapper;
