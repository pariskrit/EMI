import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import ColourConstants from "helpers/colourConstants";

export const FeedbackTableHeader = (customCaptions) => {
	return [
		{ id: 1, name: `${customCaptions?.feedback} Number`, width: "20px" },
		{
			id: 2,
			name: <ErrorIcon style={{ color: ColourConstants.activeLink }} />,
			width: "20px",
			disableSort: true,
		},
		{ id: 3, name: customCaptions?.feedbackStatus, width: "30px" },
		{ id: 5, name: customCaptions?.department },
		{ id: 6, name: customCaptions?.changeRequired, minWidth: "300px" },
		{ id: 7, name: `${customCaptions?.benefit}`, minWidth: "300px" },
		{ id: 10, name: customCaptions?.asset, width: "152px" },
		{ id: 12, name: "Created Date", minWidth: "170px" },
		{ id: 13, name: "Created By", minWidth: "170px" },
		{ id: 14, name: `Assign ${customCaptions?.position}`, width: "60px" },
		{ id: 15, name: `Assign ${customCaptions?.user}`, minWidth: "170px" },
		{ id: 16, name: customCaptions?.classification, minWidth: "170px" },
		{ id: 17, name: customCaptions?.priority },
	];
};
export const FeedbackTableColumns = () => {
	return [
		"number",
		"safetyCritical",
		"feedbackStatusName",
		"siteDepartmentName",
		"changeRequired",
		"benefit",
		"siteAssetName",
		"createdDateTime",
		"displayName",
		"assignPositionName",
		"assignUserName",
		"feedbackClassificationName",
		"feedbackPriorityName",
	];
};
