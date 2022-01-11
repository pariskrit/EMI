import React from "react";
// import { Route } from "react-router";
import { clientDetailPath, clientsPath } from "helpers/routePaths";
import ClientList from "pages/Clients/ClientList/ClientList";
import Client from "..";
import ClientDetails from "../ClientDetailScreen/ClientDetails";
import AccessRoute from "components/HOC/AccessRoute";
import roles from "helpers/roles";

export default function ClientPage() {
	return (
		<Client>
			<AccessRoute
				path={clientsPath}
				exact
				component={ClientList}
				user={roles.superAdmin}
			/>
			<AccessRoute
				path={clientDetailPath}
				exact
				component={ClientDetails}
				user={roles.superAdmin}
			/>
		</Client>
	);
}
