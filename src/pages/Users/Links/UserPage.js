import React from "react";
import { Route } from "react-router-dom";
import SingleComponent from "./SingleComponent";
import { userDetailPath, userProfilePath } from "helpers/routePaths";
import CommonUserComponent from "components/Modules/CommonUserComponent";

import differentUserAPIs from "helpers/differentUserAPIs";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";

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
	return (
		<div>
			{routes.map((route) => (
				<Route key={route.id} path={route.path} exact>
					<SingleComponent {...route} getError={getError} />
				</Route>
			))}
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(UserPage);
