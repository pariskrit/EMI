import React from "react";
import { Route } from "react-router-dom";
import UserPage from "./UserPage";
import UsersList from "../UsersList";
import { usersPath } from "helpers/routePaths";

export default function UsersPage() {
	return (
		<>
			<Route component={UsersList} exact path={usersPath} />
			<UserPage />
		</>
	);
}
