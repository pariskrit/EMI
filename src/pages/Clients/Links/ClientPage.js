import React from "react";
import { clientDetailPath, clientsPath } from "helpers/routePaths";
import ClientList from "pages/Clients/ClientList/ClientList";
import Client from "..";
import ClientDetails from "../ClientDetailScreen/ClientDetails";
import RoleRoute from "components/HOC/RoleRoute";
import roles from "helpers/roles";

export default function ClientPage() {
	return (
		<Client>
			<RoleRoute
				path={clientsPath}
				exact
				component={ClientList}
				roles={[roles.superAdmin]}
			/>
			<RoleRoute
				path={clientDetailPath}
				exact
				component={ClientDetails}
				roles={[roles.superAdmin]}
			/>
		</Client>
	);
}
