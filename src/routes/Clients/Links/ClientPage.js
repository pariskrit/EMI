import { clientDetailPath, clientsPath } from "helpers/routePaths";
import ClientList from "routes/Clients/ClientList/ClientList";
import ClientDetailScreen from "routes/Clients/ClientDetailScreen";
import Client from "..";
import {
	siteAssetPath,
	siteDepartmentPath,
	siteDetailPath,
	siteLocationPath,
	sitePath,
} from "helpers/routePaths";
import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import SiteAsset from "routes/Clients/Sites/SiteAsset";
import SiteDepartmentsScreen from "routes/Clients/Sites/SiteDepartment/SiteDepartmentsScreen";
import SiteDetail from "routes/Clients/Sites/SiteDetail/SiteDetailsScreen";
import SiteLocationsScreen from "routes/Clients/Sites/SiteLocations/SiteLocationsScreen";
import Site from "routes/Clients/Sites";

export default (
	<>
		<Client>
			<Route path={clientsPath} exact>
				<ClientList />
			</Route>
			<Route path={clientDetailPath} exact>
				<ClientDetailScreen />
			</Route>
		</Client>
		{/* <Route path={sitePath}>
			<Site>
				<Route path={sitePath + siteDetailPath}>
					<SiteDetail />
				</Route>
				<Route path={sitePath + siteAssetPath}>
					<SiteAsset />
				</Route>
				<Route path={sitePath + siteDepartmentPath}>
					<SiteDepartmentsScreen />
				</Route>
				<Route path={sitePath + siteLocationPath}>
					<SiteLocationsScreen />
				</Route>
			</Site>
		</Route> */}
	</>
);
