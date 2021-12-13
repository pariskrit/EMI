import React from "react";
import SingleComponent from "./SingleComponent";
import { userDetailPath, userProfilePath } from "helpers/routePaths";
import CommonUserComponent from "components/Modules/CommonUserComponent";
import differentUserAPIs from "helpers/differentUserAPIs";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import AccessRoute from "components/HOC/AccessRoute";
import access from "helpers/access";

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
			{routes.map(({ id, path, ...route }) => (
				<AccessRoute
					access={access.userAccess}
					key={route.id}
					path={route.path}
					exact
					component={(props) => (
						<SingleComponent {...props} {...route} getError={getError} />
					)}
				/>
			))}
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(UserPage);
