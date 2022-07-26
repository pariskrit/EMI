import React from "react";
import { Route } from "react-router-dom";
import SingleComponent from "./SingleComponent";
import {
	userDetailPath,
	userDetailSitePath,
	userModelAccess,
	userProfilePath,
} from "helpers/routePaths";
import CommonUserComponent from "components/Modules/CommonUserComponent";
import differentUserAPIs from "helpers/differentUserAPIs";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import UserModelAccess from "../UserDetail/UserModelAccess";
import UserSite from "../UserDetail/UserSites";
import TabTitle from "components/Elements/TabTitle";

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
		name: "Profile",
		path: userProfilePath,
		component: CommonUserComponent,
		showHistory: true,
		showSwitch: false,
		showPasswordReset: true,
		showNotes: false,
		api: differentUserAPIs.UserProfileAPIs,
		title: "User Profile",
	},
	{
		id: 99,
		name: "Sites",
		path: userDetailPath + userDetailSitePath,
		component: UserSite,
		showHistory: true,
		showSwitch: false,
		showPasswordReset: false,
		showNotes: false,
		api: differentUserAPIs.UserDetailsAPIs,
		title: "User Sites",
	},
	{
		id: 101,
		name: "Model Access",
		path: userDetailPath + userModelAccess,
		component: UserModelAccess,
		showHistory: true,
		showSwitch: false,
		showPasswordReset: false,
		showNotes: false,
		api: differentUserAPIs.UserDetailsAPIs,
		title: "Model Access",
	},
];

const UserPage = ({ getError }) => {
	// const detail = routes[0];
	// const profile = routes[1];
	return (
		<div>
			{routes.map((x) => (
				<Route
					key={x.id}
					exact
					path={x.path}
					component={(props) => (
						<SingleComponent {...props} {...x} getError={getError} />
					)}
				/>
			))}
			{/* <Route
				exact
				path={profile.path}
				component={(props) => (
					<SingleComponent {...props} {...profile} getError={getError} />
				)}
			/>
			<Route
				path={detail.path}
				exact
				component={(props) => (
					<SingleComponent {...props} {...detail} getError={getError} />
				)}
			/> */}
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(UserPage);
