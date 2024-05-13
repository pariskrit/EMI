import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const AccessRoute = ({
	children,
	component: Component,
	access,
	condition,
	...rest
}) => {
	const navigate = useNavigate();
	const { position, role } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const accessState =
		position?.[access] === "F" ||
		position?.[access] === "E" ||
		position?.[access] === "R" ||
		condition;

	useEffect(() => {
		if (!accessState && !(window.history.length < 1)) {
			navigate(-1);
		}
	}, []);

	if (accessState)
		return (
			<>
				{children}
				<Outlet context={{ access: position?.[access], role, position }} />
			</>
		);
	else if (window.history.length < 1) {
		return <Navigate to="/app/me" />;
	}

	// return <Navigate to="/app/portal" />;
};
AccessRoute.defaultProps = {
	access: "",
};
AccessRoute.propTypes = {
	access: PropTypes.string,
	component: PropTypes.elementType.isRequired,
};

export default AccessRoute;
