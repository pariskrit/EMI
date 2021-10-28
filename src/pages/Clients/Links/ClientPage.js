import React from "react";
import { clientDetailPath, clientsPath } from "helpers/routePaths";
import ClientList from "pages/Clients/ClientList/ClientList";
import Client from "..";
import ClientDetails from "../ClientDetailScreen/ClientDetails";
import ProtectedRoute from "components/HOC/ProtectedRoute";

export default function ClientPage() {
	return (
		<Client>
			<ProtectedRoute path={clientsPath} exact>
				<ClientList />
			</ProtectedRoute>
			<ProtectedRoute path={clientDetailPath} exact>
				<ClientDetails />
			</ProtectedRoute>
		</Client>
	);
}
