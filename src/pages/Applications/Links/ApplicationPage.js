import React from "react";
import Applications from "..";
import { routeList } from "./routeList";
import RoleRoute from "components/HOC/RoleRoute";
import roles from "helpers/roles";
import { Route, Routes } from "react-router-dom";
import ApplicationList from "../ApplicationList/ApplicationList";
import Application from "../Application/Application";

export default function ApplicationPage() {
	return (
		<Applications>
			<Routes>
				<Route element={<RoleRoute roles={[roles.superAdmin]} />}>
					<Route index element={<ApplicationList />} />
					<Route
						path={`:id/*`}
						element={
							<Routes>
								<Route index element={<Application />} />

								{routeList.map(({ id, path, index, ...route }) => (
									<Route key={id} path={path} element={<route.component />} />
								))}
							</Routes>
						}
					/>
				</Route>
			</Routes>
		</Applications>
	);
}
