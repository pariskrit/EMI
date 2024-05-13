import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { Link } from "react-router-dom";
import TableStyle from "styles/application/TableStyle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ColourConstants from "helpers/colourConstants";
import {
	analyticsPath,
	appPath,
	completedOutstangindDefectPath,
	conditionMonitoringPath,
	defectsByRiskRatingPath,
	defectsBySystemPath,
	defectsByTypePath,
	defectsRegisteredPath,
	missingPartsToolsPath,
	overdueServicesPath,
	plannedWorkPath,
	serviceAverageTime,
	servicePausePath,
	serviceSkippedPath,
	serviceStatusPath,
	serviceStopPath,
} from "helpers/routePaths";
import TabTitle from "components/Elements/TabTitle";
import { Typography } from "@mui/material";
import DetailsPanel from "components/Elements/DetailsPanel";
import { useDispatch, useSelector } from "react-redux";
import updateStorage from "helpers/updateStorage";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import { showError } from "redux/common/actions";

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
	selectedTableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackgroundSelected,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	nameRow: {
		width: "40%",
	},
	dataCell: {
		height: 55,
	},
	nameLink: {
		color: ColourConstants.activeLink,
	},
	lastCell: {
		borderBottom: "none",
	},
	title: {
		display: "inline-block",
		marginBottom: "20px",
		fontSize: "20px",
		fontWeight: "bold",
	},
}));

const AnalyticsListPage = () => {
	const { classes, cx } = useStyles();

	const {
		application,
		customCaptions: {
			defectPlural,
			type,
			riskRating,
			system,
			partPlural,
			toolPlural,
			servicePlural,
			pauseReasonPlural,
			task,
			service,
		},
		siteAppID,
	} = JSON.parse(sessionStorage.getItem("me")) ||
	JSON.parse(localStorage.getItem("me"));

	const [siteAppState, setSiteAppState] = useState({ application });
	const reduxDispatch = useDispatch();

	const fetchSiteApplicationDetails = async () => {
		try {
			const result = await getSiteApplicationDetail(siteAppID);
			setSiteAppState(result?.data);
		} catch (error) {
			reduxDispatch(showError(error?.response?.data || "something went wrong"));
		}
	};

	const data = [
		{
			name: `${defectPlural} by ${type ? type : "Type"}`,
			path: defectsByTypePath,
		},
		{
			name: `${defectPlural} by ${riskRating}`,
			path: defectsByRiskRatingPath,
		},
		...(siteAppState.application?.showSystem
			? [
					{
						name: `${defectPlural} by ${system}`,
						path: defectsBySystemPath,
					},
			  ]
			: []),
		{
			name: `${defectPlural} Registered`,
			path: defectsRegisteredPath,
		},

		{
			name: `Missing ${
				siteAppState.application?.showParts
					? `${partPlural ?? "Parts"} and `
					: ""
			}  ${toolPlural} by Reason`,
			path: missingPartsToolsPath,
		},
		{ name: `Overdue ${servicePlural}`, path: overdueServicesPath },
		{ name: `Planned Work Compliance`, path: plannedWorkPath },
		{
			name: `${service} ${pauseReasonPlural}`,
			path: servicePausePath,
		},
		{
			name: `${service} Skipped ${task} Reasons`,
			path: serviceSkippedPath,
		},
		{
			name: `${service} Status Change Reasons`,
			path: serviceStatusPath,
		},
		{ name: `${service} Stop Reasons`, path: serviceStopPath },
		{ name: `Condition Monitoring`, path: conditionMonitoringPath },
		{
			name: `Completed vs Outstanding ${defectPlural}`,
			path: completedOutstangindDefectPath,
		},
		{
			name: `${service} Average Times`,
			path: serviceAverageTime,
		},
	];

	useEffect(() => {
		fetchSiteApplicationDetails();
		if (siteAppID) updateStorage(siteAppID);
	}, []);
	return (
		<>
			<TabTitle title={`Analytics`} />
			<div className="container">
				<Typography className={classes.title} component="h1" gutterBottom>
					<strong>Analytics</strong>
				</Typography>
				<div
					className="detailsContainer"
					style={{ alignItems: "center", marginTop: "-11px" }}
				>
					<DetailsPanel showHeader={false} description={`Analytics Graphs`} />
				</div>
				<AT.TableContainer component={Paper} elevation={0}>
					<Table aria-label="Table">
						<AT.TableHead>
							<TableRow className={classes.tableHead}>
								<TableCell
									className={cx(classes.nameRow, {
										[classes.selectedTableHeadRow]: true,
										[classes.tableHeadRow]: true,
									})}
								>
									<AT.CellContainer>Name</AT.CellContainer>
								</TableCell>
							</TableRow>
						</AT.TableHead>
						<TableBody>
							{data.map((row, index) => (
								<TableRow key={index}>
									<TableCell
										component="th"
										scope="row"
										className={cx(classes.dataCell, classes.nameRow, {
											[classes.lastCell]: index === data.length - 1,
										})}
									>
										<AT.CellContainer>
											<AT.TableBodyText>
												<Link className={classes.nameLink} to={row.path}>
													{row.name}
												</Link>
											</AT.TableBodyText>
										</AT.CellContainer>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</AT.TableContainer>
			</div>
		</>
	);
};

export default AnalyticsListPage;
