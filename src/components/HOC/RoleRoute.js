import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
	Route,
	useNavigate,
	useLocation,
	Outlet,
	Navigate,
} from "react-router-dom";
const RoleRoute = ({
	component: Component,
	roles,
	access,
	condition,
	children,
	...rest
}) => {
	const { role, position } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const navigate = useNavigate();

	const roleAccess = roles.includes(role) || condition;

	useEffect(() => {
		if (!roleAccess && !(window.history.length < 1)) {
			return navigate(-1);
		}
	});

	if (roleAccess)
		return (
			<>
				{children}
				<Outlet context={{ access: position?.[access], role }} />
			</>
		);
	else if (window.history.length < 1) {
		return <Navigate to="/app/me" />;
	}

	// return navigate(-1);
	// return (
	// 	<Route
	// 		{...rest}
	// 		render={(props) =>
	// 			roles.includes(role) || condition ? (
	// 				<Component
	// 					{...props}
	// 					history={{ location }}
	// 					role={role}
	// 					access={position?.[access]}
	// 				/>
	// 			) : historyLength > 1 ? (
	// 				navigate(-1)
	// 			) : (
	// 				navigate("/app/me")
	// 			)
	// 		}
	// 	/>
	// );
};

export const RoleRoutes = ({
	component: Component,
	roles,
	access,
	condition,
	routeInfo,
	children,
	...rest
}) => {
	const { role, position } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const navigate = useNavigate();

	const roleAccess = roles.includes(role) || condition;

	useEffect(() => {
		if (!roleAccess && !(window.history.length < 1)) {
			return navigate(-1);
		}
	});

	if (roleAccess)
		return (
			<>
				{children}
				<Outlet context={{ access: position?.[access], role }} />
			</>
		);
	else if (window.history.length < 1) {
		return <Navigate to="/app/me" />;
	}

	// return navigate(-1);

	// return (
	// 	<Route
	// 		{...rest}
	// 		render={(props) =>
	// 			roles.includes(role) || condition ? (
	// 				<Component
	// 					{...routeInfo}
	// 					{...props}
	// 					history={{ location }}
	// 					role={role}
	// 					access={position?.[access]}
	// 				/>
	// 			) : historyLength > 1 ? (
	// 				navigate(-1)
	// 			) : (
	// 				navigate("/app/me")
	// 			)
	// 		}
	// 	/>
	// );
};

RoleRoute.defaultProps = {
	roles: [],
	access: "",
	condition: false,
};
RoleRoute.propTypes = {
	roles: PropTypes.arrayOf(PropTypes.string),
	component: PropTypes.elementType.isRequired,
	condition: PropTypes.bool,
};

export default RoleRoute;
