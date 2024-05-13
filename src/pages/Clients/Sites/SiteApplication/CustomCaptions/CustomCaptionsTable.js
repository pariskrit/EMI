import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import TableStyle from "styles/application/TableStyle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ColourConstants from "helpers/colourConstants";
import CustomCaptionRow from "./CustomCaptionRow";

// Init styled components
const AT = TableStyle();

const useStyles = makeStyles()((theme) => ({
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
}));

const CustomCaptionsTable = ({
	data,
	defaultData,
	searchQuery,
	handleUpdateCustomCaption,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();
	// Init State
	const [searchedData, setSearchedData] = useState([]);

	// Data to render custom captions
	const customCaptionInputs = [
		{
			singularKey: "modelTemplate",
			singularValue: data.modelTemplateCC,
			singularDefault: defaultData.modelTemplate,
			pluralKey: "modelTemplatePlural",
			pluralValue: data.modelTemplatePluralCC,
			pluralDefault: defaultData.modelTemplatePlural,

			indents: 0,
		},

		{
			singularKey: "projectNumber",
			singularValue: data.projectNumberCC,
			singularDefault: defaultData.projectNumber,
			pluralKey: "projectNumberPlural",
			pluralValue: data.projectNumberPluralCC,
			pluralDefault: defaultData.projectNumberPlural,

			indents: 0,
		},

		{
			singularKey: "location",
			singularValue: data.locationCC,
			singularDefault: defaultData.location,
			pluralKey: "locationPlural",
			pluralValue: data.locationPluralCC,
			pluralDefault: defaultData.locationPlural,

			indents: 0,
		},

		{
			singularKey: "arrangement",
			singularValue: data.arrangementCC,
			singularDefault: defaultData.arrangement,
			pluralKey: "arrangementPlural",
			pluralValue: data.arrangementPluralCC,
			pluralDefault: defaultData.arrangementPlural,

			indents: 0,
		},

		{
			singularKey: "stage",
			singularValue: data.stageCC,
			singularDefault: defaultData.stage,
			pluralKey: "stagePlural",
			pluralValue: data.stagePluralCC,
			pluralDefault: defaultData.stagePlural,

			indents: 0,
		},

		{
			singularKey: "zone",
			singularValue: data.zoneCC,
			singularDefault: defaultData.zone,
			pluralKey: "zonePlural",
			pluralValue: data.zonePluralCC,
			pluralDefault: defaultData.zonePlural,

			indents: 0,
		},

		{
			singularKey: "interval",
			singularValue: data.intervalCC,
			singularDefault: defaultData.interval,
			pluralKey: "intervalPlural",
			pluralValue: data.intervalPluralCC,
			pluralDefault: defaultData.intervalPlural,

			indents: 0,
		},

		{
			singularKey: "taskListNo",
			singularValue: data.taskListNoCC,
			singularDefault: defaultData.taskListNo,
			pluralKey: "taskListNoPlural",
			pluralValue: data.taskListNoPluralCC,
			pluralDefault: defaultData.taskListNoPlural,

			indents: 1,
		},

		{
			singularKey: "question",
			singularValue: data.questionCC,
			singularDefault: defaultData.question,
			pluralKey: "questionPlural",
			pluralValue: data.questionPluralCC,
			pluralDefault: defaultData.questionPlural,

			indents: 0,
		},

		{
			singularKey: "task",
			singularValue: data.taskCC,
			singularDefault: defaultData.task,
			pluralKey: "taskPlural",
			pluralValue: data.taskPluralCC,
			pluralDefault: defaultData.taskPlural,

			indents: 0,
		},

		{
			singularKey: "actionRequired",
			singularValue: data.actionRequiredCC,
			singularDefault: defaultData.actionRequired,
			pluralKey: "actionRequiredPlural",
			pluralValue: data.actionRequiredPluralCC,
			pluralDefault: defaultData.actionRequiredPlural,

			indents: 1,
		},

		{
			singularKey: "operatingMode",
			singularValue: data.operatingModeCC,
			singularDefault: defaultData.operatingMode,
			pluralKey: "operatingModePlural",
			pluralValue: data.operatingModePluralCC,
			pluralDefault: defaultData.operatingModePlural,

			indents: 1,
		},

		{
			singularKey: "system",
			singularValue: data.systemCC,
			singularDefault: defaultData.system,
			pluralKey: "systemPlural",
			pluralValue: data.systemPluralCC,
			pluralDefault: defaultData.systemPlural,

			indents: 1,
		},

		{
			singularKey: "safetyCritical",
			singularValue: data.safetyCriticalCC,
			singularDefault: defaultData.safetyCritical,
			pluralKey: "safetyCriticalPlural",
			pluralValue: data.safetyCriticalPluralCC,
			pluralDefault: defaultData.safetyCriticalPlural,

			indents: 1,
		},

		{
			singularKey: "part",
			singularValue: data.partCC,
			singularDefault: defaultData.part,
			pluralKey: "partPlural",
			pluralValue: data.partPluralCC,
			pluralDefault: defaultData.partPlural,

			indents: 1,
		},

		{
			singularKey: "partQuantity",
			singularValue: data.partQuantityCC,
			singularDefault: defaultData.partQuantity,
			pluralKey: "partQuantityPlural",
			pluralValue: data.partQuantityPluralCC,
			pluralDefault: defaultData.partQuantityPlural,

			indents: 2,
		},

		{
			singularKey: "partName",
			singularValue: data.partNameCC,
			singularDefault: defaultData.partName,
			pluralKey: "partNamePlural",
			pluralValue: data.partNamePluralCC,
			pluralDefault: defaultData.partNamePlural,

			indents: 2,
		},

		{
			singularKey: "partDescription",
			singularValue: data.partDescriptionCC,
			singularDefault: defaultData.partDescription,
			pluralKey: "partDescriptionPlural",
			pluralValue: data.partDescriptionPluralCC,
			pluralDefault: defaultData.partDescriptionPlural,

			indents: 2,
		},

		{
			singularKey: "partStockNumber",
			singularValue: data.partStockNumberCC,
			singularDefault: defaultData.partStockNumber,
			pluralKey: "partStockNumberPlural",
			pluralValue: data.partStockNumberPluralCC,
			pluralDefault: defaultData.partStockNumberPlural,

			indents: 2,
		},

		{
			singularKey: "tool",
			singularValue: data.toolCC,
			singularDefault: defaultData.tool,
			pluralKey: "toolPlural",
			pluralValue: data.toolPluralCC,
			pluralDefault: defaultData.toolPlural,

			indents: 1,
		},

		{
			singularKey: "toolQuantity",
			singularValue: data.toolQuantityCC,
			singularDefault: defaultData.toolQuantity,
			pluralKey: "toolQuantityPlural",
			pluralValue: data.toolQuantityPluralCC,
			pluralDefault: defaultData.toolQuantityPlural,

			indents: 2,
		},

		{
			singularKey: "toolDescription",
			singularValue: data.toolDescriptionCC,
			singularDefault: defaultData.toolDescription,
			pluralKey: "toolDescriptionPlural",
			pluralValue: data.toolDescriptionPluralCC,
			pluralDefault: defaultData.toolDescriptionPlural,

			indents: 2,
		},

		{
			singularKey: "lubricant",
			singularValue: data.lubricantCC,
			singularDefault: defaultData.lubricant,
			pluralKey: "lubricantPlural",
			pluralValue: data.lubricantPluralCC,
			pluralDefault: defaultData.lubricantPlural,

			indents: 1,
		},
		{
			singularKey: "permit",
			singularValue: data.permitCC,
			singularDefault: defaultData.permit,
			pluralKey: "permitPlural",
			pluralValue: data.permitCC,
			pluralDefault: defaultData.permitPlural,

			indents: 1,
		},

		{
			singularKey: "workbook",
			singularValue: data.workbookCC,
			singularDefault: defaultData.workbook,
			pluralKey: "workbookPlural",
			pluralValue: data.workbookPluralCC,
			pluralDefault: defaultData.workbookPlural,

			indents: 1,
		},

		{
			singularKey: "purpose",
			singularValue: data.purposeCC,
			singularDefault: defaultData.purpose,
			pluralKey: "purposePlural",
			pluralValue: data.purposePluralCC,
			pluralDefault: defaultData.purposePlural,

			indents: 2,
		},

		{
			singularKey: "procedure",
			singularValue: data.procedureCC,
			singularDefault: defaultData.procedure,
			pluralKey: "procedurePlural",
			pluralValue: data.procedurePluralCC,
			pluralDefault: defaultData.procedurePlural,

			indents: 2,
		},

		{
			singularKey: "possibleHazards",
			singularValue: data.possibleHazardsCC,
			singularDefault: defaultData.possibleHazards,
			pluralKey: "possibleHazardsPlural",
			pluralValue: data.possibleHazardsPluralCC,
			pluralDefault: defaultData.possibleHazardsPlural,

			indents: 2,
		},

		{
			singularKey: "additionalPPE",
			singularValue: data.additionalPPECC,
			singularDefault: defaultData.additionalPPE,
			pluralKey: "additionalPPEPlural",
			pluralValue: data.additionalPPEPluralCC,
			pluralDefault: defaultData.additionalPPEPlural,

			indents: 2,
		},

		{
			singularKey: "specification",
			singularValue: data.specificationCC,
			singularDefault: defaultData.specification,
			pluralKey: "specificationPlural",
			pluralValue: data.specificationPluralCC,
			pluralDefault: defaultData.specificationPlural,

			indents: 2,
		},

		{
			singularKey: "contaminationControls",
			singularValue: data.contaminationControlsCC,
			singularDefault: defaultData.contaminationControls,
			pluralKey: "contaminationControlsPlural",
			pluralValue: data.contaminationControlsPluralCC,
			pluralDefault: defaultData.contaminationControlsPlural,

			indents: 2,
		},

		{
			singularKey: "otherInformation",
			singularValue: data.otherInformationCC,
			singularDefault: defaultData.otherInformation,
			pluralKey: "otherInformationPlural",
			pluralValue: data.otherInformationPluralCC,
			pluralDefault: defaultData.otherInformationPlural,

			indents: 2,
		},

		{
			singularKey: "correctiveActions",
			singularValue: data.correctiveActionsCC,
			singularDefault: defaultData.correctiveActions,
			pluralKey: "correctiveActionsPlural",
			pluralValue: data.correctiveActionsPluralCC,
			pluralDefault: defaultData.correctiveActionsPlural,

			indents: 2,
		},

		{
			singularKey: "isolations",
			singularValue: data.isolationsCC,
			singularDefault: defaultData.isolations,
			pluralKey: "isolationsPlural",
			pluralValue: data.isolationsPluralCC,
			pluralDefault: defaultData.isolationsPlural,

			indents: 2,
		},

		{
			singularKey: "controls",
			singularValue: data.controlsCC,
			singularDefault: defaultData.controls,
			pluralKey: "controlsPlural",
			pluralValue: data.controlsPluralCC,
			pluralDefault: defaultData.controlsPlural,

			indents: 2,
		},

		{
			singularKey: "customField1",
			singularValue: data.customField1CC,
			singularDefault: defaultData.customField1,
			pluralKey: "customField1Plural",
			pluralValue: data.customField1PluralCC,
			pluralDefault: defaultData.customField1Plural,

			indents: 2,
		},

		{
			singularKey: "customField2",
			singularValue: data.customField2CC,
			singularDefault: defaultData.customField2,
			pluralKey: "customField2Plural",
			pluralValue: data.customField2PluralCC,
			pluralDefault: defaultData.customField2Plural,

			indents: 2,
		},

		{
			singularKey: "customField3",
			singularValue: data.customField3CC,
			singularDefault: defaultData.customField3,
			pluralKey: "customField3Plural",
			pluralValue: data.customField3PluralCC,
			pluralDefault: defaultData.customField3Plural,

			indents: 2,
		},

		{
			singularKey: "make",
			singularValue: data.makeCC,
			singularDefault: defaultData.make,
			pluralKey: "makePlural",
			pluralValue: data.makePluralCC,
			pluralDefault: defaultData.makePlural,

			indents: 0,
		},

		{
			singularKey: "model",
			singularValue: data.modelCC,
			singularDefault: defaultData.model,
			pluralKey: "modelPlural",
			pluralValue: data.modelPluralCC,
			pluralDefault: defaultData.modelPlural,

			indents: 0,
		},

		{
			singularKey: "modelType",
			singularValue: data.modelTypeCC,
			singularDefault: defaultData.modelType,
			pluralKey: "modelTypePlural",
			pluralValue: data.modelTypePluralCC,
			pluralDefault: defaultData.modelTypePlural,

			indents: 0,
		},
		{
			singularKey: "serialNumberRange",
			singularValue: data.serialNumberRangeCC,
			singularDefault: defaultData.serialNumberRange,
			pluralKey: "serialNumberRangePlural",
			pluralValue: data.serialNumberRangePluralCC,
			pluralDefault: defaultData.serialNumberRangePlural,

			indents: 0,
		},

		{
			singularKey: "developerName",
			singularValue: data.developerNameCC,
			singularDefault: defaultData.developerName,
			pluralKey: "developerNamePlural",
			pluralValue: data.developerNamePluralCC,
			pluralDefault: defaultData.developerNamePlural,

			indents: 0,
		},

		{
			singularKey: "role",
			singularValue: data.roleCC,
			singularDefault: defaultData.role,
			pluralKey: "rolePlural",
			pluralValue: data.rolePluralCC,
			pluralDefault: defaultData.rolePlural,

			indents: 0,
		},

		{
			singularKey: "tutorial",
			singularValue: data.tutorialCC,
			singularDefault: defaultData.tutorial,
			pluralKey: "tutorialPlural",
			pluralValue: data.tutorialPluralCC,
			pluralDefault: defaultData.tutorialPlural,

			indents: 0,
		},
		{
			singularKey: "notificationNumber",
			singularValue: data.notificationNumberCC,
			singularDefault: defaultData.notificationNumber,
			pluralKey: "notificationNumberPlural",
			pluralValue: data.notificationNumberPluralCC,
			pluralDefault: defaultData.notificationNumberPlural,

			indents: 1,
		},

		{
			singularKey: "feedback",
			singularValue: data.feedbackCC,
			singularDefault: defaultData.feedback,
			pluralKey: "feedbackPlural",
			pluralValue: data.feedbackPluralCC,
			pluralDefault: defaultData.feedbackPlural,

			indents: 0,
		},

		{
			singularKey: "changeRequired",
			singularValue: data.changeRequiredCC,
			singularDefault: defaultData.changeRequired,
			pluralKey: "changeRequiredPlural",
			pluralValue: data.changeRequiredPluralCC,
			pluralDefault: defaultData.changeRequiredPlural,

			indents: 1,
		},

		{
			singularKey: "benefit",
			singularValue: data.benefitCC,
			singularDefault: defaultData.benefit,
			pluralKey: "benefitPlural",
			pluralValue: data.benefitPluralCC,
			pluralDefault: defaultData.benefitPlural,

			indents: 1,
		},

		{
			singularKey: "classification",
			singularValue: data.classificationCC,
			singularDefault: defaultData.classification,
			pluralKey: "classificationPlural",
			pluralValue: data.classificationPluralCC,
			pluralDefault: defaultData.classificationPlural,

			indents: 1,
		},

		{
			singularKey: "priority",
			singularValue: data.priorityCC,
			singularDefault: defaultData.priority,
			pluralKey: "priorityPlural",
			pluralValue: data.priorityPluralCC,
			pluralDefault: defaultData.priorityPlural,

			indents: 1,
		},

		{
			singularKey: "feedbackStatus",
			singularValue: data.feedbackStatusCC,
			singularDefault: defaultData.feedbackStatus,
			pluralKey: "feedbackStatusPlural",
			pluralValue: data.feedbackStatusPluralCC,
			pluralDefault: defaultData.feedbackStatusPlural,

			indents: 1,
		},

		{
			singularKey: "user",
			singularValue: data.userCC,
			singularDefault: defaultData.user,
			pluralKey: "userPlural",
			pluralValue: data.userPluralCC,
			pluralDefault: defaultData.userPlural,

			indents: 0,
		},

		{
			singularKey: "position",
			singularValue: data.positionCC,
			singularDefault: defaultData.position,
			pluralKey: "positionPlural",
			pluralValue: data.positionPluralCC,
			pluralDefault: defaultData.positionPlural,

			indents: 1,
		},
		{
			singularKey: "userReference",
			singularValue: data.userReferenceCC,
			singularDefault: defaultData.userReference,
			pluralKey: "userReferencePlural",
			pluralValue: data.userReferencePluralCC,
			pluralDefault: defaultData.userReferencePlural,

			indents: 1,
		},

		{
			singularKey: "service",
			singularValue: data.serviceCC,
			singularDefault: defaultData.service,
			pluralKey: "servicePlural",
			pluralValue: data.servicePluralCC,
			pluralDefault: defaultData.servicePlural,

			indents: 0,
		},

		{
			singularKey: "serviceWorkOrder",
			singularValue: data.serviceWorkOrderCC,
			singularDefault: defaultData.serviceWorkOrder,
			pluralKey: "serviceWorkOrderPlural",
			pluralValue: data.serviceWorkOrderPluralCC,
			pluralDefault: defaultData.serviceWorkOrderPlural,

			indents: 1,
		},

		{
			singularKey: "pauseReason",
			singularValue: data.pauseReasonCC,
			singularDefault: defaultData.pauseReason,
			pluralKey: "pauseReasonPlural",
			pluralValue: data.pauseReasonPluralCC,
			pluralDefault: defaultData.pauseReasonPlural,

			indents: 1,
		},

		{
			singularKey: "stopReason",
			singularValue: data.stopReasonCC,
			singularDefault: defaultData.stopReason,
			pluralKey: "stopReasonPlural",
			pluralValue: data.stopReasonPluralCC,
			pluralDefault: defaultData.stopReasonPlural,

			indents: 1,
		},

		{
			singularKey: "skipReason",
			singularValue: data.skipReasonCC,
			singularDefault: defaultData.skipReason,
			pluralKey: "skipReasonPlural",
			pluralValue: data.skipReasonPluralCC,
			pluralDefault: defaultData.skipReasonPlural,

			indents: 1,
		},

		{
			singularKey: "defect",
			singularValue: data.defectCC,
			singularDefault: defaultData.defect,
			pluralKey: "defectPlural",
			pluralValue: data.defectPluralCC,
			pluralDefault: defaultData.defectPlural,
			indents: 0,
		},

		{
			singularKey: "defectWorkOrder",
			singularValue: data.defectWorkOrderCC,
			singularDefault: defaultData.defectWorkOrder,
			pluralKey: "defectWorkOrderPlural",
			pluralValue: data.defectWorkOrderPluralCC,
			pluralDefault: defaultData.defectWorkOrderPlural,

			indents: 1,
		},

		{
			singularKey: "defectStatus",
			singularValue: data.defectStatusCC,
			singularDefault: defaultData.defectStatus,
			pluralKey: "defectStatusPlural",
			pluralValue: data.defectStatusPluralCC,
			pluralDefault: defaultData.defectStatusPlural,

			indents: 1,
		},

		{
			singularKey: "defectType",
			singularValue: data.defectTypeCC,
			singularDefault: defaultData.defectType,
			pluralKey: "defectTypePlural",
			pluralValue: data.defectTypePluralCC,
			pluralDefault: defaultData.defectTypePlural,

			indents: 1,
		},

		{
			singularKey: "riskRating",
			singularValue: data.riskRatingCC,
			singularDefault: defaultData.riskRating,
			pluralKey: "riskRatingPlural",
			pluralValue: data.riskRatingPluralCC,
			pluralDefault: defaultData.riskRatingPlural,

			indents: 1,
		},

		{
			singularKey: "riskRatingAction",
			singularValue: data.riskRatingActionCC,
			singularDefault: defaultData.riskRatingAction,
			pluralKey: "riskRatingActionPlural",
			pluralValue: data.riskRatingActionPluralCC,
			pluralDefault: defaultData.riskRatingActionPlural,

			indents: 2,
		},

		{
			singularKey: "riskRatingMatrix",
			singularValue: data.riskRatingMatrixCC,
			singularDefault: defaultData.riskRatingMatrix,
			pluralKey: "riskRatingMatrixPlural",
			pluralValue: data.riskRatingMatrixPluralCC,
			pluralDefault: defaultData.riskRatingMatrix,
			indents: 1,
		},

		{
			singularKey: "department",
			singularValue: data.departmentCC,
			singularDefault: defaultData.department,
			pluralKey: "departmentPlural",
			pluralValue: data.departmentPluralCC,
			pluralDefault: defaultData.department,

			indents: 0,
		},

		{
			singularKey: "asset",
			singularValue: data.assetCC,
			singularDefault: defaultData.asset,
			pluralKey: "assetPlural",
			pluralValue: data.assetPluralCC,
			pluralDefault: defaultData.asset,

			indents: 0,
		},

		{
			singularKey: "assetReference",
			singularValue: data.assetReferenceCC,
			singularDefault: defaultData.assetReference,
			pluralKey: "assetReferencePlural",
			pluralValue: data.assetReferencePluralCC,
			pluralDefault: defaultData.assetReference,

			indents: 1,
		},

		{
			singularKey: "assetPlannerGroup",
			singularValue: data.assetPlannerGroupCC,
			singularDefault: defaultData.assetPlannerGroup,
			pluralKey: "assetPlannerGroupPlural",
			pluralValue: data.assetPlannerGroupPluralCC,
			pluralDefault: defaultData.assetPlannerGroup,

			indents: 1,
		},

		{
			singularKey: "assetMainWorkCenter",
			singularValue: data.assetMainWorkCenterCC,
			singularDefault: defaultData.assetMainWorkCenter,
			pluralKey: "assetMainWorkCenterPlural",
			pluralValue: data.assetMainWorkCenterPluralCC,
			pluralDefault: defaultData.assetMainWorkCenter,

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
						CC?.singularDefault,
						CC?.singularValue,
						CC?.pluralDefault,
						CC?.pluralValue,
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
								className={cx(
									classes.headerRow,
									classes.tableHeadRow,
									classes.rowWithRightRow
								)}
							>
								<AT.CellContainer>Standard Caption</AT.CellContainer>
							</TableCell>

							<TableCell
								className={cx(
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
								className={cx(classes.headerRow, classes.tableHeadRow)}
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
									key={CC?.singularKey}
									singularKey={CC?.singularKey}
									singularValue={CC?.singularValue}
									singularDefault={CC?.singularDefault}
									pluralKey={CC?.pluralKey}
									pluralValue={CC?.pluralValue}
									pluralDefault={CC?.pluralDefault}
									handleUpdateCustomCaption={handleUpdateCustomCaption}
									indents={CC?.indents}
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
