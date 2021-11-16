import React from "react";
import { Redirect, Route } from "react-router";

const RoleRoute = ({ component: Component, roles, ...rest }) => {
	const roleVerified = roles.includes("Super Admin");
	return (
		<Route
			{...rest}
			render={(props) =>
				roleVerified ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/app/applications",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

export default RoleRoute;
