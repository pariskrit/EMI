import {
	siteAssetPath,
	siteDepartmentPath,
	siteDetailPath,
	sitePath,
	siteLicenses,
} from "helpers/routePaths";
import SiteAsset from "pages/Clients/Sites/SiteAsset";
import SiteDepartmentsScreen from "pages/Clients/Sites/SiteDepartment/SiteDepartmentsScreen";
import SiteDetail from "pages/Clients/Sites/SiteDetail/SiteDetailsScreen";
import SiteLicenses from "pages/Clients/Sites/SiteLicenses";

export const routeList = [
	{
		id: 1,
		element: SiteDetail,
		path: siteDetailPath,
		condition: true,
	},
	{
		id: 2,
		element: SiteAsset,
		path: siteAssetPath,
	},
	{
		id: 3,
		element: SiteDepartmentsScreen,
		path: siteDepartmentPath,
		condition: true,
	},
	{
		id: 4,
		element: SiteLicenses,
		path: siteLicenses,
	},
];
