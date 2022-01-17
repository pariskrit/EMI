import React from "react";
import PropTypes from "prop-types";
import access from "helpers/access";

function AccessWrapper({ children, access, accessList }) {
	const { position } = JSON.parse(localStorage.getItem("me"));
	if (accessList.includes(position[access]) || position[access] === "F")
		return <>{children}</>;

	return null;
}

AccessWrapper.defaultProps = {
	access: access.modelAccess,
	accessList: ["F"],
};

AccessWrapper.propTypes = {
	children: PropTypes.any.isRequired,
	access: PropTypes.string,
	accessList: PropTypes.arrayOf(PropTypes.string),
};

export default AccessWrapper;
