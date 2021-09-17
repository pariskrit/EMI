import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TableStyle from "../../../styles/application/TableStyle";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import ColourConstants from "../../../helpers/colourConstants";
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
			singularValue: data.modelTemplateCC,
			singularDefault: "Model Template",
			pluralKey: "modelTemplatePluralCC",
			pluralValue: data.modelTemplatePluralCC,
			pluralDefault: "Model Templates",

			indents: 0,
		},

		{
			singularKey: "projectNumberCC",
			singularValue: data.projectNumberCC,
			singularDefault: "Project Number",
			pluralKey: "projectNumberPluralCC",
			pluralValue: data.projectNumberPluralCC,
			pluralDefault: "Project Numbers",

			indents: 0,
		},

		{
			singularKey: "locationCC",
			singularValue: data.locationCC,
			singularDefault: "Location",
			pluralKey: "locationPluralCC",
			pluralValue: data.locationPluralCC,
			pluralDefault: "Locations",

			indents: 0,
		},

		{
			singularKey: "stageCC",
			singularValue: data.stageCC,
			singularDefault: "Stage",
			pluralKey: "stagePluralCC",
			pluralValue: data.stagePluralCC,
			pluralDefault: "Stages",

			indents: 0,
		},

		{
			singularKey: "zoneCC",
			singularValue: data.zoneCC,
			singularDefault: "Zone",
			pluralKey: "zonePluralCC",
			pluralValue: data.zonePluralCC,
			pluralDefault: "Zones",

			indents: 0,
		},

		{
			singularKey: "intervalCC",
			singularValue: data.intervalCC,
			singularDefault: "Interval",
			pluralKey: "intervalPluralCC",
			pluralValue: data.intervalPluralCC,
			pluralDefault: "Intervals",

			indents: 0,
		},

		{
			singularKey: "taskListNoCC",
			singularValue: data.taskListNoCC,
			singularDefault: "Task List Number",
			pluralKey: "taskListNoPluralCC",
			pluralValue: data.taskListNoPluralCC,
			pluralDefault: "Task List Numbers",

			indents: 1,
		},

		{
			singularKey: "questionCC",
			singularValue: data.questionCC,
			singularDefault: "Question",
			pluralKey: "questionPluralCC",
			pluralValue: data.questionPluralCC,
			pluralDefault: "Questions",

			indents: 0,
		},

		{
			singularKey: "taskCC",
			singularValue: data.taskCC,
			singularDefault: "Task",
			pluralKey: "taskPluralCC",
			pluralValue: data.taskPluralCC,
			pluralDefault: "Tasks",

			indents: 0,
		},

		{
			singularKey: "actionRequiredCC",
			singularValue: data.actionRequiredCC,
			singularDefault: "Action",
			pluralKey: "actionRequiredPluralCC",
			pluralValue: data.actionRequiredPluralCC,
			pluralDefault: "Actions",

			indents: 1,
		},

		{
			singularKey: "operatingModeCC",
			singularValue: data.operatingModeCC,
			singularDefault: "Operating Mode",
			pluralKey: "operatingModePluralCC",
			pluralValue: data.operatingModePluralCC,
			pluralDefault: "Operating Modes",

			indents: 1,
		},

		{
			singularKey: "systemCC",
			singularValue: data.systemCC,
			singularDefault: "System",
			pluralKey: "systemPluralCC",
			pluralValue: data.systemPluralCC,
			pluralDefault: "Systems",

			indents: 1,
		},

		{
			singularKey: "safetyCriticalCC",
			singularValue: data.safetyCriticalCC,
			singularDefault: "Safety Critical",
			pluralKey: "safetyCriticalPluralCC",
			pluralValue: data.safetyCriticalPluralCC,
			pluralDefault: "Safety Critical",

			indents: 1,
		},

		{
			singularKey: "partCC",
			singularValue: data.partCC,
			singularDefault: "Part",
			pluralKey: "partPluralCC",
			pluralValue: data.partPluralCC,
			pluralDefault: "Parts",

			indents: 1,
		},

		{
			singularKey: "partQuantityCC",
			singularValue: data.partQuantityCC,
			singularDefault: "Part Quantity",
			pluralKey: "partQuantityPluralCC",
			pluralValue: data.partQuantityPluralCC,
			pluralDefault: "Part Quantities",

			indents: 2,
		},

		{
			singularKey: "partNameCC",
			singularValue: data.partNameCC,
			singularDefault: "Part Name",
			pluralKey: "partNamePluralCC",
			pluralValue: data.partNamePluralCC,
			pluralDefault: "Part Names",

			indents: 2,
		},

		{
			singularKey: "partDescriptionCC",
			singularValue: data.partDescriptionCC,
			singularDefault: "Part Description",
			pluralKey: "partDescriptionPluralCC",
			pluralValue: data.partDescriptionPluralCC,
			pluralDefault: "Part Descriptions",

			indents: 2,
		},

		{
			singularKey: "partStockNumberCC",
			singularValue: data.partStockNumberCC,
			singularDefault: "Part Stock Number",
			pluralKey: "partStockNumberPluralCC",
			pluralValue: data.partStockNumberPluralCC,
			pluralDefault: "Part Stock Numbers",

			indents: 2,
		},

		{
			singularKey: "toolCC",
			singularValue: data.toolCC,
			singularDefault: "Tool",
			pluralKey: "toolPluralCC",
			pluralValue: data.toolPluralCC,
			pluralDefault: "Tools",

			indents: 1,
		},

		{
			singularKey: "toolQuantityCC",
			singularValue: data.toolQuantityCC,
			singularDefault: "Tool Quantity",
			pluralKey: "toolQuantityPluralCC",
			pluralValue: data.toolQuantityPluralCC,
			pluralDefault: "Tool Quantities",

			indents: 2,
		},

		{
			singularKey: "toolDescriptionCC",
			singularValue: data.toolDescriptionCC,
			singularDefault: "Tool Description",
			pluralKey: "toolDescriptionPluralCC",
			pluralValue: data.toolDescriptionPluralCC,
			pluralDefault: "Tool Descriptions",

			indents: 2,
		},

		{
			singularKey: "lubricantCC",
			singularValue: data.lubricantCC,
			singularDefault: "Lubricant",
			pluralKey: "lubricantPluralCC",
			pluralValue: data.lubricantPluralCC,
			pluralDefault: "Lubricants",

			indents: 1,
		},

		{
			singularKey: "workbookCC",
			singularValue: data.workbookCC,
			singularDefault: "Workbook",
			pluralKey: "workbookPluralCC",
			pluralValue: data.workbookPluralCC,
			pluralDefault: "Workbooks",

			indents: 1,
		},

		{
			singularKey: "purposeCC",
			singularValue: data.purposeCC,
			singularDefault: "Purpose",
			pluralKey: "purposePluralCC",
			pluralValue: data.purposePluralCC,
			pluralDefault: "Purposes",

			indents: 2,
		},

		{
			singularKey: "procedureCC",
			singularValue: data.procedureCC,
			singularDefault: "Procedure",
			pluralKey: "procedurePluralCC",
			pluralValue: data.procedurePluralCC,
			pluralDefault: "Procedures",

			indents: 2,
		},

		{
			singularKey: "possibleHazardsCC",
			singularValue: data.possibleHazardsCC,
			singularDefault: "Possible Hazard",
			pluralKey: "possibleHazardsPluralCC",
			pluralValue: data.possibleHazardsPluralCC,
			pluralDefault: "Possible Hazards",

			indents: 2,
		},

		{
			singularKey: "additionalPPECC",
			singularValue: data.additionalPPECC,
			singularDefault: "Additional PPE",
			pluralKey: "additionalPPEPluralCC",
			pluralValue: data.additionalPPEPluralCC,
			pluralDefault: "Additional PPEs",

			indents: 2,
		},

		{
			singularKey: "specificationCC",
			singularValue: data.specificationCC,
			singularDefault: "Specification",
			pluralKey: "specificationPluralCC",
			pluralValue: data.specificationPluralCC,
			pluralDefault: "Specifications",

			indents: 2,
		},

		{
			singularKey: "contaminationControlsCC",
			singularValue: data.contaminationControlsCC,
			singularDefault: "Contamination Control",
			pluralKey: "contaminationControlsPluralCC",
			pluralValue: data.contaminationControlsPluralCC,
			pluralDefault: "Contamination Controls",

			indents: 2,
		},

		{
			singularKey: "otherInformationCC",
			singularValue: data.otherInformationCC,
			singularDefault: "Other Information",
			pluralKey: "otherInformationPluralCC",
			pluralValue: data.otherInformationPluralCC,
			pluralDefault: "Other Information",

			indents: 2,
		},

		{
			singularKey: "correctiveActionsCC",
			singularValue: data.correctiveActionsCC,
			singularDefault: "Corrective Action",
			pluralKey: "correctiveActionsPluralCC",
			pluralValue: data.correctiveActionsPluralCC,
			pluralDefault: "Corrective Actions",

			indents: 2,
		},

		{
			singularKey: "isolationsCC",
			singularValue: data.isolationsCC,
			singularDefault: "Isolation",
			pluralKey: "isolationsPluralCC",
			pluralValue: data.isolationsPluralCC,
			pluralDefault: "Isolations",

			indents: 2,
		},

		{
			singularKey: "controlsCC",
			singularValue: data.controlsCC,
			singularDefault: "Control",
			pluralKey: "controlsPluralCC",
			pluralValue: data.controlsPluralCC,
			pluralDefault: "Controls",

			indents: 2,
		},

		{
			singularKey: "customField1CC",
			singularValue: data.customField1CC,
			singularDefault: "Custom Field 1",
			pluralKey: "customField1PluralCC",
			pluralValue: data.customField1PluralCC,
			pluralDefault: "Custom Field 1",

			indents: 2,
		},

		{
			singularKey: "customField2CC",
			singularValue: data.customField2CC,
			singularDefault: "Custom Field 2",
			pluralKey: "customField2PluralCC",
			pluralValue: data.customField2PluralCC,
			pluralDefault: "Custom Field 2",

			indents: 2,
		},

		{
			singularKey: "customField3CC",
			singularValue: data.customField3CC,
			singularDefault: "Custom Field 3",
			pluralKey: "customField3PluralCC",
			pluralValue: data.customField3PluralCC,
			pluralDefault: "Custom Field 3",

			indents: 2,
		},

		{
			singularKey: "makeCC",
			singularValue: data.makeCC,
			singularDefault: "Make",
			pluralKey: "makePluralCC",
			pluralValue: data.makePluralCC,
			pluralDefault: "Makes",

			indents: 0,
		},

		{
			singularKey: "modelCC",
			singularValue: data.modelCC,
			singularDefault: "Model",
			pluralKey: "modelPluralCC",
			pluralValue: data.modelPluralCC,
			pluralDefault: "Models",

			indents: 0,
		},

		{
			singularKey: "modelTypeCC",
			singularValue: data.modelTypeCC,
			singularDefault: "Model Type",
			pluralKey: "modelTypePluralCC",
			pluralValue: data.modelTypePluralCC,
			pluralDefault: "Model Types",

			indents: 0,
		},

		{
			singularKey: "developerNameCC",
			singularValue: data.developerNameCC,
			singularDefault: "Developer Name",
			pluralKey: "developerNamePluralCC",
			pluralValue: data.developerNamePluralCC,
			pluralDefault: "Developer Names",

			indents: 0,
		},

		{
			singularKey: "roleCC",
			singularValue: data.roleCC,
			singularDefault: "Role",
			pluralKey: "rolePluralCC",
			pluralValue: data.rolePluralCC,
			pluralDefault: "Roles",

			indents: 0,
		},

		{
			singularKey: "tutorialCC",
			singularValue: data.tutorialCC,
			singularDefault: "Tutorial",
			pluralKey: "tutorialPluralCC",
			pluralValue: data.tutorialPluralCC,
			pluralDefault: "Tutorials",

			indents: 0,
		},

		{
			singularKey: "feedbackCC",
			singularValue: data.feedbackCC,
			singularDefault: "Feedback",
			pluralKey: "feedbackPluralCC",
			pluralValue: data.feedbackPluralCC,
			pluralDefault: "Feedbacks",

			indents: 0,
		},

		{
			singularKey: "changeRequiredCC",
			singularValue: data.changeRequiredCC,
			singularDefault: "Change Required",
			pluralKey: "changeRequiredPluralCC",
			pluralValue: data.changeRequiredPluralCC,
			pluralDefault: "Changes Required",

			indents: 1,
		},

		{
			singularKey: "benefitCC",
			singularValue: data.benefitCC,
			singularDefault: "Benefit",
			pluralKey: "benefitPluralCC",
			pluralValue: data.benefitPluralCC,
			pluralDefault: "Benefits",

			indents: 1,
		},

		{
			singularKey: "classificationCC",
			singularValue: data.classificationCC,
			singularDefault: "Classification",
			pluralKey: "classificationPluralCC",
			pluralValue: data.classificationPluralCC,
			pluralDefault: "Classifications",

			indents: 1,
		},

		{
			singularKey: "priorityCC",
			singularValue: data.priorityCC,
			singularDefault: "Priority",
			pluralKey: "priorityPluralCC",
			pluralValue: data.priorityPluralCC,
			pluralDefault: "Priorities",

			indents: 1,
		},

		{
			singularKey: "feedbackStatusCC",
			singularValue: data.feedbackStatusCC,
			singularDefault: "Feedback Status",
			pluralKey: "feedbackStatusPluralCC",
			pluralValue: data.feedbackStatusPluralCC,
			pluralDefault: "Feedback Statues",

			indents: 1,
		},

		{
			singularKey: "userCC",
			singularValue: data.userCC,
			singularDefault: "User",
			pluralKey: "userPluralCC",
			pluralValue: data.userPluralCC,
			pluralDefault: "Users",

			indents: 0,
		},

		{
			singularKey: "positionCC",
			singularValue: data.positionCC,
			singularDefault: "Position",
			pluralKey: "positionPluralCC",
			pluralValue: data.positionPluralCC,
			pluralDefault: "Positions",

			indents: 1,
		},

		{
			singularKey: "serviceCC",
			singularValue: data.serviceCC,
			singularDefault: "Service",
			pluralKey: "servicePluralCC",
			pluralValue: data.servicePluralCC,
			pluralDefault: "Services",

			indents: 0,
		},

		{
			singularKey: "serviceWorkOrderCC",
			singularValue: data.serviceWorkOrderCC,
			singularDefault: "Service Work Order",
			pluralKey: "serviceWorkOrderPluralCC",
			pluralValue: data.serviceWorkOrderPluralCC,
			pluralDefault: "Service Work Orders",

			indents: 1,
		},

		{
			singularKey: "pauseReasonCC",
			singularValue: data.pauseReasonCC,
			singularDefault: "Pause Reason",
			pluralKey: "pauseReasonPluralCC",
			pluralValue: data.pauseReasonPluralCC,
			pluralDefault: "Pause Reasons",

			indents: 1,
		},

		{
			singularKey: "stopReasonCC",
			singularValue: data.stopReasonCC,
			singularDefault: "Stop Reason",
			pluralKey: "stopReasonPluralCC",
			pluralValue: data.stopReasonPluralCC,
			pluralDefault: "Stop Reasons",

			indents: 1,
		},

		{
			singularKey: "skipReasonCC",
			singularValue: data.skipReasonCC,
			singularDefault: "Skip Reason",
			pluralKey: "skipReasonPluralCC",
			pluralValue: data.skipReasonPluralCC,
			pluralDefault: "Skip Reasons",

			indents: 1,
		},

		{
			singularKey: "defectCC",
			singularValue: data.defectCC,
			singularDefault: "Defect",
			pluralKey: "defectPluralCC",
			pluralValue: data.defectPluralCC,
			pluralDefault: "Defects",
			indents: 0,
		},

		{
			singularKey: "defectWorkOrderCC",
			singularValue: data.defectWorkOrderCC,
			singularDefault: "Defect Work Order",
			pluralKey: "defectWorkOrderPluralCC",
			pluralValue: data.defectWorkOrderPluralCC,
			pluralDefault: "Defect Work Orders",

			indents: 1,
		},

		{
			singularKey: "defectStatusCC",
			singularValue: data.defectStatusCC,
			singularDefault: "Defect Status",
			pluralKey: "defectStatusPluralCC",
			pluralValue: data.defectStatusPluralCC,
			pluralDefault: "Defect Statues",

			indents: 1,
		},

		{
			singularKey: "defectTypeCC",
			singularValue: data.defectTypeCC,
			singularDefault: "Defect Type",
			pluralKey: "defectTypePluralCC",
			pluralValue: data.defectTypePluralCC,
			pluralDefault: "Defect Types",

			indents: 1,
		},

		{
			singularKey: "typeCC",
			singularValue: data.typeCC,
			singularDefault: "Type",
			pluralKey: "typePluralCC",
			pluralValue: data.typePluralCC,
			pluralDefault: "Types",

			indents: 1,
		},

		{
			singularKey: "riskRatingCC",
			singularValue: data.riskRatingCC,
			singularDefault: "Risk Rating",
			pluralKey: "riskRatingPluralCC",
			pluralValue: data.riskRatingPluralCC,
			pluralDefault: "Risk Ratings",

			indents: 1,
		},

		{
			singularKey: "riskRatingActionCC",
			singularValue: data.riskRatingActionCC,
			singularDefault: "Risk Rating Action",
			pluralKey: "riskRatingActionPluralCC",
			pluralValue: data.riskRatingActionPluralCC,
			pluralDefault: "Risk Rating Actions",

			indents: 2,
		},

		{
			singularKey: "riskRatingMatrixCC",
			singularValue: data.riskRatingMatrixCC,
			singularDefault: "Risk Rating Matrix",
			pluralKey: "riskRatingMatrixPluralCC",
			pluralValue: data.riskRatingMatrixPluralCC,
			pluralDefault: "Risk Rating Matrices",
			indents: 1,
		},

		{
			singularKey: "departmentCC",
			singularValue: data.departmentCC,
			singularDefault: "Department",
			pluralKey: "departmentPluralCC",
			pluralValue: data.departmentPluralCC,
			pluralDefault: "Departments",

			indents: 0,
		},

		{
			singularKey: "assetCC",
			singularValue: data.assetCC,
			singularDefault: "Asset",
			pluralKey: "assetPluralCC",
			pluralValue: data.assetPluralCC,
			pluralDefault: "Assets",

			indents: 0,
		},

		{
			singularKey: "assetReferenceCC",
			singularValue: data.assetReferenceCC,
			singularDefault: "Asset Reference",
			pluralKey: "assetReferencePluralCC",
			pluralValue: data.assetReferencePluralCC,
			pluralDefault: "Asset References",

			indents: 1,
		},

		{
			singularKey: "assetPlannerGroupCC",
			singularValue: data.assetPlannerGroupCC,
			singularDefault: "Asset Planner Group",
			pluralKey: "assetPlannerGroupPluralCC",
			pluralValue: data.assetPlannerGroupPluralCC,
			pluralDefault: "Asset Planner Groups",

			indents: 1,
		},

		{
			singularKey: "assetMainWorkCenterCC",
			singularValue: data.assetMainWorkCenterCC,
			singularDefault: "Asset Main Work Center",
			pluralKey: "assetMainWorkCenterPluralCC",
			pluralValue: data.assetMainWorkCenterPluralCC,
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
