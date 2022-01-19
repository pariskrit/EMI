import React from "react";
import PropTypes from "prop-types";
import { Route, useHistory } from "react-router";

const RoleRoute = ({ component: Component, roles, ...rest }) => {
	const { role } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const history = useHistory();
	return (
		<Route
			{...rest}
			render={(props) =>
				roles.includes(role) ? (
					<Component {...props} history={history} role={role} />
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
};
RoleRoute.propTypes = {
	roles: PropTypes.arrayOf(PropTypes.string),
	component: PropTypes.elementType.isRequired,
};

export default RoleRoute;
