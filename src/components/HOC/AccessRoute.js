import React from "react";
import PropTypes from "prop-types";
import { Route, useHistory } from "react-router";

const AccessRoute = ({ component: Component, access, ...rest }) => {
	const history = useHistory();
	const { position } = JSON.parse(localStorage.getItem("me"));
	if (position === null) {
		return (
			<Route
				{...rest}
				render={(props) =>
					position === null ? (
						<Component {...props} history={history} />
					) : history.length > 1 ? (
						history.goBack()
					) : (
						history.push("/app/me")
					)
				}
			/>
		);
	} else {
		return (
			<Route
				{...rest}
				render={(props) =>
					position[access] === "F" ||
					position[access] === "E" ||
					position[access] === "R" ? (
						<Component
							{...props}
							position={position}
							access={position[access]}
							history={history}
						/>
					) : history.length > 1 ? (
						history.goBack()
					) : (
						history.push("/app/me")
					)
				}
			/>
		);
	}
};

AccessRoute.defaultProps = {
	access: "",
};
AccessRoute.propTypes = {
	access: PropTypes.string,
	component: PropTypes.elementType.isRequired,
};

export default AccessRoute;
