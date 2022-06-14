import React from "react";
import SafteryCritical from "assets/icons/safety-critical.svg";

export const DefectTableHeader = (customCaptions) => {
	return [
		{ id: 1, name: `${customCaptions?.defect} Number`, width: "20px" },
		{
			id: 2,
			name: <img src={SafteryCritical} alt="saftery critical " />,
			width: "20px",
			disableSort: true,
		},
		{ id: 3, name: customCaptions?.riskRating, width: "30px" },
		{ id: 5, name: customCaptions?.defectStatus },
		{ id: 6, name: customCaptions?.model },
		{ id: 7, name: `${customCaptions?.asset} Number`, width: "40px" },
		{ id: 10, name: customCaptions?.defectType, width: "152px" },
		{
			id: 11,
			name: `${customCaptions?.defect} Details`,
			width: "500px",
			minWidth: "500px",
		},
		{ id: 12, name: "Created Date" },
		{ id: 13, name: "Created By" },
		{ id: 14, name: "Notification Number", width: "60px" },
		{ id: 15, name: customCaptions?.stage },
		{ id: 16, name: customCaptions?.zone },
		{ id: 17, name: customCaptions?.task },
	];
};
export const DefectTableColumns = () => {
	return [
		"number",
		"safetyCritical",
		"riskRatingName",
		"defectStatusName",
		"modelName",
		"siteAssetName",
		"defectTypeName",
		"details",
		"createdDateTime",
		"createdUserName",
		"workOrder",
		"stageName",
		"zoneName",
		"taskName",
	];
};
