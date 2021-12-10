import React from "react";
// import { Route } from "react-router";
import { clientDetailPath, clientsPath } from "helpers/routePaths";
import ClientList from "pages/Clients/ClientList/ClientList";
import Client from "..";
import ClientDetails from "../ClientDetailScreen/ClientDetails";
import RoleRoute from "components/HOC/RoleRoute";

export default function ClientPage() {
	return (
		<Client>
			<RoleRoute path={clientsPath} exact component={ClientList} />
			<RoleRoute path={clientDetailPath} exact component={ClientDetails} />
		</Client>
	);
}
