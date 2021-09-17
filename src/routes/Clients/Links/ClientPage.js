import React from "react";
import { Route } from "react-router-dom";
import { clientDetailPath, clientsPath } from "helpers/routePaths";
import ClientList from "routes/Clients/ClientList/ClientList";
import Client from "..";
import ClientDetails from "../ClientDetailScreen/ClientDetails";

export default function ClientPage() {
	return (
		<Client>
			<Route path={clientsPath} exact>
				<ClientList />
			</Route>
			<Route path={clientDetailPath} exact>
				<ClientDetails />
			</Route>
		</Client>
	);
}
