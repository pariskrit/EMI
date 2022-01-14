import React from "react";
import PropTypes from "prop-types";

function AccessWrapper({ children, access }) {
	if (access === "F") return <div>{children}</div>;

	return null;
}

AccessWrapper.defaultProps = {
	access: "N",
};

AccessWrapper.propTypes = {
	children: PropTypes.any.isRequired,
	access: PropTypes.array,
};

export default AccessWrapper;
