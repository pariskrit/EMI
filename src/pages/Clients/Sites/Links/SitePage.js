import React from "react";
import Site from "pages/Clients/Sites";
import { routeList } from "./routeList";
import AccessRoute from "components/HOC/AccessRoute";
import roles from "helpers/roles";

export default function SitePage() {
	return (
		<Site>
			{routeList.map(({ id, ...route }) => (
				<AccessRoute key={id} {...route} exact user={roles.clientAdmin} />
			))}
		</Site>
	);
}
