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
		{ id: 3, name: customCaptions?.model, minWidth: "230px" },
		{ id: 4, name: `${customCaptions?.asset}`, width: "40px" },
		{ id: 5, name: customCaptions?.defectStatus },
		{ id: 6, name: customCaptions?.interval, width: "30px" },
		{ id: 7, name: customCaptions?.stage, minWidth: "250px" },
		{ id: 8, name: customCaptions?.zone, minWidth: "250px" },
		{ id: 9, name: customCaptions?.task, minWidth: "250px" },
		{
			id: 10,
			name: `${customCaptions?.defect} Details`,
			width: "500px",
			minWidth: "500px",
		},
		{ id: 11, name: customCaptions?.riskRating, width: "30px" },

		{ id: 12, name: customCaptions?.defectType, width: "152px" },
		{ id: 13, name: "Created By", minWidth: "170px" },
		{ id: 14, name: "Created Date", minWidth: "170px" },
		{ id: 15, name: customCaptions?.serviceWorkOrder, minWidth: "60px" },
		{ id: 16, name: "Notification Number", width: "60px" },
	];
};
export const DefectTableColumns = () => {
	return [
		"number",
		"safetyCritical",
		"modelName",
		"siteAssetName",
		"defectStatusName",
		"intervalName",
		"stageName",
		"zoneName",
		"taskName",
		"details",
		"riskRatingName",
		"defectTypeName",
		"createdUserName",
		"createdDateTime",
		"serviceWorkOrder",
		"workOrder",
	];
};

export const DefectChipTypesConstants = (customCaptions) => [
	{ id: 0, type: "Undefined", caption: "Contains" },
	{ id: 1, type: "DefectStatusType", caption: null },
	{ id: 2, type: "DefectStatusID", caption: null },
	{ id: 3, type: "SiteDepartmentID", caption: null },
	{
		id: 4,
		type: "DefectRiskRatingID",
		caption: `${customCaptions?.riskRating ?? "Defect Risk Rating"}`,
	},
	{ id: 5, type: "ModelID", caption: `${customCaptions?.model ?? "Model"}` },
	{
		id: 6,
		type: "DefectSystemID",
		caption: `${customCaptions?.system ?? "System"}`,
	},
	{
		id: 7,
		type: "DefectTypeID",
		caption: ` ${customCaptions?.defectType ?? "Defect Type"}`,
	},
	{ id: 8, type: "NotificationRaised", caption: "NotificationRaised" },
	{
		id: 9,
		type: "SiteAssetID",
		caption: `${customCaptions?.asset ?? "Asset"}`,
	},
	{
		id: 10,
		type: "DefectWorkOrder",
		caption: `${customCaptions?.defectWorkOrder ?? "Defect Work Order"}`,
	},
	{
		id: 11,
		type: "ServiceWorkOrder",
		caption: `${customCaptions?.serviceWorkOrder ?? "Service Work Order"}`,
	},
];
