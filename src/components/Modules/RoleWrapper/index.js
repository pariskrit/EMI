import React from "react";

const RoleWrapper = ({ children, accessRoles }) => {
	const { role } = JSON.parse(localStorage.getItem("me"));

	let access = accessRoles?.includes(role);

	if (!access) return <></>;

	return <div>{children}</div>;
};

export default RoleWrapper;
