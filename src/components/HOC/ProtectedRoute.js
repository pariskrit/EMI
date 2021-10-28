import React from "react";
import { Redirect, Route } from "react-router";
import { connect } from "react-redux";
import { LinearProgress } from "@material-ui/core";
// import roles from "helpers/roles";

const ProtectedRoute = ({
	children,
	roles,
	userDetail,
	userLoading,
	isAuthenticated,
	...rest
}) => {
	if (userLoading) return <LinearProgress />;
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated ? (
					children
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

const mapStateToProps = ({
	authData: { userDetail, userLoading, isAuthenticated },
}) => ({
	userDetail,
	userLoading,
	isAuthenticated,
});

export default connect(mapStateToProps)(ProtectedRoute);
