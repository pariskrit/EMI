import React from "react";
import { Route, Routes } from "react-router-dom";
import UsersList from "pages/Users/UsersList";

export default function UsersPage() {
	return (
		<Routes>
			<Route index element={<UsersList />} />
		</Routes>
	);
}
