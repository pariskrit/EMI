import React from "react";
// import { Route } from "react-router";
import { clientDetailPath, clientsPath } from "helpers/routePaths";
import ClientList from "pages/Clients/ClientList/ClientList";
import Client from "..";
import ClientDetails from "../ClientDetailScreen/ClientDetails";
import AccessRoute from "components/HOC/AccessRoute";

export default function ClientPage() {
	return (
		<Client>
			<AccessRoute path={clientsPath} exact component={ClientList} />
			<AccessRoute path={clientDetailPath} exact component={ClientDetails} />
		</Client>
	);
}
