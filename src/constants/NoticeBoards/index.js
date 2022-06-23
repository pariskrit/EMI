export const NoticeBoardsTableHeader = (customCaptions) => {
	return [
		{ id: 1, name: `Name`, width: "25vw" },
		{
			id: 2,
			name: "Description",
			width: "25vw",
		},
		{ id: 3, name: customCaptions?.department, width: "25vw" },
		{ id: 4, name: "Expires", width: "25vw" },
	];
};
export const NoticeBoardsTableColumns = () => {
	return ["name", "description", "siteDepartmentName", "expiryDate"];
};
