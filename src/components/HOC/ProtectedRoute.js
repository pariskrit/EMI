import React from "react";
import { Redirect, Route } from "react-router";
import { connect } from "react-redux";
import { LinearProgress } from "@material-ui/core";

const ProtectedRoute = ({ component: Component, userLoading, ...rest }) => {
	if (!userLoading) {
		return (
			<Route
				{...rest}
				render={(props) =>
					localStorage.getItem("me") ? (
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
	} else {
		return <LinearProgress />;
	}
};

const mapStateToProps = ({ authData: { userLoading } }) => ({
	userLoading,
});

export default connect(mapStateToProps)(ProtectedRoute);
