import React from "react";
import PropTypes from "prop-types";
import { Route, useHistory } from "react-router";

const AccessRoute = ({ component: Component, access, user, ...rest }) => {
	const history = useHistory();
	const { position, isAdmin } = JSON.parse(localStorage.getItem("me"));
	switch (user) {
		case "SuperAdmin":
			return (
				<Route
					{...rest}
					render={(props) =>
						position === null && isAdmin === true ? (
							<Component {...props} position={position} history={history} />
						) : history.length > 1 ? (
							history.goBack()
						) : (
							history.push("/app/me")
						)
					}
				/>
			);

		case "ClientAdmin":
			return (
				<Route
					{...rest}
					render={(props) =>
						position !== null &&
						isAdmin === true &&
						(position[access] === "F" ||
							position[access] === "E" ||
							position[access] === "R") ? (
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
		case "SiteUser":
			return (
				<Route
					{...rest}
					render={(props) =>
						position !== null &&
						isAdmin === false &&
						(position[access] === "F" ||
							position[access] === "E" ||
							position[access] === "R") ? (
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
		default:
			return (
				<Route
					{...rest}
					render={(props) =>
						position?.[access] === "F" ||
						position?.[access] === "E" ||
						position?.[access] === "R" ? (
							<Component
								{...props}
								position={position}
								access={position?.[access]}
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
	user: "",
};
AccessRoute.propTypes = {
	access: PropTypes.string,
	user: PropTypes.string,
	component: PropTypes.elementType.isRequired,
};

export default AccessRoute;
