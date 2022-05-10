import {
	userDetailSitePath,
	userModelAccess,
	usersPath,
} from "helpers/routePaths";

/**
 * NOTE: This is currently a helper. In production, this data may come from either the API
 * or can be hard coded. Probably not approproate as a helper function
 */
const userNavigation = (id) => {
	// Setting navigation links with correct application ID
	const userdetail = `/${id}`;
	const navigation = [
		{
			name: "Details",
			main: "Details",
			url: usersPath + userdetail,
		},
		{
			name: "Sites",
			main: "Sites",
			url: usersPath + userdetail + userDetailSitePath,
		},
		{
			name: "Model Access",
			main: "Model Access",
			url: usersPath + userdetail + userModelAccess,
		},
	];

	return navigation;
};

export default userNavigation;
