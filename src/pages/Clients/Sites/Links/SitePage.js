import React from "react";
import { Route } from "react-router-dom";
import {
	siteAssetPath,
	siteDepartmentPath,
	siteDetailPath,
	siteLocationPath,
	sitePath,
} from "helpers/routePaths";
import SiteAsset from "pages/Clients/Sites/SiteAsset";
import SiteDepartmentsScreen from "pages/Clients/Sites/SiteDepartment/SiteDepartmentsScreen";
import SiteDetail from "pages/Clients/Sites/SiteDetail/SiteDetailsScreen";
import SiteLocationsScreen from "pages/Clients/Sites/SiteLocations/SiteLocationsScreen";
import Site from "pages/Clients/Sites";

export default function SitePage() {
	return (
		<Site>
			<Route path={sitePath + siteDetailPath} exact>
				<SiteDetail />
			</Route>
			<Route path={sitePath + siteAssetPath} exact>
				<SiteAsset />
			</Route>
			<Route path={sitePath + siteDepartmentPath} exact>
				<SiteDepartmentsScreen />
			</Route>
			<Route path={sitePath + siteLocationPath} exact>
				<SiteLocationsScreen />
			</Route>
		</Site>
	);
}
