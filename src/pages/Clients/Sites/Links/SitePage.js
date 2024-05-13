import React from "react";
import roles from "helpers/roles";
import Site from "pages/Clients/Sites";
import { routeList } from "./routeList";
import RoleRoute from "components/HOC/RoleRoute";
import { Route, Routes } from "react-router-dom";
import SiteDetail from "../SiteDetail/SiteDetailsScreen";

export default function SitePage() {
	return (
		<Site>
			<Routes>
				{routeList.map(({ id, ...route }) => (
					<Route
						key={id}
						path={route.path}
						element={
							<RoleRoute
								condition={route?.condition}
								roles={[roles.siteUser, roles.clientAdmin]}
							>
								<route.element />
							</RoleRoute>
						}
					/>
				))}
			</Routes>
		</Site>
	);
}
