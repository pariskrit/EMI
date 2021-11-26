import React from "react";

const RoleWrapper = ({ children, accessRoles }) => {
	const { position } = JSON.parse(localStorage.getItem("me"));

	console.log(position, accessRoles);

	let access;
	if (position === null) {
		access = accessRoles?.includes("superAdmin");
	} else {
		access = accessRoles?.includes(position);
	}

	if (!access) return <></>;

	return <div>{children}</div>;
};

export default RoleWrapper;
