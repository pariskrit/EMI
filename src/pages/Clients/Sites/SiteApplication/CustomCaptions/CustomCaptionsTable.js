import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TableStyle from "styles/application/TableStyle";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import ColourConstants from "helpers/colourConstants";
import CustomCaptionRow from "./CustomCaptionRow";

// Init styled components
const AT = TableStyle();

const useStyles = makeStyles({
	tableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackground,
		fontWeight: "bold",
	},
	rowWithRightRow: {
		borderRightColor: ColourConstants.tableBorder,
		borderRightStyle: "solid",
		borderRightWidth: 1,
	},
	headerRow: {
		width: "33%",
	},
});

const CustomCaptionsTable = ({
	data,
	defaultData,
	searchQuery,
	handleUpdateCustomCaption,
}) => {
	// Init hooks
	const classes = useStyles();

	// Init State
	const [searchedData, setSearchedData] = useState([]);

	// Data to render custom captions
	const customCaptionInputs = [
		{
			singularKey: "modelTemplateCC",
			singularValue: data.modelTemplateCC
				? data.modelTemplateCC
				: defaultData.modelTemplateCC,
			singularDefault: defaultData.modelTemplateCC || "Model Template",
			pluralKey: "modelTemplatePluralCC",
			pluralValue: data.modelTemplatePluralCC
				? data.modelTemplatePluralCC
				: defaultData.modelTemplatePluralCC,
			pluralDefault: "Model Templates",

			indents: 0,
		},

		{
			singularKey: "projectNumberCC",
			singularValue: data.projectNumberCC
				? data.projectNumberCC
				: defaultData.projectNumberCC,
			singularDefault: defaultData.projectNumberCC || "Project Number",
			pluralKey: "projectNumberPluralCC",
			pluralValue: data.projectNumberPluralCC
				? data.projectNumberPluralCC
				: defaultData.projectNumberPluralCC,
			pluralDefault: "Project Numbers",

			indents: 0,
		},

		{
			singularKey: "locationCC",
			singularValue: data.locationCC ? data.locationCC : defaultData.locationCC,
			singularDefault: defaultData.locationCC || "Location",
			pluralKey: "locationPluralCC",
			pluralValue: data.locationPluralCC
				? data.locationPluralCC
				: defaultData.locationPluralCC,
			pluralDefault: "Locations",

			indents: 0,
		},

		{
			singularKey: "stageCC",
			singularValue: data.stageCC ? data.stageCC : defaultData.stageCC,
			singularDefault: defaultData.stageCC || "Stage",
			pluralKey: "stagePluralCC",
			pluralValue: data.stagePluralCC
				? data.stagePluralCC
				: defaultData.stagePluralCC,
			pluralDefault: "Stages",

			indents: 0,
		},

		{
			singularKey: "zoneCC",
			singularValue: data.zoneCC ? data.zoneCC : defaultData.zoneCC,
			singularDefault: defaultData.zoneCC || "Zone",
			pluralKey: "zonePluralCC",
			pluralValue: data.zonePluralCC
				? data.zonePluralCC
				: defaultData.zonePluralCC,
			pluralDefault: "Zones",

			indents: 0,
		},

		{
			singularKey: "intervalCC",
			singularValue: data.intervalCC ? data.intervalCC : defaultData.intervalCC,
			singularDefault: defaultData.intervalCC || "Interval",
			pluralKey: "intervalPluralCC",
			pluralValue: data.intervalPluralCC
				? data.intervalPluralCC
				: defaultData.intervalPluralCC,
			pluralDefault: "Intervals",

			indents: 0,
		},

		{
			singularKey: "taskListNoCC",
			singularValue: data.taskListNoCC
				? data.taskListNoCC
				: defaultData.taskListNoCC,
			singularDefault: defaultData.taskListNoCC || "Task List Number",
			pluralKey: "taskListNoPluralCC",
			pluralValue: data.taskListNoPluralCC
				? data.taskListNoPluralCC
				: defaultData.taskListNoPluralCC,
			pluralDefault: "Task List Numbers",

			indents: 1,
		},

		{
			singularKey: "questionCC",
			singularValue: data.questionCC ? data.questionCC : defaultData.questionCC,
			singularDefault: defaultData.questionCC || "Question",
			pluralKey: "questionPluralCC",
			pluralValue: data.questionPluralCC
				? data.questionPluralCC
				: defaultData.questionPluralCC,
			pluralDefault: "Questions",

			indents: 0,
		},

		{
			singularKey: "taskCC",
			singularValue: data.taskCC ? data.taskCC : defaultData.taskCC,
			singularDefault: defaultData.taskCC || "Task",
			pluralKey: "taskPluralCC",
			pluralValue: data.taskPluralCC
				? data.taskPluralCC
				: defaultData.taskPluralCC,
			pluralDefault: "Tasks",

			indents: 0,
		},

		{
			singularKey: "actionRequiredCC",
			singularValue: data.actionRequiredCC
				? data.actionRequiredCC
				: defaultData.actionRequiredCC,
			singularDefault: defaultData.actionRequiredCC || "Action",
			pluralKey: "actionRequiredPluralCC",
			pluralValue: data.actionRequiredPluralCC
				? data.actionRequiredPluralCC
				: defaultData.actionRequiredPluralCC,
			pluralDefault: "Actions",

			indents: 1,
		},

		{
			singularKey: "operatingModeCC",
			singularValue: data.operatingModeCC
				? data.operatingModeCC
				: defaultData.operatingModeCC,
			singularDefault: defaultData.operatingModeCC || "Operating Mode",
			pluralKey: "operatingModePluralCC",
			pluralValue: data.operatingModePluralCC
				? data.operatingModePluralCC
				: defaultData.operatingModePluralCC,
			pluralDefault: "Operating Modes",

			indents: 1,
		},

		{
			singularKey: "systemCC",
			singularValue: data.systemCC ? data.systemCC : defaultData.systemCC,
			singularDefault: defaultData.systemCC || "System",
			pluralKey: "systemPluralCC",
			pluralValue: data.systemPluralCC
				? data.systemPluralCC
				: defaultData.systemPluralCC,
			pluralDefault: "Systems",

			indents: 1,
		},

		{
			singularKey: "safetyCriticalCC",
			singularValue: data.safetyCriticalCC
				? data.safetyCriticalCC
				: defaultData.safetyCriticalCC,
			singularDefault: defaultData.safetyCriticalCC || "Safety Critical",
			pluralKey: "safetyCriticalPluralCC",
			pluralValue: data.safetyCriticalPluralCC
				? data.safetyCriticalPluralCC
				: defaultData.safetyCriticalPluralCC,
			pluralDefault: "Safety Critical",

			indents: 1,
		},

		{
			singularKey: "partCC",
			singularValue: data.partCC ? data.partCC : defaultData.partCC,
			singularDefault: defaultData.partCC || "Part",
			pluralKey: "partPluralCC",
			pluralValue: data.partPluralCC
				? data.partPluralCC
				: defaultData.partPluralCC,
			pluralDefault: "Parts",

			indents: 1,
		},

		{
			singularKey: "partQuantityCC",
			singularValue: data.partQuantityCC
				? data.partQuantityCC
				: defaultData.partQuantityCC,
			singularDefault: defaultData.partQuantityCC || "Part Quantity",
			pluralKey: "partQuantityPluralCC",
			pluralValue: data.partQuantityPluralCC
				? data.partQuantityPluralCC
				: defaultData.partQuantityPluralCC,
			pluralDefault: "Part Quantities",

			indents: 2,
		},

		{
			singularKey: "partNameCC",
			singularValue: data.partNameCC ? data.partNameCC : defaultData.partNameCC,
			singularDefault: defaultData.partNameCC || "Part Name",
			pluralKey: "partNamePluralCC",
			pluralValue: data.partNamePluralCC
				? data.partNamePluralCC
				: defaultData.partNamePluralCC,
			pluralDefault: "Part Names",

			indents: 2,
		},

		{
			singularKey: "partDescriptionCC",
			singularValue: data.partDescriptionCC
				? data.partDescriptionCC
				: defaultData.partDescriptionCC,
			singularDefault: defaultData.partDescriptionCC || "Part Description",
			pluralKey: "partDescriptionPluralCC",
			pluralValue: data.partDescriptionPluralCC
				? data.partDescriptionPluralCC
				: defaultData.partDescriptionPluralCC,
			pluralDefault: "Part Descriptions",

			indents: 2,
		},

		{
			singularKey: "partStockNumberCC",
			singularValue: data.partStockNumberCC
				? data.partStockNumberCC
				: defaultData.partStockNumberCC,
			singularDefault: defaultData.partStockNumberCC || "Part Stock Number",
			pluralKey: "partStockNumberPluralCC",
			pluralValue: data.partStockNumberPluralCC
				? data.partStockNumberPluralCC
				: defaultData.partStockNumberPluralCC,
			pluralDefault: "Part Stock Numbers",

			indents: 2,
		},

		{
			singularKey: "toolCC",
			singularValue: data.toolCC ? data.toolCC : defaultData.toolCC,
			singularDefault: defaultData.toolCC || "Tool",
			pluralKey: "toolPluralCC",
			pluralValue: data.toolPluralCC
				? data.toolPluralCC
				: defaultData.toolPluralCC,
			pluralDefault: "Tools",

			indents: 1,
		},

		{
			singularKey: "toolQuantityCC",
			singularValue: data.toolQuantityCC
				? data.toolQuantityCC
				: defaultData.toolQuantityCC,
			singularDefault: defaultData.toolQuantityCC || "Tool Quantity",
			pluralKey: "toolQuantityPluralCC",
			pluralValue: data.toolQuantityPluralCC
				? data.toolQuantityPluralCC
				: defaultData.toolQuantityPluralCC,
			pluralDefault: "Tool Quantities",

			indents: 2,
		},

		{
			singularKey: "toolDescriptionCC",
			singularValue: data.toolDescriptionCC
				? data.toolDescriptionCC
				: defaultData.toolDescriptionCC,
			singularDefault: defaultData.toolDescriptionCC || "Tool Description",
			pluralKey: "toolDescriptionPluralCC",
			pluralValue: data.toolDescriptionPluralCC
				? data.toolDescriptionPluralCC
				: defaultData.toolDescriptionPluralCC,
			pluralDefault: "Tool Descriptions",

			indents: 2,
		},

		{
			singularKey: "lubricantCC",
			singularValue: data.lubricantCC
				? data.lubricantCC
				: defaultData.lubricantCC,
			singularDefault: defaultData.lubricantCC || "Lubricant",
			pluralKey: "lubricantPluralCC",
			pluralValue: data.lubricantPluralCC
				? data.lubricantPluralCC
				: defaultData.lubricantPluralCC,
			pluralDefault: "Lubricants",

			indents: 1,
		},

		{
			singularKey: "workbookCC",
			singularValue: data.workbookCC ? data.workbookCC : defaultData.workbookCC,
			singularDefault: defaultData.workbookCC || "Workbook",
			pluralKey: "workbookPluralCC",
			pluralValue: data.workbookPluralCC
				? data.workbookPluralCC
				: defaultData.workbookPluralCC,
			pluralDefault: "Workbooks",

			indents: 1,
		},

		{
			singularKey: "purposeCC",
			singularValue: data.purposeCC ? data.purposeCC : defaultData.purposeCC,
			singularDefault: defaultData.purposeCC || "Purpose",
			pluralKey: "purposePluralCC",
			pluralValue: data.purposePluralCC
				? data.purposePluralCC
				: defaultData.purposePluralCC,
			pluralDefault: "Purposes",

			indents: 2,
		},

		{
			singularKey: "procedureCC",
			singularValue: data.procedureCC
				? data.procedureCC
				: defaultData.procedureCC,
			singularDefault: defaultData.procedureCC || "Procedure",
			pluralKey: "procedurePluralCC",
			pluralValue: data.procedurePluralCC
				? data.procedurePluralCC
				: defaultData.procedurePluralCC,
			pluralDefault: "Procedures",

			indents: 2,
		},

		{
			singularKey: "possibleHazardsCC",
			singularValue: data.possibleHazardsCC
				? data.possibleHazardsCC
				: defaultData.possibleHazardsCC,
			singularDefault: defaultData.possibleHazardsCC || "Possible Hazard",
			pluralKey: "possibleHazardsPluralCC",
			pluralValue: data.possibleHazardsPluralCC
				? data.possibleHazardsPluralCC
				: defaultData.possibleHazardsPluralCC,
			pluralDefault: "Possible Hazards",

			indents: 2,
		},

		{
			singularKey: "additionalPPECC",
			singularValue: data.additionalPPECC
				? data.additionalPPECC
				: defaultData.additionalPPECC,
			singularDefault: defaultData.additionalPPECC || "Additional PPE",
			pluralKey: "additionalPPEPluralCC",
			pluralValue: data.additionalPPEPluralCC
				? data.additionalPPEPluralCC
				: defaultData.additionalPPEPluralCC,
			pluralDefault: "Additional PPEs",

			indents: 2,
		},

		{
			singularKey: "specificationCC",
			singularValue: data.specificationCC
				? data.specificationCC
				: defaultData.specificationCC,
			singularDefault: defaultData.specificationCC || "Specification",
			pluralKey: "specificationPluralCC",
			pluralValue: data.specificationPluralCC
				? data.specificationPluralCC
				: defaultData.specificationPluralCC,
			pluralDefault: "Specifications",

			indents: 2,
		},

		{
			singularKey: "contaminationControlsCC",
			singularValue: data.contaminationControlsCC
				? data.contaminationControlsCC
				: defaultData.contaminationControlsCC,
			singularDefault:
				defaultData.contaminationControlsCC || "Contamination Control",
			pluralKey: "contaminationControlsPluralCC",
			pluralValue: data.contaminationControlsPluralCC
				? data.contaminationControlsPluralCC
				: defaultData.contaminationControlsPluralCC,
			pluralDefault: "Contamination Controls",

			indents: 2,
		},

		{
			singularKey: "otherInformationCC",
			singularValue: data.otherInformationCC
				? data.otherInformationCC
				: defaultData.otherInformationCC,
			singularDefault: defaultData.otherInformationCC || "Other Information",
			pluralKey: "otherInformationPluralCC",
			pluralValue: data.otherInformationPluralCC
				? data.otherInformationPluralCC
				: defaultData.otherInformationPluralCC,
			pluralDefault: "Other Information",

			indents: 2,
		},

		{
			singularKey: "correctiveActionsCC",
			singularValue: data.correctiveActionsCC
				? data.correctiveActionsCC
				: defaultData.correctiveActionsCC,
			singularDefault: defaultData.correctiveActionsCC || "Corrective Action",
			pluralKey: "correctiveActionsPluralCC",
			pluralValue: data.correctiveActionsPluralCC
				? data.correctiveActionsPluralCC
				: defaultData.correctiveActionsPluralCC,
			pluralDefault: "Corrective Actions",

			indents: 2,
		},

		{
			singularKey: "isolationsCC",
			singularValue: data.isolationsCC
				? data.isolationsCC
				: defaultData.isolationsCC,
			singularDefault: defaultData.isolationsCC || "Isolation",
			pluralKey: "isolationsPluralCC",
			pluralValue: data.isolationsPluralCC
				? data.isolationsPluralCC
				: defaultData.isolationsPluralCC,
			pluralDefault: "Isolations",

			indents: 2,
		},

		{
			singularKey: "controlsCC",
			singularValue: data.controlsCC ? data.controlsCC : defaultData.controlsCC,
			singularDefault: defaultData.controlsCC || "Control",
			pluralKey: "controlsPluralCC",
			pluralValue: data.controlsPluralCC
				? data.controlsPluralCC
				: defaultData.controlsPluralCC,
			pluralDefault: "Controls",

			indents: 2,
		},

		{
			singularKey: "customField1CC",
			singularValue: data.customField1CC
				? data.customField1CC
				: defaultData.customField1CC,
			singularDefault: defaultData.customField1CC || "Custom Field 1",
			pluralKey: "customField1PluralCC",
			pluralValue: data.customField1PluralCC
				? data.customField1PluralCC
				: defaultData.customField1PluralCC,
			pluralDefault: "Custom Field 1",

			indents: 2,
		},

		{
			singularKey: "customField2CC",
			singularValue: data.customField2CC
				? data.customField2CC
				: defaultData.customField2CC,
			singularDefault: defaultData.customField2CC || "Custom Field 2",
			pluralKey: "customField2PluralCC",
			pluralValue: data.customField2PluralCC
				? data.customField2PluralCC
				: defaultData.customField2PluralCC,
			pluralDefault: "Custom Field 2",

			indents: 2,
		},

		{
			singularKey: "customField3CC",
			singularValue: data.customField3CC
				? data.customField3CC
				: defaultData.customField3CC,
			singularDefault: defaultData.customField3CC || "Custom Field 3",
			pluralKey: "customField3PluralCC",
			pluralValue: data.customField3PluralCC
				? data.customField3PluralCC
				: defaultData.customField3PluralCC,
			pluralDefault: "Custom Field 3",

			indents: 2,
		},

		{
			singularKey: "makeCC",
			singularValue: data.makeCC ? data.makeCC : defaultData.makeCC,
			singularDefault: defaultData.makeCC || "Make",
			pluralKey: "makePluralCC",
			pluralValue: data.makePluralCC
				? data.makePluralCC
				: defaultData.makePluralCC,
			pluralDefault: "Makes",

			indents: 0,
		},

		{
			singularKey: "modelCC",
			singularValue: data.modelCC ? data.modelCC : defaultData.modelCC,
			singularDefault: defaultData.modelCC || "Model",
			pluralKey: "modelPluralCC",
			pluralValue: data.modelPluralCC
				? data.modelPluralCC
				: defaultData.modelPluralCC,
			pluralDefault: "Models",

			indents: 0,
		},

		{
			singularKey: "modelTypeCC",
			singularValue: data.modelTypeCC
				? data.modelTypeCC
				: defaultData.modelTypeCC,
			singularDefault: defaultData.modelTypeCC || "Model Type",
			pluralKey: "modelTypePluralCC",
			pluralValue: data.modelTypePluralCC
				? data.modelTypePluralCC
				: defaultData.modelTypePluralCC,
			pluralDefault: "Model Types",

			indents: 0,
		},

		{
			singularKey: "developerNameCC",
			singularValue: data.developerNameCC
				? data.developerNameCC
				: defaultData.developerNameCC,
			singularDefault: defaultData.developerNameCC || "Developer Name",
			pluralKey: "developerNamePluralCC",
			pluralValue: data.developerNamePluralCC
				? data.developerNamePluralCC
				: defaultData.developerNamePluralCC,
			pluralDefault: "Developer Names",

			indents: 0,
		},

		{
			singularKey: "roleCC",
			singularValue: data.roleCC ? data.roleCC : defaultData.roleCC,
			singularDefault: defaultData.roleCC || "Role",
			pluralKey: "rolePluralCC",
			pluralValue: data.rolePluralCC
				? data.rolePluralCC
				: defaultData.rolePluralCC,
			pluralDefault: "Roles",

			indents: 0,
		},

		{
			singularKey: "tutorialCC",
			singularValue: data.tutorialCC ? data.tutorialCC : defaultData.tutorialCC,
			singularDefault: defaultData.tutorialCC || "Tutorial",
			pluralKey: "tutorialPluralCC",
			pluralValue: data.tutorialPluralCC
				? data.tutorialPluralCC
				: defaultData.tutorialPluralCC,
			pluralDefault: "Tutorials",

			indents: 0,
		},

		{
			singularKey: "feedbackCC",
			singularValue: data.feedbackCC ? data.feedbackCC : defaultData.feedbackCC,
			singularDefault: defaultData.feedbackCC || "Feedback",
			pluralKey: "feedbackPluralCC",
			pluralValue: data.feedbackPluralCC
				? data.feedbackPluralCC
				: defaultData.feedbackPluralCC,
			pluralDefault: "Feedbacks",

			indents: 0,
		},

		{
			singularKey: "changeRequiredCC",
			singularValue: data.changeRequiredCC
				? data.changeRequiredCC
				: defaultData.changeRequiredCC,
			singularDefault: defaultData.changeRequiredCC || "Change Required",
			pluralKey: "changeRequiredPluralCC",
			pluralValue: data.changeRequiredPluralCC
				? data.changeRequiredPluralCC
				: defaultData.changeRequiredPluralCC,
			pluralDefault: "Changes Required",

			indents: 1,
		},

		{
			singularKey: "benefitCC",
			singularValue: data.benefitCC ? data.benefitCC : defaultData.benefitCC,
			singularDefault: defaultData.benefitCC || "Benefit",
			pluralKey: "benefitPluralCC",
			pluralValue: data.benefitPluralCC
				? data.benefitPluralCC
				: defaultData.benefitPluralCC,
			pluralDefault: "Benefits",

			indents: 1,
		},

		{
			singularKey: "classificationCC",
			singularValue: data.classificationCC
				? data.classificationCC
				: defaultData.classificationCC,
			singularDefault: defaultData.classificationCC || "Classification",
			pluralKey: "classificationPluralCC",
			pluralValue: data.classificationPluralCC
				? data.classificationPluralCC
				: defaultData.classificationPluralCC,
			pluralDefault: "Classifications",

			indents: 1,
		},

		{
			singularKey: "priorityCC",
			singularValue: data.priorityCC ? data.priorityCC : defaultData.priorityCC,
			singularDefault: defaultData.priorityCC || "Priority",
			pluralKey: "priorityPluralCC",
			pluralValue: data.priorityPluralCC
				? data.priorityPluralCC
				: defaultData.priorityPluralCC,
			pluralDefault: "Priorities",

			indents: 1,
		},

		{
			singularKey: "feedbackStatusCC",
			singularValue: data.feedbackStatusCC
				? data.feedbackStatusCC
				: defaultData.feedbackStatusCC,
			singularDefault: defaultData.feedbackStatusCC || "Feedback Status",
			pluralKey: "feedbackStatusPluralCC",
			pluralValue: data.feedbackStatusPluralCC
				? data.feedbackStatusPluralCC
				: defaultData.feedbackStatusPluralCC,
			pluralDefault: "Feedback Statues",

			indents: 1,
		},

		{
			singularKey: "userCC",
			singularValue: data.userCC ? data.userCC : defaultData.userCC,
			singularDefault: defaultData.userCC || "User",
			pluralKey: "userPluralCC",
			pluralValue: data.userPluralCC
				? data.userPluralCC
				: defaultData.userPluralCC,
			pluralDefault: "Users",

			indents: 0,
		},

		{
			singularKey: "positionCC",
			singularValue: data.positionCC ? data.positionCC : defaultData.positionCC,
			singularDefault: defaultData.positionCC || "Position",
			pluralKey: "positionPluralCC",
			pluralValue: data.positionPluralCC
				? data.positionPluralCC
				: defaultData.positionPluralCC,
			pluralDefault: "Positions",

			indents: 1,
		},

		{
			singularKey: "serviceCC",
			singularValue: data.serviceCC ? data.serviceCC : defaultData.serviceCC,
			singularDefault: defaultData.serviceCC || "Service",
			pluralKey: "servicePluralCC",
			pluralValue: data.servicePluralCC
				? data.servicePluralCC
				: defaultData.servicePluralCC,
			pluralDefault: "Services",

			indents: 0,
		},

		{
			singularKey: "serviceWorkOrderCC",
			singularValue: data.serviceWorkOrderCC
				? data.serviceWorkOrderCC
				: defaultData.serviceWorkOrderCC,
			singularDefault: defaultData.serviceWorkOrderCC || "Service Work Order",
			pluralKey: "serviceWorkOrderPluralCC",
			pluralValue: data.serviceWorkOrderPluralCC
				? data.serviceWorkOrderPluralCC
				: defaultData.serviceWorkOrderPluralCC,
			pluralDefault: "Service Work Orders",

			indents: 1,
		},

		{
			singularKey: "pauseReasonCC",
			singularValue: data.pauseReasonCC
				? data.pauseReasonCC
				: defaultData.pauseReasonCC,
			singularDefault: defaultData.pauseReasonCC || "Pause Reason",
			pluralKey: "pauseReasonPluralCC",
			pluralValue: data.pauseReasonPluralCC
				? data.pauseReasonPluralCC
				: defaultData.pauseReasonPluralCC,
			pluralDefault: "Pause Reasons",

			indents: 1,
		},

		{
			singularKey: "stopReasonCC",
			singularValue: data.stopReasonCC
				? data.stopReasonCC
				: defaultData.stopReasonCC,
			singularDefault: defaultData.stopReasonCC || "Stop Reason",
			pluralKey: "stopReasonPluralCC",
			pluralValue: data.stopReasonPluralCC
				? data.stopReasonPluralCC
				: defaultData.stopReasonPluralCC,
			pluralDefault: "Stop Reasons",

			indents: 1,
		},

		{
			singularKey: "skipReasonCC",
			singularValue: data.skipReasonCC
				? data.skipReasonCC
				: defaultData.skipReasonCC,
			singularDefault: defaultData.skipReasonCC || "Skip Reason",
			pluralKey: "skipReasonPluralCC",
			pluralValue: data.skipReasonPluralCC
				? data.skipReasonPluralCC
				: defaultData.skipReasonPluralCC,
			pluralDefault: "Skip Reasons",

			indents: 1,
		},

		{
			singularKey: "defectCC",
			singularValue: data.defectCC ? data.defectCC : defaultData.defectCC,
			singularDefault: defaultData.defectCC || "Defect",
			pluralKey: "defectPluralCC",
			pluralValue: data.defectPluralCC
				? data.defectPluralCC
				: defaultData.defectPluralCC,
			pluralDefault: "Defects",
			indents: 0,
		},

		{
			singularKey: "defectWorkOrderCC",
			singularValue: data.defectWorkOrderCC
				? data.defectWorkOrderCC
				: defaultData.defectWorkOrderCC,
			singularDefault: defaultData.defectWorkOrderCC || "Defect Work Order",
			pluralKey: "defectWorkOrderPluralCC",
			pluralValue: data.defectWorkOrderPluralCC
				? data.defectWorkOrderPluralCC
				: defaultData.defectWorkOrderPluralCC,
			pluralDefault: "Defect Work Orders",

			indents: 1,
		},

		{
			singularKey: "defectStatusCC",
			singularValue: data.defectStatusCC
				? data.defectStatusCC
				: defaultData.defectStatusCC,
			singularDefault: defaultData.defectStatusCC || "Defect Status",
			pluralKey: "defectStatusPluralCC",
			pluralValue: data.defectStatusPluralCC
				? data.defectStatusPluralCC
				: defaultData.defectStatusPluralCC,
			pluralDefault: "Defect Statues",

			indents: 1,
		},

		{
			singularKey: "defectTypeCC",
			singularValue: data.defectTypeCC
				? data.defectTypeCC
				: defaultData.defectTypeCC,
			singularDefault: defaultData.defectTypeCC || "Defect Type",
			pluralKey: "defectTypePluralCC",
			pluralValue: data.defectTypePluralCC
				? data.defectTypePluralCC
				: defaultData.defectTypePluralCC,
			pluralDefault: "Defect Types",

			indents: 1,
		},

		{
			singularKey: "typeCC",
			singularValue: data.typeCC ? data.typeCC : defaultData.typeCC,
			singularDefault: defaultData.typeCC || "Type",
			pluralKey: "typePluralCC",
			pluralValue: data.typePluralCC
				? data.typePluralCC
				: defaultData.typePluralCC,
			pluralDefault: "Types",

			indents: 1,
		},

		{
			singularKey: "riskRatingCC",
			singularValue: data.riskRatingCC
				? data.riskRatingCC
				: defaultData.riskRatingCC,
			singularDefault: defaultData.riskRatingCC || "Risk Rating",
			pluralKey: "riskRatingPluralCC",
			pluralValue: data.riskRatingPluralCC
				? data.riskRatingPluralCC
				: defaultData.riskRatingPluralCC,
			pluralDefault: "Risk Ratings",

			indents: 1,
		},

		{
			singularKey: "riskRatingActionCC",
			singularValue: data.riskRatingActionCC
				? data.riskRatingActionCC
				: defaultData.riskRatingActionCC,
			singularDefault: defaultData.riskRatingActionCC || "Risk Rating Action",
			pluralKey: "riskRatingActionPluralCC",
			pluralValue: data.riskRatingActionPluralCC
				? data.riskRatingActionPluralCC
				: defaultData.riskRatingActionPluralCC,
			pluralDefault: "Risk Rating Actions",

			indents: 2,
		},

		{
			singularKey: "riskRatingMatrixCC",
			singularValue: data.riskRatingMatrixCC
				? data.riskRatingMatrixCC
				: defaultData.riskRatingMatrixCC,
			singularDefault: defaultData.riskRatingMatrixCC || "Risk Rating Matrix",
			pluralKey: "riskRatingMatrixPluralCC",
			pluralValue: data.riskRatingMatrixPluralCC
				? data.riskRatingMatrixPluralCC
				: defaultData.riskRatingMatrixPluralCC,
			pluralDefault: "Risk Rating Matrices",
			indents: 1,
		},

		{
			singularKey: "departmentCC",
			singularValue: data.departmentCC
				? data.departmentCC
				: defaultData.departmentCC,
			singularDefault: defaultData.departmentCC || "Department",
			pluralKey: "departmentPluralCC",
			pluralValue: data.departmentPluralCC
				? data.departmentPluralCC
				: defaultData.departmentPluralCC,
			pluralDefault: "Departments",

			indents: 0,
		},

		{
			singularKey: "assetCC",
			singularValue: data.assetCC ? data.assetCC : defaultData.assetCC,
			singularDefault: defaultData.assetCC || "Asset",
			pluralKey: "assetPluralCC",
			pluralValue: data.assetPluralCC
				? data.assetPluralCC
				: defaultData.assetPluralCC,
			pluralDefault: "Assets",

			indents: 0,
		},

		{
			singularKey: "assetReferenceCC",
			singularValue: data.assetReferenceCC
				? data.assetReferenceCC
				: defaultData.assetReferenceCC,
			singularDefault: defaultData.assetReferenceCC || "Asset Reference",
			pluralKey: "assetReferencePluralCC",
			pluralValue: data.assetReferencePluralCC
				? data.assetReferencePluralCC
				: defaultData.assetReferencePluralCC,
			pluralDefault: "Asset References",

			indents: 1,
		},

		{
			singularKey: "assetPlannerGroupCC",
			singularValue: data.assetPlannerGroupCC
				? data.assetPlannerGroupCC
				: defaultData.assetPlannerGroupCC,
			singularDefault: defaultData.assetPlannerGroupCC || "Asset Planner Group",
			pluralKey: "assetPlannerGroupPluralCC",
			pluralValue: data.assetPlannerGroupPluralCC
				? data.assetPlannerGroupPluralCC
				: defaultData.assetPlannerGroupPluralCC,
			pluralDefault: "Asset Planner Groups",

			indents: 1,
		},

		{
			singularKey: "assetMainWorkCenterCC",
			singularValue: data.assetMainWorkCenterCC
				? data.assetMainWorkCenterCC
				: defaultData.assetMainWorkCenterCC,
			singularDefault:
				defaultData.assetMainWorkCenterCC || "Asset Main Work Center",
			pluralKey: "assetMainWorkCenterPluralCC",
			pluralValue: data.assetMainWorkCenterPluralCC
				? data.assetMainWorkCenterPluralCC
				: defaultData.assetMainWorkCenterPluralCC,
			pluralDefault: "Asset Main Work Centers",

			indents: 1,
		},
	];

	// Search side effect
	useEffect(() => {
		const handleSearch = () => {
			// Clearning state and returning if empty
			if (searchQuery === "") {
				setSearchedData([]);
				return;
			} else {
				// Searching fields
				const results = customCaptionInputs.filter((CC) => {
					return [
						CC.singularDefault,
						CC.singularValue,
						CC.pluralDefault,
						CC.pluralValue,
					].some((el) => el.toLowerCase().includes(searchQuery.toLowerCase()));
				});

				// Updating state
				setSearchedData(results);
				return;
			}
		};

		// Performing search
		handleSearch();
		// eslint-disable-next-line
	}, [searchQuery]);

	return (
		<div>
			<AT.TableContainer
				component={Paper}
				elevation={0}
				className="customCaptionsTableContainer"
			>
				<Table aria-label="Table">
					<AT.TableHead>
						<TableRow>
							<TableCell
								className={clsx(
									classes.headerRow,
									classes.tableHeadRow,
									classes.rowWithRightRow
								)}
							>
								<AT.CellContainer>Standard Caption</AT.CellContainer>
							</TableCell>

							<TableCell
								className={clsx(
									classes.headerRow,
									classes.tableHeadRow,
									classes.rowWithRightRow
								)}
							>
								<AT.CellContainer>
									Custom Caption (Singular Value)
								</AT.CellContainer>
							</TableCell>

							<TableCell
								className={clsx(classes.headerRow, classes.tableHeadRow)}
							>
								<AT.CellContainer>
									Custom Caption (Plural Value)
								</AT.CellContainer>
							</TableCell>
						</TableRow>
					</AT.TableHead>
					<TableBody>
						{(searchQuery === "" ? customCaptionInputs : searchedData).map(
							(CC) => (
								<CustomCaptionRow
									key={CC.singularKey}
									singularKey={CC.singularKey}
									singularValue={CC.singularValue}
									singularDefault={CC.singularDefault}
									pluralKey={CC.pluralKey}
									pluralValue={CC.pluralValue}
									pluralDefault={CC.pluralDefault}
									handleUpdateCustomCaption={handleUpdateCustomCaption}
									indents={CC.indents}
								/>
							)
						)}
					</TableBody>
				</Table>
			</AT.TableContainer>
		</div>
	);
};

export default CustomCaptionsTable;
