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
		{ id: 6, name: customCaptions?.model, minWidth: "230px" },
		{ id: 7, name: `${customCaptions?.asset} Number`, width: "40px" },
		{ id: 10, name: customCaptions?.defectType, width: "152px" },
		{
			id: 11,
			name: `${customCaptions?.defect} Details`,
			width: "500px",
			minWidth: "500px",
		},
		{ id: 12, name: "Created Date", minWidth: "170px" },
		{ id: 13, name: "Created By", minWidth: "170px" },
		{ id: 14, name: "Notification Number", width: "60px" },
		{ id: 15, name: customCaptions?.stage, minWidth: "250px" },
		{ id: 16, name: customCaptions?.zone, minWidth: "250px" },
		{ id: 17, name: customCaptions?.task, minWidth: "250px" },
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
