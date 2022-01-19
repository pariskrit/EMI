import React from "react";
import { Redirect, Route } from "react-router";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const me = sessionStorage.getItem("me") || localStorage.getItem("me");
	return (
		<Route
			{...rest}
			render={(props) =>
				me ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

export default ProtectedRoute;
