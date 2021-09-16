import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { clientDetailPath, clientListPath } from "helpers/routePaths";
import ClientList from "routes/Clients/ClientList/ClientList";
import ClientDetailScreen from "routes/Clients/ClientDetailScreen";
import Client from "..";

export default function ClientPage() {
	return (
		<Suspense>
			<Switch>
				<Client>
					<Route path={clientListPath} exact>
						<ClientList />
					</Route>
					<Route path={clientDetailPath} exact>
						<ClientDetailScreen />
					</Route>
				</Client>
			</Switch>
		</Suspense>
	);
}
