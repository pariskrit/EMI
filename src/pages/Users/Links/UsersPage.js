import React from "react";
import UserPage from "./UserPage";
import UsersList from "../UsersList";
import { usersPath } from "helpers/routePaths";
import AccessRoute from "components/HOC/AccessRoute";
import access from "helpers/access";

export default function UsersPage() {
	return (
		<>
			<AccessRoute
				component={UsersList}
				exact
				path={usersPath}
				access={access.userAccess}
			/>
			<UserPage />
		</>
	);
}
