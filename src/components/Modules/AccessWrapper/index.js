import React from "react";
import PropTypes from "prop-types";

function AccessWrapper({ children, access, accessList }) {
	const { position } = JSON.parse(localStorage.getItem("me"));
	if (accessList.includes(position[access]) === "F") return <>{children}</>;

	return null;
}

AccessWrapper.defaultProps = {
	access: "modelAccess",
	accessList: ["R"],
};

AccessWrapper.propTypes = {
	children: PropTypes.any.isRequired,
	access: PropTypes.string,
	accessList: PropTypes.arrayOf(PropTypes.string),
};

export default AccessWrapper;
