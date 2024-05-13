import React from "react";
import { clientDetailPath, clientsPath, sitePath } from "helpers/routePaths";
import ClientList from "pages/Clients/ClientList/ClientList";
import Client from "pages/Clients";
import ClientDetails from "pages/Clients/ClientDetailScreen/ClientDetails";
import RoleRoute from "components/HOC/RoleRoute";
import roles from "helpers/roles";
import { Route, Routes } from "react-router-dom";
import SitePage from "../Sites/Links/SitePage";

export default function ClientPage() {
	return (
		<Client>
			<Routes>
				<Route element={<RoleRoute roles={[roles.superAdmin]} />}>
					<Route index element={<ClientList />} />
					<Route path={clientDetailPath} element={<ClientDetails />} />
				</Route>
				<Route
					path={"/app/client/:id"}
					element={<RoleRoute roles={[roles.clientAdmin]} />}
				>
					<Route path={"/app/client/:id"} element={<ClientDetails />} />
				</Route>
			</Routes>
			{/* <RoleRoute
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
			<AccessRoleRoute
				type={"role"}
				path={"/app/client/:id"}
				exact
				component={ClientDetails}
				roles={[roles.clientAdmin]}
			/> */}
		</Client>
	);
}
