/**
 * NOTE: This is currently a helper. In production, this data may come from either the API
 * or can be hard coded. Probably not approproate as a helper function
 */
const userNavigation = () => {
	// Setting navigation links with correct application ID
	const navigation = [
		{
			name: "Details",
			main: "Details",
		},
		{
			name: "Sites",
			main: "Sites",
		},
		{
			name: "Service Access",
			main: "Service Access",
		},
	];

	return navigation;
};

export default userNavigation;
