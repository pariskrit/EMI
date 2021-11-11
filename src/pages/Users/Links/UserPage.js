import React from "react";
import { Route } from "react-router-dom";
import SingleComponent from "./SingleComponent";
import { userDetailPath, userProfilePath } from "helpers/routePaths";
import CommonUserComponent from "components/Modules/CommonUserComponent";

import differentUserAPIs from "helpers/differentUserAPIs";

const routes = [
	{
		id: 15,
		name: "Details",
		path: userDetailPath,
		component: CommonUserComponent,
		showHistory: true,
		showSwitch: true,
		showPasswordReset: true,
		api: differentUserAPIs.UserDetailsAPIs,
		title: "User Details",
	},
];

const UserPage = () => {
	return (
		<div>
			{routes.map((route) => (
				<Route key={route.id} path={route.path} exact>
					<SingleComponent {...route} />
				</Route>
			))}
		</div>
	);
};

export default UserPage;
