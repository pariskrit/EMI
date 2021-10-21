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
			singularValue: data.modelTemplateCC || defaultData.modelTemplate,
			singularDefault: defaultData.modelTemplate || "Model Template",
			pluralKey: "modelTemplatePluralCC",
			pluralValue: data.modelTemplatePluralCC
				? data.modelTemplatePluralCC
				: defaultData.modelTemplatePlural,
			pluralDefault: "Model Templates",

			indents: 0,
		},

		{
			singularKey: "projectNumberCC",
			singularValue: data.projectNumberCC
				? data.projectNumberCC
				: defaultData.projectNumber,
			singularDefault: defaultData.projectNumber || "Project Number",
			pluralKey: "projectNumberPluralCC",
			pluralValue: data.projectNumberPluralCC
				? data.projectNumberPluralCC
				: defaultData.projectNumberPlural,
			pluralDefault: "Project Numbers",

			indents: 0,
		},

		{
			singularKey: "locationCC",
			singularValue: data.locationCC ? data.locationCC : defaultData.location,
			singularDefault: defaultData.location || "Location",
			pluralKey: "locationPluralCC",
			pluralValue: data.locationPluralCC
				? data.locationPluralCC
				: defaultData.locationPlural,
			pluralDefault: "Locations",

			indents: 0,
		},

		{
			singularKey: "stageCC",
			singularValue: data.stageCC ? data.stageCC : defaultData.stage,
			singularDefault: defaultData.stage || "Stage",
			pluralKey: "stagePluralCC",
			pluralValue: data.stagePluralCC
				? data.stagePluralCC
				: defaultData.stagePlural,
			pluralDefault: "Stages",

			indents: 0,
		},

		{
			singularKey: "zoneCC",
			singularValue: data.zoneCC ? data.zoneCC : defaultData.zone,
			singularDefault: defaultData.zone || "Zone",
			pluralKey: "zonePluralCC",
			pluralValue: data.zonePluralCC
				? data.zonePluralCC
				: defaultData.zonePlural,
			pluralDefault: "Zones",

			indents: 0,
		},

		{
			singularKey: "intervalCC",
			singularValue: data.intervalCC ? data.intervalCC : defaultData.interval,
			singularDefault: defaultData.interval || "Interval",
			pluralKey: "intervalPluralCC",
			pluralValue: data.intervalPluralCC
				? data.intervalPluralCC
				: defaultData.intervalPlural,
			pluralDefault: "Intervals",

			indents: 0,
		},

		{
			singularKey: "taskListNoCC",
			singularValue: data.taskListNoCC
				? data.taskListNoCC
				: defaultData.taskListNo,
			singularDefault: defaultData.taskListNo || "Task List Number",
			pluralKey: "taskListNoPluralCC",
			pluralValue: data.taskListNoPluralCC
				? data.taskListNoPluralCC
				: defaultData.taskListNoPlural,
			pluralDefault: "Task List Numbers",

			indents: 1,
		},

		{
			singularKey: "questionCC",
			singularValue: data.questionCC ? data.questionCC : defaultData.question,
			singularDefault: defaultData.question || "Question",
			pluralKey: "questionPluralCC",
			pluralValue: data.questionPluralCC
				? data.questionPluralCC
				: defaultData.questionPlural,
			pluralDefault: "Questions",

			indents: 0,
		},

		{
			singularKey: "taskCC",
			singularValue: data.taskCC ? data.taskCC : defaultData.task,
			singularDefault: defaultData.task || "Task",
			pluralKey: "taskPluralCC",
			pluralValue: data.taskPluralCC
				? data.taskPluralCC
				: defaultData.taskPlural,
			pluralDefault: "Tasks",

			indents: 0,
		},

		{
			singularKey: "actionRequiredCC",
			singularValue: data.actionRequiredCC
				? data.actionRequiredCC
				: defaultData.actionRequired,
			singularDefault: defaultData.actionRequired || "Action",
			pluralKey: "actionRequiredPluralCC",
			pluralValue: data.actionRequiredPluralCC
				? data.actionRequiredPluralCC
				: defaultData.actionRequiredPlural,
			pluralDefault: "Actions",

			indents: 1,
		},

		{
			singularKey: "operatingModeCC",
			singularValue: data.operatingModeCC
				? data.operatingModeCC
				: defaultData.operatingMode,
			singularDefault: defaultData.operatingMode || "Operating Mode",
			pluralKey: "operatingModePluralCC",
			pluralValue: data.operatingModePluralCC
				? data.operatingModePluralCC
				: defaultData.operatingModePlural,
			pluralDefault: "Operating Modes",

			indents: 1,
		},

		{
			singularKey: "systemCC",
			singularValue: data.systemCC ? data.systemCC : defaultData.system,
			singularDefault: defaultData.system || "System",
			pluralKey: "systemPluralCC",
			pluralValue: data.systemPluralCC
				? data.systemPluralCC
				: defaultData.systemPlural,
			pluralDefault: "Systems",

			indents: 1,
		},

		{
			singularKey: "safetyCriticalCC",
			singularValue: data.safetyCriticalCC
				? data.safetyCriticalCC
				: defaultData.safetyCritical,
			singularDefault: defaultData.safetyCritical || "Safety Critical",
			pluralKey: "safetyCriticalPluralCC",
			pluralValue: data.safetyCriticalPluralCC
				? data.safetyCriticalPluralCC
				: defaultData.safetyCriticalPlural,
			pluralDefault: "Safety Critical",

			indents: 1,
		},

		{
			singularKey: "partCC",
			singularValue: data.partCC ? data.partCC : defaultData.part,
			singularDefault: defaultData.part || "Part",
			pluralKey: "partPluralCC",
			pluralValue: data.partPluralCC
				? data.partPluralCC
				: defaultData.partPlural,
			pluralDefault: "Parts",

			indents: 1,
		},

		{
			singularKey: "partQuantityCC",
			singularValue: data.partQuantityCC
				? data.partQuantityCC
				: defaultData.partQuantity,
			singularDefault: defaultData.partQuantity || "Part Quantity",
			pluralKey: "partQuantityPluralCC",
			pluralValue: data.partQuantityPluralCC
				? data.partQuantityPluralCC
				: defaultData.partQuantityPlural,
			pluralDefault: "Part Quantities",

			indents: 2,
		},

		{
			singularKey: "partNameCC",
			singularValue: data.partNameCC ? data.partNameCC : defaultData.partName,
			singularDefault: defaultData.partName || "Part Name",
			pluralKey: "partNamePluralCC",
			pluralValue: data.partNamePluralCC
				? data.partNamePluralCC
				: defaultData.partNamePlural,
			pluralDefault: "Part Names",

			indents: 2,
		},

		{
			singularKey: "partDescriptionCC",
			singularValue: data.partDescriptionCC
				? data.partDescriptionCC
				: defaultData.partDescription,
			singularDefault: defaultData.partDescription || "Part Description",
			pluralKey: "partDescriptionPluralCC",
			pluralValue: data.partDescriptionPluralCC
				? data.partDescriptionPluralCC
				: defaultData.partDescriptionPlural,
			pluralDefault: "Part Descriptions",

			indents: 2,
		},

		{
			singularKey: "partStockNumberCC",
			singularValue: data.partStockNumberCC
				? data.partStockNumberCC
				: defaultData.partStockNumber,
			singularDefault: defaultData.partStockNumber || "Part Stock Number",
			pluralKey: "partStockNumberPluralCC",
			pluralValue: data.partStockNumberPluralCC
				? data.partStockNumberPluralCC
				: defaultData.partStockNumberPlural,
			pluralDefault: "Part Stock Numbers",

			indents: 2,
		},

		{
			singularKey: "toolCC",
			singularValue: data.toolCC ? data.toolCC : defaultData.tool,
			singularDefault: defaultData.tool || "Tool",
			pluralKey: "toolPluralCC",
			pluralValue: data.toolPluralCC
				? data.toolPluralCC
				: defaultData.toolPlural,
			pluralDefault: "Tools",

			indents: 1,
		},

		{
			singularKey: "toolQuantityCC",
			singularValue: data.toolQuantityCC
				? data.toolQuantityCC
				: defaultData.toolQuantity,
			singularDefault: defaultData.toolQuantity || "Tool Quantity",
			pluralKey: "toolQuantityPluralCC",
			pluralValue: data.toolQuantityPluralCC
				? data.toolQuantityPluralCC
				: defaultData.toolQuantityPlural,
			pluralDefault: "Tool Quantities",

			indents: 2,
		},

		{
			singularKey: "toolDescriptionCC",
			singularValue: data.toolDescriptionCC
				? data.toolDescriptionCC
				: defaultData.toolDescription,
			singularDefault: defaultData.toolDescription || "Tool Description",
			pluralKey: "toolDescriptionPluralCC",
			pluralValue: data.toolDescriptionPluralCC
				? data.toolDescriptionPluralCC
				: defaultData.toolDescriptionPlural,
			pluralDefault: "Tool Descriptions",

			indents: 2,
		},

		{
			singularKey: "lubricantCC",
			singularValue: data.lubricantCC
				? data.lubricantCC
				: defaultData.lubricant,
			singularDefault: defaultData.lubricant || "Lubricant",
			pluralKey: "lubricantPluralCC",
			pluralValue: data.lubricantPluralCC
				? data.lubricantPluralCC
				: defaultData.lubricantPlural,
			pluralDefault: "Lubricants",

			indents: 1,
		},

		{
			singularKey: "workbookCC",
			singularValue: data.workbookCC ? data.workbookCC : defaultData.workbook,
			singularDefault: defaultData.workbook || "Workbook",
			pluralKey: "workbookPluralCC",
			pluralValue: data.workbookPluralCC
				? data.workbookPluralCC
				: defaultData.workbookPlural,
			pluralDefault: "Workbooks",

			indents: 1,
		},

		{
			singularKey: "purposeCC",
			singularValue: data.purposeCC ? data.purposeCC : defaultData.purpose,
			singularDefault: defaultData.purpose || "Purpose",
			pluralKey: "purposePluralCC",
			pluralValue: data.purposePluralCC
				? data.purposePluralCC
				: defaultData.purposePlural,
			pluralDefault: "Purposes",

			indents: 2,
		},

		{
			singularKey: "procedureCC",
			singularValue: data.procedureCC
				? data.procedureCC
				: defaultData.procedure,
			singularDefault: defaultData.procedure || "Procedure",
			pluralKey: "procedurePluralCC",
			pluralValue: data.procedurePluralCC
				? data.procedurePluralCC
				: defaultData.procedurePlural,
			pluralDefault: "Procedures",

			indents: 2,
		},

		{
			singularKey: "possibleHazardsCC",
			singularValue: data.possibleHazardsCC
				? data.possibleHazardsCC
				: defaultData.possibleHazards,
			singularDefault: defaultData.possibleHazards || "Possible Hazard",
			pluralKey: "possibleHazardsPluralCC",
			pluralValue: data.possibleHazardsPluralCC
				? data.possibleHazardsPluralCC
				: defaultData.possibleHazardsPlural,
			pluralDefault: "Possible Hazards",

			indents: 2,
		},

		{
			singularKey: "additionalPPECC",
			singularValue: data.additionalPPECC
				? data.additionalPPECC
				: defaultData.additionalPPE,
			singularDefault: defaultData.additionalPPE || "Additional PPE",
			pluralKey: "additionalPPEPluralCC",
			pluralValue: data.additionalPPEPluralCC
				? data.additionalPPEPluralCC
				: defaultData.additionalPPEPlural,
			pluralDefault: "Additional PPEs",

			indents: 2,
		},

		{
			singularKey: "specificationCC",
			singularValue: data.specificationCC
				? data.specificationCC
				: defaultData.specification,
			singularDefault: defaultData.specification || "Specification",
			pluralKey: "specificationPluralCC",
			pluralValue: data.specificationPluralCC
				? data.specificationPluralCC
				: defaultData.specificationPlural,
			pluralDefault: "Specifications",

			indents: 2,
		},

		{
			singularKey: "contaminationControlsCC",
			singularValue: data.contaminationControlsCC
				? data.contaminationControlsCC
				: defaultData.contaminationControls,
			singularDefault:
				defaultData.contaminationControls || "Contamination Control",
			pluralKey: "contaminationControlsPluralCC",
			pluralValue: data.contaminationControlsPluralCC
				? data.contaminationControlsPluralCC
				: defaultData.contaminationControlsPlural,
			pluralDefault: "Contamination Controls",

			indents: 2,
		},

		{
			singularKey: "otherInformationCC",
			singularValue: data.otherInformationCC
				? data.otherInformationCC
				: defaultData.otherInformation,
			singularDefault: defaultData.otherInformation || "Other Information",
			pluralKey: "otherInformationPluralCC",
			pluralValue: data.otherInformationPluralCC
				? data.otherInformationPluralCC
				: defaultData.otherInformationPlural,
			pluralDefault: "Other Information",

			indents: 2,
		},

		{
			singularKey: "correctiveActionsCC",
			singularValue: data.correctiveActionsCC
				? data.correctiveActionsCC
				: defaultData.correctiveActions,
			singularDefault: defaultData.correctiveActions || "Corrective Action",
			pluralKey: "correctiveActionsPluralCC",
			pluralValue: data.correctiveActionsPluralCC
				? data.correctiveActionsPluralCC
				: defaultData.correctiveActionsPlural,
			pluralDefault: "Corrective Actions",

			indents: 2,
		},

		{
			singularKey: "isolationsCC",
			singularValue: data.isolationsCC
				? data.isolationsCC
				: defaultData.isolations,
			singularDefault: defaultData.isolations || "Isolation",
			pluralKey: "isolationsPluralCC",
			pluralValue: data.isolationsPluralCC
				? data.isolationsPluralCC
				: defaultData.isolationsPlural,
			pluralDefault: "Isolations",

			indents: 2,
		},

		{
			singularKey: "controlsCC",
			singularValue: data.controlsCC ? data.controlsCC : defaultData.controls,
			singularDefault: defaultData.controls || "Control",
			pluralKey: "controlsPluralCC",
			pluralValue: data.controlsPluralCC
				? data.controlsPluralCC
				: defaultData.controlsPlural,
			pluralDefault: "Controls",

			indents: 2,
		},

		{
			singularKey: "customField1CC",
			singularValue: data.customField1CC
				? data.customField1CC
				: defaultData.customField1,
			singularDefault: defaultData.customField1 || "Custom Field 1",
			pluralKey: "customField1PluralCC",
			pluralValue: data.customField1PluralCC
				? data.customField1PluralCC
				: defaultData.customField1Plural,
			pluralDefault: "Custom Field 1",

			indents: 2,
		},

		{
			singularKey: "customField2CC",
			singularValue: data.customField2CC
				? data.customField2CC
				: defaultData.customField2,
			singularDefault: defaultData.customField2 || "Custom Field 2",
			pluralKey: "customField2PluralCC",
			pluralValue: data.customField2PluralCC
				? data.customField2PluralCC
				: defaultData.customField2Plural,
			pluralDefault: "Custom Field 2",

			indents: 2,
		},

		{
			singularKey: "customField3CC",
			singularValue: data.customField3CC
				? data.customField3CC
				: defaultData.customField3,
			singularDefault: defaultData.customField3 || "Custom Field 3",
			pluralKey: "customField3PluralCC",
			pluralValue: data.customField3PluralCC
				? data.customField3PluralCC
				: defaultData.customField3Plural,
			pluralDefault: "Custom Field 3",

			indents: 2,
		},

		{
			singularKey: "makeCC",
			singularValue: data.makeCC ? data.makeCC : defaultData.make,
			singularDefault: defaultData.make || "Make",
			pluralKey: "makePluralCC",
			pluralValue: data.makePluralCC
				? data.makePluralCC
				: defaultData.makePlural,
			pluralDefault: "Makes",

			indents: 0,
		},

		{
			singularKey: "modelCC",
			singularValue: data.modelCC ? data.modelCC : defaultData.model,
			singularDefault: defaultData.model || "Model",
			pluralKey: "modelPluralCC",
			pluralValue: data.modelPluralCC
				? data.modelPluralCC
				: defaultData.modelPlural,
			pluralDefault: "Models",

			indents: 0,
		},

		{
			singularKey: "modelTypeCC",
			singularValue: data.modelTypeCC
				? data.modelTypeCC
				: defaultData.modelType,
			singularDefault: defaultData.modelType || "Model Type",
			pluralKey: "modelTypePluralCC",
			pluralValue: data.modelTypePluralCC
				? data.modelTypePluralCC
				: defaultData.modelTypePlural,
			pluralDefault: "Model Types",

			indents: 0,
		},

		{
			singularKey: "developerNameCC",
			singularValue: data.developerNameCC
				? data.developerNameCC
				: defaultData.developerName,
			singularDefault: defaultData.developerName || "Developer Name",
			pluralKey: "developerNamePluralCC",
			pluralValue: data.developerNamePluralCC
				? data.developerNamePluralCC
				: defaultData.developerNamePlural,
			pluralDefault: "Developer Names",

			indents: 0,
		},

		{
			singularKey: "roleCC",
			singularValue: data.roleCC ? data.roleCC : defaultData.role,
			singularDefault: defaultData.role || "Role",
			pluralKey: "rolePluralCC",
			pluralValue: data.rolePluralCC
				? data.rolePluralCC
				: defaultData.rolePlural,
			pluralDefault: "Roles",

			indents: 0,
		},

		{
			singularKey: "tutorialCC",
			singularValue: data.tutorialCC ? data.tutorialCC : defaultData.tutorial,
			singularDefault: defaultData.tutorial || "Tutorial",
			pluralKey: "tutorialPluralCC",
			pluralValue: data.tutorialPluralCC
				? data.tutorialPluralCC
				: defaultData.tutorialPlural,
			pluralDefault: "Tutorials",

			indents: 0,
		},

		{
			singularKey: "feedbackCC",
			singularValue: data.feedbackCC ? data.feedbackCC : defaultData.feedback,
			singularDefault: defaultData.feedback || "Feedback",
			pluralKey: "feedbackPluralCC",
			pluralValue: data.feedbackPluralCC
				? data.feedbackPluralCC
				: defaultData.feedbackPlural,
			pluralDefault: "Feedbacks",

			indents: 0,
		},

		{
			singularKey: "changeRequiredCC",
			singularValue: data.changeRequiredCC
				? data.changeRequiredCC
				: defaultData.changeRequired,
			singularDefault: defaultData.changeRequired || "Change Required",
			pluralKey: "changeRequiredPluralCC",
			pluralValue: data.changeRequiredPluralCC
				? data.changeRequiredPluralCC
				: defaultData.changeRequiredPlural,
			pluralDefault: "Changes Required",

			indents: 1,
		},

		{
			singularKey: "benefitCC",
			singularValue: data.benefitCC ? data.benefitCC : defaultData.benefit,
			singularDefault: defaultData.benefit || "Benefit",
			pluralKey: "benefitPluralCC",
			pluralValue: data.benefitPluralCC
				? data.benefitPluralCC
				: defaultData.benefitPlural,
			pluralDefault: "Benefits",

			indents: 1,
		},

		{
			singularKey: "classificationCC",
			singularValue: data.classificationCC
				? data.classificationCC
				: defaultData.classification,
			singularDefault: defaultData.classification || "Classification",
			pluralKey: "classificationPluralCC",
			pluralValue: data.classificationPluralCC
				? data.classificationPluralCC
				: defaultData.classificationPlural,
			pluralDefault: "Classifications",

			indents: 1,
		},

		{
			singularKey: "priorityCC",
			singularValue: data.priorityCC ? data.priorityCC : defaultData.priority,
			singularDefault: defaultData.priority || "Priority",
			pluralKey: "priorityPluralCC",
			pluralValue: data.priorityPluralCC
				? data.priorityPluralCC
				: defaultData.priorityPlural,
			pluralDefault: "Priorities",

			indents: 1,
		},

		{
			singularKey: "feedbackStatusCC",
			singularValue: data.feedbackStatusCC
				? data.feedbackStatusCC
				: defaultData.feedbackStatus,
			singularDefault: defaultData.feedbackStatus || "Feedback Status",
			pluralKey: "feedbackStatusPluralCC",
			pluralValue: data.feedbackStatusPluralCC
				? data.feedbackStatusPluralCC
				: defaultData.feedbackStatusPlural,
			pluralDefault: "Feedback Statues",

			indents: 1,
		},

		{
			singularKey: "userCC",
			singularValue: data.userCC ? data.userCC : defaultData.user,
			singularDefault: defaultData.user || "User",
			pluralKey: "userPluralCC",
			pluralValue: data.userPluralCC
				? data.userPluralCC
				: defaultData.userPlural,
			pluralDefault: "Users",

			indents: 0,
		},

		{
			singularKey: "positionCC",
			singularValue: data.positionCC ? data.positionCC : defaultData.position,
			singularDefault: defaultData.position || "Position",
			pluralKey: "positionPluralCC",
			pluralValue: data.positionPluralCC
				? data.positionPluralCC
				: defaultData.positionPlural,
			pluralDefault: "Positions",

			indents: 1,
		},

		{
			singularKey: "serviceCC",
			singularValue: data.serviceCC ? data.serviceCC : defaultData.service,
			singularDefault: defaultData.service || "Service",
			pluralKey: "servicePluralCC",
			pluralValue: data.servicePluralCC
				? data.servicePluralCC
				: defaultData.servicePlural,
			pluralDefault: "Services",

			indents: 0,
		},

		{
			singularKey: "serviceWorkOrderCC",
			singularValue: data.serviceWorkOrderCC
				? data.serviceWorkOrderCC
				: defaultData.serviceWorkOrder,
			singularDefault: defaultData.serviceWorkOrder || "Service Work Order",
			pluralKey: "serviceWorkOrderPluralCC",
			pluralValue: data.serviceWorkOrderPluralCC
				? data.serviceWorkOrderPluralCC
				: defaultData.serviceWorkOrderPlural,
			pluralDefault: "Service Work Orders",

			indents: 1,
		},

		{
			singularKey: "pauseReasonCC",
			singularValue: data.pauseReasonCC
				? data.pauseReasonCC
				: defaultData.pauseReason,
			singularDefault: defaultData.pauseReason || "Pause Reason",
			pluralKey: "pauseReasonPluralCC",
			pluralValue: data.pauseReasonPluralCC
				? data.pauseReasonPluralCC
				: defaultData.pauseReasonPlural,
			pluralDefault: "Pause Reasons",

			indents: 1,
		},

		{
			singularKey: "stopReasonCC",
			singularValue: data.stopReasonCC
				? data.stopReasonCC
				: defaultData.stopReason,
			singularDefault: defaultData.stopReason || "Stop Reason",
			pluralKey: "stopReasonPluralCC",
			pluralValue: data.stopReasonPluralCC
				? data.stopReasonPluralCC
				: defaultData.stopReasonPlural,
			pluralDefault: "Stop Reasons",

			indents: 1,
		},

		{
			singularKey: "skipReasonCC",
			singularValue: data.skipReasonCC
				? data.skipReasonCC
				: defaultData.skipReason,
			singularDefault: defaultData.skipReason || "Skip Reason",
			pluralKey: "skipReasonPluralCC",
			pluralValue: data.skipReasonPluralCC
				? data.skipReasonPluralCC
				: defaultData.skipReasonPlural,
			pluralDefault: "Skip Reasons",

			indents: 1,
		},

		{
			singularKey: "defectCC",
			singularValue: data.defectCC ? data.defectCC : defaultData.defect,
			singularDefault: defaultData.defect || "Defect",
			pluralKey: "defectPluralCC",
			pluralValue: data.defectPluralCC
				? data.defectPluralCC
				: defaultData.defectPlural,
			pluralDefault: "Defects",
			indents: 0,
		},

		{
			singularKey: "defectWorkOrderCC",
			singularValue: data.defectWorkOrderCC
				? data.defectWorkOrderCC
				: defaultData.defectWorkOrder,
			singularDefault: defaultData.defectWorkOrder || "Defect Work Order",
			pluralKey: "defectWorkOrderPluralCC",
			pluralValue: data.defectWorkOrderPluralCC
				? data.defectWorkOrderPluralCC
				: defaultData.defectWorkOrderPlural,
			pluralDefault: "Defect Work Orders",

			indents: 1,
		},

		{
			singularKey: "defectStatusCC",
			singularValue: data.defectStatusCC
				? data.defectStatusCC
				: defaultData.defectStatus,
			singularDefault: defaultData.defectStatus || "Defect Status",
			pluralKey: "defectStatusPluralCC",
			pluralValue: data.defectStatusPluralCC
				? data.defectStatusPluralCC
				: defaultData.defectStatusPlural,
			pluralDefault: "Defect Statues",

			indents: 1,
		},

		{
			singularKey: "defectTypeCC",
			singularValue: data.defectTypeCC
				? data.defectTypeCC
				: defaultData.defectType,
			singularDefault: defaultData.defectType || "Defect Type",
			pluralKey: "defectTypePluralCC",
			pluralValue: data.defectTypePluralCC
				? data.defectTypePluralCC
				: defaultData.defectTypePlural,
			pluralDefault: "Defect Types",

			indents: 1,
		},

		{
			singularKey: "typeCC",
			singularValue: data.typeCC ? data.typeCC : defaultData.type,
			singularDefault: defaultData.type || "Type",
			pluralKey: "typePluralCC",
			pluralValue: data.typePluralCC
				? data.typePluralCC
				: defaultData.typePlural,
			pluralDefault: "Types",

			indents: 1,
		},

		{
			singularKey: "riskRatingCC",
			singularValue: data.riskRatingCC
				? data.riskRatingCC
				: defaultData.riskRating,
			singularDefault: defaultData.riskRating || "Risk Rating",
			pluralKey: "riskRatingPluralCC",
			pluralValue: data.riskRatingPluralCC
				? data.riskRatingPluralCC
				: defaultData.riskRatingPlural,
			pluralDefault: "Risk Ratings",

			indents: 1,
		},

		{
			singularKey: "riskRatingActionCC",
			singularValue: data.riskRatingActionCC
				? data.riskRatingActionCC
				: defaultData.riskRatingAction,
			singularDefault: defaultData.riskRatingAction || "Risk Rating Action",
			pluralKey: "riskRatingActionPluralCC",
			pluralValue: data.riskRatingActionPluralCC
				? data.riskRatingActionPluralCC
				: defaultData.riskRatingActionPlural,
			pluralDefault: "Risk Rating Actions",

			indents: 2,
		},

		{
			singularKey: "riskRatingMatrixCC",
			singularValue: data.riskRatingMatrixCC
				? data.riskRatingMatrixCC
				: defaultData.riskRatingMatrix,
			singularDefault: defaultData.riskRatingMatrix || "Risk Rating Matrix",
			pluralKey: "riskRatingMatrixPluralCC",
			pluralValue: data.riskRatingMatrixPluralCC
				? data.riskRatingMatrixPluralCC
				: defaultData.riskRatingMatrixPlural,
			pluralDefault: "Risk Rating Matrices",
			indents: 1,
		},

		{
			singularKey: "departmentCC",
			singularValue: data.departmentCC
				? data.departmentCC
				: defaultData.department,
			singularDefault: defaultData.department || "Department",
			pluralKey: "departmentPluralCC",
			pluralValue: data.departmentPluralCC
				? data.departmentPluralCC
				: defaultData.departmentPlural,
			pluralDefault: "Departments",

			indents: 0,
		},

		{
			singularKey: "assetCC",
			singularValue: data.assetCC ? data.assetCC : defaultData.asset,
			singularDefault: defaultData.asset || "Asset",
			pluralKey: "assetPluralCC",
			pluralValue: data.assetPluralCC
				? data.assetPluralCC
				: defaultData.assetPlural,
			pluralDefault: "Assets",

			indents: 0,
		},

		{
			singularKey: "assetReferenceCC",
			singularValue: data.assetReferenceCC
				? data.assetReferenceCC
				: defaultData.assetReference,
			singularDefault: defaultData.assetReference || "Asset Reference",
			pluralKey: "assetReferencePluralCC",
			pluralValue: data.assetReferencePluralCC
				? data.assetReferencePluralCC
				: defaultData.assetReferencePlural,
			pluralDefault: "Asset References",

			indents: 1,
		},

		{
			singularKey: "assetPlannerGroupCC",
			singularValue: data.assetPlannerGroupCC
				? data.assetPlannerGroupCC
				: defaultData.assetPlannerGroup,
			singularDefault: defaultData.assetPlannerGroup || "Asset Planner Group",
			pluralKey: "assetPlannerGroupPluralCC",
			pluralValue: data.assetPlannerGroupPluralCC
				? data.assetPlannerGroupPluralCC
				: defaultData.assetPlannerGroupPlural,
			pluralDefault: "Asset Planner Groups",

			indents: 1,
		},

		{
			singularKey: "assetMainWorkCenterCC",
			singularValue: data.assetMainWorkCenterCC
				? data.assetMainWorkCenterCC
				: defaultData.assetMainWorkCenter,
			singularDefault:
				defaultData.assetMainWorkCenter || "Asset Main Work Center",
			pluralKey: "assetMainWorkCenterPluralCC",
			pluralValue: data.assetMainWorkCenterPluralCC
				? data.assetMainWorkCenterPluralCC
				: defaultData.assetMainWorkCenterPlural,
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
