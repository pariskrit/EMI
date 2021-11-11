import React from "react";
import UserPage from "./UserPage";
import UsersList from "../UsersList";
import { Route } from "react-router-dom";
import { usersPath } from "helpers/routePaths";

export default function UsersPage() {
	return (
		<>
			<Route path={usersPath} exact>
				<UsersList />
			</Route>
			<UserPage />
		</>
	);
}
