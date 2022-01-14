import React from "react";
import PropTypes from "prop-types";

function AccessWrapper({ children, access }) {
	if (access === "F") return <>{children}</>;

	return null;
}

AccessWrapper.defaultProps = {
	access: "N",
};

AccessWrapper.propTypes = {
	children: PropTypes.any.isRequired,
	access: PropTypes.string,
};

export default AccessWrapper;
