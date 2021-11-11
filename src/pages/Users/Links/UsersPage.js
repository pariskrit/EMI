import React from "react";
import UserPage from "./UserPage";
import UsersList from "../UsersList";
import { Route } from "react-router-dom";
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
			{/* <Route path={userDetailPath} exact>
				<UserDetail />
			</Route> */}
			<UserPage />
			<Route path={userDetailPath} exact>
				<UserDetail />
			</Route>
		</>
	);
}
