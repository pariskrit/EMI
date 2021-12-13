import React from "react";
import PropTypes from "prop-types";
import { Route, useHistory } from "react-router";

const AccessRoute = ({ component: Component, access, ...rest }) => {
	const history = useHistory();
	const { position } = JSON.parse(localStorage.getItem("me"));
	return (
		<Route
			{...rest}
			render={(props) =>
				(position === null && access === "") || position?.[access] === "F" ? (
					<Component {...props} />
				) : (
					history.goBack()
				)
			}
		/>
	);
};

AccessRoute.defaultProps = {
	access: "",
};
AccessRoute.propTypes = {
	access: PropTypes.string,
	component: PropTypes.elementType.isRequired,
};

export default AccessRoute;
