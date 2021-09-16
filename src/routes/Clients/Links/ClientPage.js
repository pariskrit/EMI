import React from "react";
import { Route } from "react-router-dom";
import { clientDetailPath, clientsPath } from "helpers/routePaths";
import ClientList from "routes/Clients/ClientList/ClientList";
import ClientDetailScreen from "routes/Clients/ClientDetailScreen";
import Client from "..";

export function ClientPage() {
	return (
		<Client>
			<Route path={clientsPath} exact>
				<ClientList />
			</Route>
			<Route path={clientDetailPath} exact>
				<ClientDetailScreen />
			</Route>
		</Client>
	);
}
