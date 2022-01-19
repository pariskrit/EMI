import React from "react";
import { Redirect, Route } from "react-router";

const ProtectedLogin = ({ component: Component, ...rest }) => {
	const {
		location: { state },
	} = rest;
	const me = sessionStorage.getItem("me") || localStorage.getItem("me");
	return (
		<Route
			{...rest}
			render={(props) =>
				!me ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: state?.from?.pathname
								? state?.from?.pathname
								: "/app/me",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

export default ProtectedLogin;
