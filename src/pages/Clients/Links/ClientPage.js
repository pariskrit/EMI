import React from "react";
import { Route } from "react-router";
import { clientDetailPath, clientsPath } from "helpers/routePaths";
import ClientList from "pages/Clients/ClientList/ClientList";
import Client from "..";
import ClientDetails from "../ClientDetailScreen/ClientDetails";
import RoleRoute from "components/HOC/RoleRoute";

export default function ClientPage({ location }) {
	return (
		<Client>
			<RoleRoute
				roles={["Super Admin"]}
				location={location}
				path={clientsPath}
				exact
			>
				<ClientList />
			</RoleRoute>

			<Route path={clientDetailPath} exact>
				<ClientDetails />
			</Route>
		</Client>
	);
}
