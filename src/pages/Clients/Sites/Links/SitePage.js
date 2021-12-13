import React from "react";
// import { Route } from "react-router-dom";
// import {
// 	siteAssetPath,
// 	siteDepartmentPath,
// 	siteDetailPath,
// 	siteLocationPath,
// 	sitePath,
// } from "helpers/routePaths";
// import SiteAsset from "pages/Clients/Sites/SiteAsset";
// import SiteDepartmentsScreen from "pages/Clients/Sites/SiteDepartment/SiteDepartmentsScreen";
// import SiteDetail from "pages/Clients/Sites/SiteDetail/SiteDetailsScreen";
// import SiteLocationsScreen from "pages/Clients/Sites/SiteLocations/SiteLocationsScreen";
import Site from "pages/Clients/Sites";
import { routeList } from "./routeList";
import AccessRoute from "components/HOC/AccessRoute";

export default function SitePage() {
	return (
		<Site>
			{routeList.map(({ id, ...route }) => (
				<AccessRoute key={id} {...route} exact />
			))}
		</Site>
	);
}
