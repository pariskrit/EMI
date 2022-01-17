import React from "react";
import PropTypes from "prop-types";

function AccessWrapper({ children, access, accessList }) {
	if (accessList.includes(access) || access === "F") return <>{children}</>;
	return null;
}

AccessWrapper.defaultProps = {
	access: "F",
	accessList: ["F"],
};

AccessWrapper.propTypes = {
	children: PropTypes.any.isRequired,
	access: PropTypes.string,
	accessList: PropTypes.arrayOf(PropTypes.string),
};

export default AccessWrapper;
