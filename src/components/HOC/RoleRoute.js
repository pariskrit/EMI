import React from "react";
import PropTypes from "prop-types";
import { Route, useHistory } from "react-router";

const RoleRoute = ({
	component: Component,
	roles,
	access,
	condition,
	...rest
}) => {
	const { role, position } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const history = useHistory();
	return (
		<Route
			{...rest}
			render={(props) =>
				roles.includes(role) || condition ? (
					<Component
						{...props}
						history={history}
						role={role}
						access={position?.[access]}
					/>
				) : history.length > 1 ? (
					history.goBack()
				) : (
					history.push("/app/me")
				)
			}
		/>
	);
};

export const RoleRoutes = ({
	component: Component,
	roles,
	access,
	condition,
	routeInfo,
	...rest
}) => {
	const { role, position } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const history = useHistory();
	return (
		<Route
			{...rest}
			render={(props) =>
				roles.includes(role) || condition ? (
					<Component
						{...routeInfo}
						{...props}
						history={history}
						role={role}
						access={position?.[access]}
					/>
				) : history.length > 1 ? (
					history.goBack()
				) : (
					history.push("/app/me")
				)
			}
		/>
	);
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
