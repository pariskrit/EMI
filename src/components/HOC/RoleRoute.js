import React from "react";
import { Redirect, Route } from "react-router";

const RoleRoute = ({ component: Component, location, access, ...rest }) => {
	const { position } = JSON.parse(localStorage.getItem("me"));
	return (
		<Route
			{...rest}
			render={(props) =>
				(position === null && access === null) || position[access] === "F" ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/app/applications",
							state: { from: location },
						}}
					/>
				)
			}
		/>
	);
};

export default RoleRoute;
