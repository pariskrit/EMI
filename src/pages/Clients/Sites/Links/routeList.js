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

export const routeList = [
	{
		id: 1,
		component: SiteDetail,
		path: sitePath + siteDetailPath,
	},
	{
		id: 2,
		component: SiteAsset,
		path: sitePath + siteAssetPath,
	},
	{
		id: 3,
		component: SiteDepartmentsScreen,
		path: sitePath + siteDepartmentPath,
	},
	{
		id: 4,
		component: SiteLocationsScreen,
		path: sitePath + siteLocationPath,
	},
];
