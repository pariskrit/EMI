import React from "react";
import UsersList from "../UsersList";
import UserDetail from "../UserDetail";
import { Route } from "react-router-dom";
import { usersPath, userDetailPath } from "helpers/routePaths";

export default function UsersPage() {
	return (
		<>
			<Route path={usersPath} exact>
				<UsersList />
			</Route>
			<Route path={userDetailPath} exact>
				<UserDetail />
			</Route>
		</>
	);
}
