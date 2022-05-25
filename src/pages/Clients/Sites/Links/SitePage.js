import React from "react";
import roles from "helpers/roles";
import Site from "pages/Clients/Sites";
import { routeList } from "./routeList";
import RoleRoute from "components/HOC/RoleRoute";

export default function SitePage() {
	return (
		<Site>
			{routeList.map(({ id, ...route }) => (
				<RoleRoute
					key={id}
					{...route}
					exact
					roles={[roles.superAdmin, roles.siteUser]}
				/>
			))}
		</Site>
	);
}
