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
			singularKey: "modelTemplate",
			singularValue: defaultData.modelTemplate,
			singularDefault: defaultData.modelTemplate || "Model Template",
			pluralKey: "modelTemplatePlural",
			pluralValue: defaultData.modelTemplatePlural,
			pluralDefault: "Model Templates",

			indents: 0,
		},

		{
			singularKey: "projectNumber",
			singularValue: defaultData.projectNumber,
			singularDefault: defaultData.projectNumber || "Project Number",
			pluralKey: "projectNumberPlural",
			pluralValue: defaultData.projectNumberPlural,
			pluralDefault: "Project Numbers",

			indents: 0,
		},

		{
			singularKey: "location",
			singularValue: defaultData.location,
			singularDefault: defaultData.location || "Location",
			pluralKey: "locationPlural",
			pluralValue: defaultData.locationPlural,
			pluralDefault: "Locations",

			indents: 0,
		},

		{
			singularKey: "stage",
			singularValue: defaultData.stage,
			singularDefault: defaultData.stage || "Stage",
			pluralKey: "stagePlural",
			pluralValue: defaultData.stagePlural,
			pluralDefault: "Stages",

			indents: 0,
		},

		{
			singularKey: "zone",
			singularValue: defaultData.zone,
			singularDefault: defaultData.zone || "Zone",
			pluralKey: "zonePlural",
			pluralValue: defaultData.zonePlural,
			pluralDefault: "Zones",

			indents: 0,
		},

		{
			singularKey: "interval",
			singularValue: defaultData.interval,
			singularDefault: defaultData.interval || "Interval",
			pluralKey: "intervalPlural",
			pluralValue: defaultData.intervalPlural,
			pluralDefault: "Intervals",

			indents: 0,
		},

		{
			singularKey: "taskListNo",
			singularValue: defaultData.taskListNo,
			singularDefault: defaultData.taskListNo || "Task List Number",
			pluralKey: "taskListNoPlural",
			pluralValue: defaultData.taskListNoPlural,
			pluralDefault: "Task List Numbers",

			indents: 1,
		},

		{
			singularKey: "question",
			singularValue: defaultData.question,
			singularDefault: defaultData.question || "Question",
			pluralKey: "questionPlural",
			pluralValue: defaultData.questionPlural,
			pluralDefault: "Questions",

			indents: 0,
		},

		{
			singularKey: "task",
			singularValue: defaultData.task,
			singularDefault: defaultData.task || "Task",
			pluralKey: "taskPlural",
			pluralValue: defaultData.taskPlural,
			pluralDefault: "Tasks",

			indents: 0,
		},

		{
			singularKey: "actionRequired",
			singularValue: defaultData.actionRequired,
			singularDefault: defaultData.actionRequired || "Action",
			pluralKey: "actionRequiredPlural",
			pluralValue: defaultData.actionRequiredPlural,
			pluralDefault: "Actions",

			indents: 1,
		},

		{
			singularKey: "operatingMode",
			singularValue: defaultData.operatingMode,
			singularDefault: defaultData.operatingMode || "Operating Mode",
			pluralKey: "operatingModePlural",
			pluralValue: defaultData.operatingModePlural,
			pluralDefault: "Operating Modes",

			indents: 1,
		},

		{
			singularKey: "system",
			singularValue: defaultData.system,
			singularDefault: defaultData.system || "System",
			pluralKey: "systemPlural",
			pluralValue: defaultData.systemPlural,
			pluralDefault: "Systems",

			indents: 1,
		},

		{
			singularKey: "safetyCritical",
			singularValue: defaultData.safetyCritical,
			singularDefault: defaultData.safetyCritical || "Safety Critical",
			pluralKey: "safetyCriticalPlural",
			pluralValue: defaultData.safetyCriticalPlural,
			pluralDefault: "Safety Critical",

			indents: 1,
		},

		{
			singularKey: "part",
			singularValue: defaultData.part,
			singularDefault: defaultData.part || "Part",
			pluralKey: "partPlural",
			pluralValue: defaultData.partPlural,
			pluralDefault: "Parts",

			indents: 1,
		},

		{
			singularKey: "partQuantity",
			singularValue: defaultData.partQuantity,
			singularDefault: defaultData.partQuantity || "Part Quantity",
			pluralKey: "partQuantityPlural",
			pluralValue: defaultData.partQuantityPlural,
			pluralDefault: "Part Quantities",

			indents: 2,
		},

		{
			singularKey: "partName",
			singularValue: defaultData.partName,
			singularDefault: defaultData.partName || "Part Name",
			pluralKey: "partNamePlural",
			pluralValue: defaultData.partNamePlural,
			pluralDefault: "Part Names",

			indents: 2,
		},

		{
			singularKey: "partDescription",
			singularValue: defaultData.partDescription,
			singularDefault: defaultData.partDescription || "Part Description",
			pluralKey: "partDescriptionPlural",
			pluralValue: defaultData.partDescriptionPlural,
			pluralDefault: "Part Descriptions",

			indents: 2,
		},

		{
			singularKey: "partStockNumber",
			singularValue: defaultData.partStockNumber,
			singularDefault: defaultData.partStockNumber || "Part Stock Number",
			pluralKey: "partStockNumberPlural",
			pluralValue: defaultData.partStockNumberPlural,
			pluralDefault: "Part Stock Numbers",

			indents: 2,
		},

		{
			singularKey: "tool",
			singularValue: defaultData.tool,
			singularDefault: defaultData.tool || "Tool",
			pluralKey: "toolPlural",
			pluralValue: defaultData.toolPlural,
			pluralDefault: "Tools",

			indents: 1,
		},

		{
			singularKey: "toolQuantity",
			singularValue: defaultData.toolQuantity,
			singularDefault: defaultData.toolQuantity || "Tool Quantity",
			pluralKey: "toolQuantityPlural",
			pluralValue: defaultData.toolQuantityPlural,
			pluralDefault: "Tool Quantities",

			indents: 2,
		},

		{
			singularKey: "toolDescription",
			singularValue: defaultData.toolDescription,
			singularDefault: defaultData.toolDescription || "Tool Description",
			pluralKey: "toolDescriptionPlural",
			pluralValue: defaultData.toolDescriptionPlural,
			pluralDefault: "Tool Descriptions",

			indents: 2,
		},

		{
			singularKey: "lubricant",
			singularValue: defaultData.lubricant,
			singularDefault: defaultData.lubricant || "Lubricant",
			pluralKey: "lubricantPlural",
			pluralValue: defaultData.lubricantPlural,
			pluralDefault: "Lubricants",

			indents: 1,
		},

		{
			singularKey: "workbook",
			singularValue: defaultData.workbook,
			singularDefault: defaultData.workbook || "Workbook",
			pluralKey: "workbookPlural",
			pluralValue: defaultData.workbookPlural,
			pluralDefault: "Workbooks",

			indents: 1,
		},

		{
			singularKey: "purpose",
			singularValue: defaultData.purpose,
			singularDefault: defaultData.purpose || "Purpose",
			pluralKey: "purposePlural",
			pluralValue: defaultData.purposePlural,
			pluralDefault: "Purposes",

			indents: 2,
		},

		{
			singularKey: "procedure",
			singularValue: defaultData.procedure,
			singularDefault: defaultData.procedure || "Procedure",
			pluralKey: "procedurePlural",
			pluralValue: defaultData.procedurePlural,
			pluralDefault: "Procedures",

			indents: 2,
		},

		{
			singularKey: "possibleHazards",
			singularValue: defaultData.possibleHazards,
			singularDefault: defaultData.possibleHazards || "Possible Hazard",
			pluralKey: "possibleHazardsPlural",
			pluralValue: defaultData.possibleHazardsPlural,
			pluralDefault: "Possible Hazards",

			indents: 2,
		},

		{
			singularKey: "additionalPPE",
			singularValue: defaultData.additionalPPE,
			singularDefault: defaultData.additionalPPE || "Additional PPE",
			pluralKey: "additionalPPEPlural",
			pluralValue: defaultData.additionalPPEPlural,
			pluralDefault: "Additional PPEs",

			indents: 2,
		},

		{
			singularKey: "specification",
			singularValue: defaultData.specification,
			singularDefault: defaultData.specification || "Specification",
			pluralKey: "specificationPlural",
			pluralValue: defaultData.specificationPlural,
			pluralDefault: "Specifications",

			indents: 2,
		},

		{
			singularKey: "contaminationControls",
			singularValue: defaultData.contaminationControls,
			singularDefault:
				defaultData.contaminationControls || "Contamination Control",
			pluralKey: "contaminationControlsPlural",
			pluralValue: defaultData.contaminationControlsPlural,
			pluralDefault: "Contamination Controls",

			indents: 2,
		},

		{
			singularKey: "otherInformation",
			singularValue: defaultData.otherInformation,
			singularDefault: defaultData.otherInformation || "Other Information",
			pluralKey: "otherInformationPlural",
			pluralValue: defaultData.otherInformationPlural,
			pluralDefault: "Other Information",

			indents: 2,
		},

		{
			singularKey: "correctiveActions",
			singularValue: defaultData.correctiveActions,
			singularDefault: defaultData.correctiveActions || "Corrective Action",
			pluralKey: "correctiveActionsPlural",
			pluralValue: defaultData.correctiveActionsPlural,
			pluralDefault: "Corrective Actions",

			indents: 2,
		},

		{
			singularKey: "isolations",
			singularValue: defaultData.isolations,
			singularDefault: defaultData.isolations || "Isolation",
			pluralKey: "isolationsPlural",
			pluralValue: defaultData.isolationsPlural,
			pluralDefault: "Isolations",

			indents: 2,
		},

		{
			singularKey: "controls",
			singularValue: defaultData.controls,
			singularDefault: defaultData.controls || "Control",
			pluralKey: "controlsPlural",
			pluralValue: defaultData.controlsPlural,
			pluralDefault: "Controls",

			indents: 2,
		},

		{
			singularKey: "customField1",
			singularValue: defaultData.customField1,
			singularDefault: defaultData.customField1 || "Custom Field 1",
			pluralKey: "customField1Plural",
			pluralValue: defaultData.customField1Plural,
			pluralDefault: "Custom Field 1",

			indents: 2,
		},

		{
			singularKey: "customField2",
			singularValue: defaultData.customField2,
			singularDefault: defaultData.customField2 || "Custom Field 2",
			pluralKey: "customField2Plural",
			pluralValue: defaultData.customField2Plural,
			pluralDefault: "Custom Field 2",

			indents: 2,
		},

		{
			singularKey: "customField3",
			singularValue: defaultData.customField3,
			singularDefault: defaultData.customField3 || "Custom Field 3",
			pluralKey: "customField3Plural",
			pluralValue: defaultData.customField3Plural,
			pluralDefault: "Custom Field 3",

			indents: 2,
		},

		{
			singularKey: "make",
			singularValue: defaultData.make,
			singularDefault: defaultData.make || "Make",
			pluralKey: "makePlural",
			pluralValue: defaultData.makePlural,
			pluralDefault: "Makes",

			indents: 0,
		},

		{
			singularKey: "model",
			singularValue: defaultData.model,
			singularDefault: defaultData.model || "Model",
			pluralKey: "modelPlural",
			pluralValue: defaultData.modelPlural,
			pluralDefault: "Models",

			indents: 0,
		},

		{
			singularKey: "modelType",
			singularValue: defaultData.modelType,
			singularDefault: defaultData.modelType || "Model Type",
			pluralKey: "modelTypePlural",
			pluralValue: defaultData.modelTypePlural,
			pluralDefault: "Model Types",

			indents: 0,
		},

		{
			singularKey: "developerName",
			singularValue: defaultData.developerName,
			singularDefault: defaultData.developerName || "Developer Name",
			pluralKey: "developerNamePlural",
			pluralValue: defaultData.developerNamePlural,
			pluralDefault: "Developer Names",

			indents: 0,
		},

		{
			singularKey: "role",
			singularValue: defaultData.role,
			singularDefault: defaultData.role || "Role",
			pluralKey: "rolePlural",
			pluralValue: defaultData.rolePlural,
			pluralDefault: "Roles",

			indents: 0,
		},

		{
			singularKey: "tutorial",
			singularValue: defaultData.tutorial,
			singularDefault: defaultData.tutorial || "Tutorial",
			pluralKey: "tutorialPlural",
			pluralValue: defaultData.tutorialPlural,
			pluralDefault: "Tutorials",

			indents: 0,
		},

		{
			singularKey: "feedback",
			singularValue: defaultData.feedback,
			singularDefault: defaultData.feedback || "Feedback",
			pluralKey: "feedbackPlural",
			pluralValue: defaultData.feedbackPlural,
			pluralDefault: "Feedbacks",

			indents: 0,
		},

		{
			singularKey: "changeRequired",
			singularValue: defaultData.changeRequired,
			singularDefault: defaultData.changeRequired || "Change Required",
			pluralKey: "changeRequiredPlural",
			pluralValue: defaultData.changeRequiredPlural,
			pluralDefault: "Changes Required",

			indents: 1,
		},

		{
			singularKey: "benefit",
			singularValue: defaultData.benefit,
			singularDefault: defaultData.benefit || "Benefit",
			pluralKey: "benefitPlural",
			pluralValue: defaultData.benefitPlural,
			pluralDefault: "Benefits",

			indents: 1,
		},

		{
			singularKey: "classification",
			singularValue: defaultData.classification,
			singularDefault: defaultData.classification || "Classification",
			pluralKey: "classificationPlural",
			pluralValue: defaultData.classificationPlural,
			pluralDefault: "Classifications",

			indents: 1,
		},

		{
			singularKey: "priority",
			singularValue: defaultData.priority,
			singularDefault: defaultData.priority || "Priority",
			pluralKey: "priorityPlural",
			pluralValue: defaultData.priorityPlural,
			pluralDefault: "Priorities",

			indents: 1,
		},

		{
			singularKey: "feedbackStatus",
			singularValue: defaultData.feedbackStatus,
			singularDefault: defaultData.feedbackStatus || "Feedback Status",
			pluralKey: "feedbackStatusPlural",
			pluralValue: defaultData.feedbackStatusPlural,
			pluralDefault: "Feedback Statues",

			indents: 1,
		},

		{
			singularKey: "user",
			singularValue: defaultData.user,
			singularDefault: defaultData.user || "User",
			pluralKey: "userPlural",
			pluralValue: defaultData.userPlural,
			pluralDefault: "Users",

			indents: 0,
		},

		{
			singularKey: "position",
			singularValue: defaultData.position,
			singularDefault: defaultData.position || "Position",
			pluralKey: "positionPlural",
			pluralValue: defaultData.positionPlural,
			pluralDefault: "Positions",

			indents: 1,
		},

		{
			singularKey: "service",
			singularValue: defaultData.service,
			singularDefault: defaultData.service || "Service",
			pluralKey: "servicePlural",
			pluralValue: defaultData.servicePlural,
			pluralDefault: "Services",

			indents: 0,
		},

		{
			singularKey: "serviceWorkOrder",
			singularValue: defaultData.serviceWorkOrder,
			singularDefault: defaultData.serviceWorkOrder || "Service Work Order",
			pluralKey: "serviceWorkOrderPlural",
			pluralValue: defaultData.serviceWorkOrderPlural,
			pluralDefault: "Service Work Orders",

			indents: 1,
		},

		{
			singularKey: "pauseReason",
			singularValue: defaultData.pauseReason,
			singularDefault: defaultData.pauseReason || "Pause Reason",
			pluralKey: "pauseReasonPlural",
			pluralValue: defaultData.pauseReasonPlural,
			pluralDefault: "Pause Reasons",

			indents: 1,
		},

		{
			singularKey: "stopReason",
			singularValue: defaultData.stopReason,
			singularDefault: defaultData.stopReason || "Stop Reason",
			pluralKey: "stopReasonPlural",
			pluralValue: defaultData.stopReasonPlural,
			pluralDefault: "Stop Reasons",

			indents: 1,
		},

		{
			singularKey: "skipReason",
			singularValue: defaultData.skipReason,
			singularDefault: defaultData.skipReason || "Skip Reason",
			pluralKey: "skipReasonPlural",
			pluralValue: defaultData.skipReasonPlural,
			pluralDefault: "Skip Reasons",

			indents: 1,
		},

		{
			singularKey: "defect",
			singularValue: defaultData.defect,
			singularDefault: defaultData.defect || "Defect",
			pluralKey: "defectPlural",
			pluralValue: defaultData.defectPlural,
			pluralDefault: "Defects",
			indents: 0,
		},

		{
			singularKey: "defectWorkOrder",
			singularValue: defaultData.defectWorkOrder,
			singularDefault: defaultData.defectWorkOrder || "Defect Work Order",
			pluralKey: "defectWorkOrderPlural",
			pluralValue: defaultData.defectWorkOrderPlural,
			pluralDefault: "Defect Work Orders",

			indents: 1,
		},

		{
			singularKey: "defectStatus",
			singularValue: defaultData.defectStatus,
			singularDefault: defaultData.defectStatus || "Defect Status",
			pluralKey: "defectStatusPlural",
			pluralValue: defaultData.defectStatusPlural,
			pluralDefault: "Defect Statues",

			indents: 1,
		},

		{
			singularKey: "defectType",
			singularValue: defaultData.defectType,
			singularDefault: defaultData.defectType || "Defect Type",
			pluralKey: "defectTypePlural",
			pluralValue: defaultData.defectTypePlural,
			pluralDefault: "Defect Types",

			indents: 1,
		},

		{
			singularKey: "type",
			singularValue: defaultData.type,
			singularDefault: defaultData.type || "Type",
			pluralKey: "typePlural",
			pluralValue: defaultData.typePlural,
			pluralDefault: "Types",

			indents: 1,
		},

		{
			singularKey: "riskRating",
			singularValue: defaultData.riskRating,
			singularDefault: defaultData.riskRating || "Risk Rating",
			pluralKey: "riskRatingPlural",
			pluralValue: defaultData.riskRatingPlural,
			pluralDefault: "Risk Ratings",

			indents: 1,
		},

		{
			singularKey: "riskRatingAction",
			singularValue: defaultData.riskRatingAction,
			singularDefault: defaultData.riskRatingAction || "Risk Rating Action",
			pluralKey: "riskRatingActionPlural",
			pluralValue: defaultData.riskRatingActionPlural,
			pluralDefault: "Risk Rating Actions",

			indents: 2,
		},

		{
			singularKey: "riskRatingMatrix",
			singularValue: defaultData.riskRatingMatrix,
			singularDefault: defaultData.riskRatingMatrix || "Risk Rating Matrix",
			pluralKey: "riskRatingMatrixPlural",
			pluralValue: defaultData.riskRatingMatrixPlural,
			pluralDefault: "Risk Rating Matrices",
			indents: 1,
		},

		{
			singularKey: "department",
			singularValue: defaultData.department,
			singularDefault: defaultData.department || "Department",
			pluralKey: "departmentPlural",
			pluralValue: defaultData.departmentPlural,
			pluralDefault: "Departments",

			indents: 0,
		},

		{
			singularKey: "asset",
			singularValue: defaultData.asset,
			singularDefault: defaultData.asset || "Asset",
			pluralKey: "assetPlural",
			pluralValue: defaultData.assetPlural,
			pluralDefault: "Assets",

			indents: 0,
		},

		{
			singularKey: "assetReference",
			singularValue: defaultData.assetReference,
			singularDefault: defaultData.assetReference || "Asset Reference",
			pluralKey: "assetReferencePlural",
			pluralValue: defaultData.assetReferencePlural,
			pluralDefault: "Asset References",

			indents: 1,
		},

		{
			singularKey: "assetPlannerGroup",
			singularValue: defaultData.assetPlannerGroup,
			singularDefault: defaultData.assetPlannerGroup || "Asset Planner Group",
			pluralKey: "assetPlannerGroupPlural",
			pluralValue: defaultData.assetPlannerGroupPlural,
			pluralDefault: "Asset Planner Groups",

			indents: 1,
		},

		{
			singularKey: "assetMainWorkCenter",
			singularValue: defaultData.assetMainWorkCenter,
			singularDefault:
				defaultData.assetMainWorkCenter || "Asset Main Work Center",
			pluralKey: "assetMainWorkCenterPlural",
			pluralValue: defaultData.assetMainWorkCenterPlural,
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
