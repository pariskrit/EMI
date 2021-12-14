import React from "react";
import SingleComponent from "./SingleComponent";
import { userDetailPath, userProfilePath } from "helpers/routePaths";
import CommonUserComponent from "components/Modules/CommonUserComponent";
import differentUserAPIs from "helpers/differentUserAPIs";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import AccessRoute from "components/HOC/AccessRoute";
import access from "helpers/access";
import { Route } from "react-router-dom";

const routes = [
	{
		id: 15,
		name: "Details",
		path: userDetailPath,
		component: CommonUserComponent,
		showHistory: true,
		showSwitch: true,
		showPasswordReset: false,
		showNotes: true,
		api: differentUserAPIs.UserDetailsAPIs,
		title: "User Details",
	},
	{
		id: 100,
		name: "Details",
		path: userProfilePath,
		component: CommonUserComponent,
		showHistory: true,
		showSwitch: false,
		showPasswordReset: true,
		showNotes: false,
		api: differentUserAPIs.UserProfileAPIs,
		title: "User Profile",
	},
];

const UserPage = ({ getError }) => {
	const detail = routes[0];
	const profile = routes[1];
	return (
		<div>
			<Route
				exact
				path={profile.path}
				component={(props) => (
					<SingleComponent {...props} {...profile} getError={getError} />
				)}
			/>
			<AccessRoute
				access={access.userAccess}
				path={detail.path}
				exact
				component={(props) => (
					<SingleComponent {...props} {...detail} getError={getError} />
				)}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(UserPage);