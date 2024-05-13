import React, { useEffect, useRef } from "react";
import Chart from "react-google-charts";
import { Link, useNavigate } from "react-router-dom";
import { appPath, servicesPath } from "helpers/routePaths";
import { serviceGarphId, statusOfServices } from "constants/serviceDetails";
import { makeStyles } from "tss-react/mui";
import TableStyle from "styles/application/TableStyle";
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
} from "@mui/material";
import ColourConstants from "helpers/colourConstants";
import {
	handleCustomDateRange,
	isoDateWithoutTimeZone,
	roundedToFixed,
} from "helpers/utils";
import Icon from "components/Elements/Icon";
import ProgressBar from "components/Elements/ProgressBar";
import useScreenSize from "hooks/useScreenSize";
import "styles/scss/components/ChartView.scss";
import AutoFitContentInScreen from "components/Layouts/AutoFitContentInScreen";

const formattedData = (data, history) => {
	return data.map((x) => ({
		...x,
		workOrder: (
			<Link
				to={`/app/services/${x.id}`}
				style={{
					color: ColourConstants.activeLink,
					cursor: "pointer",
					textDecoration: "none",
				}}
			>
				{x.workOrder}
			</Link>
		),

		status: (
			<span
				style={{
					display: "inline-flex",
					gap: 5,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Icon
					name={statusOfServices(x.status, x.tasksSkipped)}
					style={{ height: "17px", width: "17px" }}
				/>
				{statusOfServices(x.status, x.tasksSkipped)}
			</span>
		),
		percentageComplete: (
			<span style={{ width: "100%" }}>
				<ProgressBar
					value={roundedToFixed(x?.percentageComplete, 0)}
					customLabel={x?.percentageComplete === 100 ? "Complete" : undefined}
					height="30px"
					width={
						x.percentageComplete === 0 || x.percentageComplete > 20
							? "125px"
							: "50px"
					}
					bgColour={
						x?.percentageOverTime <= 5
							? "#23BB79"
							: x?.percentageOverTime > 5 && x?.percentageOverTime <= 10
							? "#ED8738"
							: "#E31212"
					}
					baseBgColor="#fafafa"
					labelAlignment={
						x.percentageComplete !== 0 && x.percentageComplete < 20
							? "outside"
							: "left"
					}
					labelColor={
						x.percentageComplete === 0
							? "#000000"
							: x.percentageComplete > 20
							? "#fff"
							: x?.percentageOverTime <= 5
							? "#23BB79"
							: x?.percentageOverTime > 5 && x?.percentageOverTime <= 10
							? "#ED8738"
							: "#E31212"
					}
					borderRadius="20px"
				/>
			</span>
		),
		percentageOverTime: (
			<span
				style={{
					color:
						x?.percentageOverTime <= 5
							? "#23BB79"
							: x?.percentageOverTime > 5 && x?.percentageOverTime <= 10
							? "#ED8738"
							: "#E31212",
				}}
			>
				{x?.percentageOverTime !== null ? `${x?.percentageOverTime}%` : ""}
			</span>
		),
		minutesOverTime: (
			<span
				style={{
					color:
						x?.percentageOverTime <= 5
							? "#23BB79"
							: x?.percentageOverTime > 5 && x?.percentageOverTime <= 10
							? "#ED8738"
							: "#E31212",
				}}
			>
				{x?.minutesOverTime !== null ? `${x?.minutesOverTime}` : ""}
			</span>
		),

		scheduledDate: isoDateWithoutTimeZone(x.scheduledDate + "Z"),
		estimatedMinutes: roundedToFixed(x.estimatedMinutes, 1),
		checkoutDate: x.checkoutDate
			? isoDateWithoutTimeZone(x.checkoutDate + "Z")
			: "",
	}));
};
const ChartView = ({ data, options, hoverFunc, tableDataContent, loading }) => {
	const navigate = useNavigate();
	const AT = TableStyle();
	const MAX_LOGO_HEIGHT = 47;
	const {
		customCaptions,
		application: { allowIndividualAssetModels },
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const media = "@media (max-width: 414px)";
	// const smallDevices = "@media (max-width: 1350px)";
	const largeDevices = "@media (max-width: 1650px)";

	const userStyles = makeStyles()((theme) => ({
		chartContainer: {
			backgroundColor: "#ffffff",
			display: "flex",
			flexDirection: "row",
			height: "auto",
			maxWidth: "100%",

			[largeDevices]: {
				maxWidth: "100%",
			},
		},
		innerTable: {
			display: "flex",
			flexDirection: "row",
			height: "auto",
			flex: "1",
			borderRightColor: "none",
		},
		chart: {
			position: "relative",
			display: "flex",
			flexDirection: "row",
			flex: "1",
			minWidth: "50%",
		},
		tableHeadRow: {
			borderBottomColor: ColourConstants.tableBorder,
			borderBottomStyle: "solid",
			borderBottomWidth: 1,
			backgroundColor: ColourConstants.tableBackground,
			fontWeight: "bold",
			borderRightColor: "#979797",
			borderRightStyle: "solid",
			borderRightWidth: "1px",
		},
		tableBody: {
			whiteSpace: "noWrap",
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
			height: 10,
			width: 130,
			[media]: {
				width: 130,
			},
		},
		clientsRow: {
			width: "20%",
		},
		dataCell: {
			height: 85,
		},
		nameLink: {
			color: ColourConstants.activeLink,
		},
		clientLogo: {
			maxHeight: MAX_LOGO_HEIGHT,
		},
		noImage: {
			color: ColourConstants.commonText,
			opacity: "50%",
		},
		lastCell: {
			borderBottom: "none",
		},
		row: {
			cursor: "pointer",
		},
		tableBodyTextStyle: {
			fontSize: "0.9rem",
			color: "#e5e5e5",
		},
		chartWorkOrderHeader: {
			position: "absolute",
			zIndex: "10",
			paddingLeft: "13px",
			fontSize: "0.875rem",
			lineHeight: "1.5rem",
			letterSpacing: "0.01071em",
			fontWeight: "600",
			borderLeft: "1px solid #e8e8e8",
			height: "29px",
			display: "flex",
			alignItems: "center",
		},
		chartViewTableContainer: {
			borderStyle: "solid",
			fontFamily: "Roboto Condensed",
			fontSize: 14,
			borderColor: ColourConstants.tableBorder,
			border: 1,
			borderRadius: 0,
		},
	}));

	const { classes, cx } = userStyles();
	const screenSize = useScreenSize();
	//for left column--table
	let headers = ["model", "interval", "role", "Status"];
	if (allowIndividualAssetModels) {
		headers.push("asset");
	}

	if (screenSize.width <= 1200) {
		headers = ["serviceWorkOrder", ...headers];
	}
	const filteredTableData = formattedData(tableDataContent, navigate)?.map(
		(item) => ({
			Status: item?.status,
			role: item?.role,
			interval: item?.interval,
			model: `${item?.modelName || ""} ${item?.model || ""}`,
			...(allowIndividualAssetModels ? { asset: item?.siteAssetName } : {}),
			serviceWorkOrder: item?.workOrder,
			id: item?.id,
		})
	);

	//----to set the fixed height of the container
	// based on the content(table-container)-height
	//due to unwanted space created by mui-table-container---
	const [tableHeight, setTableHeight] = React.useState();
	const axisHeight = useRef(null);
	useEffect(() => {
		const docs = document.getElementsByClassName("MuiTable-root");
		setTableHeight(docs[0]?.getBoundingClientRect().height);
	}, [loading]);

	let customChildPropsColour = formattedData(tableDataContent, navigate);
	customChildPropsColour.splice(0, 0, {}, {});
	//to update the colors as per the service list %completed bgColour
	const updatedOptions = {
		...options,
		gantt: {
			...options.gantt,
			palette: options.gantt.palette.map((item, index) => {
				if (index === 0) {
					return {
						...item,
					};
				} else if (index === 1) {
					return {
						...item,
						dark: customChildPropsColour[index + 1]?.percentageComplete.props
							.children.props?.bgColour,
					};
				} else {
					return {
						...item,
						dark: customChildPropsColour[index + 1]?.percentageComplete.props
							.children.props?.bgColour,
					};
				}
			}),
		},
	};

	return (
		<AutoFitContentInScreen containsTable={true} removeBorder={true}>
			<div
				className={classes.chartContainer}
				id="chartContainer"
				style={{
					height: `${tableHeight + 160}px`,
				}}
			>
				<div className={classes.innerTable}>
					<TableContainer
						component={Paper}
						elevation={0}
						style={{ overflow: "hidden", width: "100%", border: "none" }}
						id="tableContainer"
						className={classes.chartViewTableContainer}
					>
						<Table aria-label="Table">
							<AT.TableHead
								sx={{
									height: "30px",
									backgroundColor: "white",
									borderBottom: "2px solid #e8e8e8",
									".MuiTableCell-root": {
										padding: "2px 10px",
										backgroundColor: "white",
										borderLeft: "1px solid #E8E8E8",
										borderBottom: "0px solid transparent",
										borderTop: "0px solid transparent",
										borderRight: "0px solid transparent",
									},
								}}
							>
								<TableRow>
									{headers.map((header, i) => (
										<TableCell
											key={i}
											className={(cx(classes.nameRow), classes.tableHeadRow)}
										>
											<AT.CellContainer style={{ textWrap: "nowrap" }}>
												{customCaptions[header]
													? customCaptions[header]
													: header}
											</AT.CellContainer>
										</TableCell>
									))}
								</TableRow>
							</AT.TableHead>
							<TableBody className={classes.tableBody}>
								{filteredTableData.length ? (
									filteredTableData.map((row, index) => (
										<TableRow
											key={index}
											sx={{
												height: "30px",
												backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white",
												".MuiTableCell-root": {
													padding: "1px 10px",
													height: "29px",
													border: "0px solid transparent",
												},
											}}
											style={{
												borderTop: "0px solid #f5f5f5",
											}}
										>
											{headers?.map((col, index) => {
												return (
													<AT.DataCell key={index}>
														<AT.CellContainer key={index}>
															<AT.TableBodyText
																className={classes.tableBodyTextStyle}
															>
																{col === "workOrder" ? (
																	<span
																		style={{
																			display: "flex",
																			flexDirection: "space-around",
																			alignItems: "center",
																			gap: 10,
																		}}
																	>
																		{col === "modelName"
																			? row[col] + " " + row["model"]
																			: row[col]}
																	</span>
																) : (
																	row[col]
																)}
															</AT.TableBodyText>
														</AT.CellContainer>
													</AT.DataCell>
												);
											})}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell>No any records found</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
				<div
					className={classes.chart}
					style={{
						height: `${tableHeight + 160}px`,
						backgroundColor: "#ffffff",
						overflow: "hidden",
					}}
				>
					<span className={classes.chartWorkOrderHeader}>
						{customCaptions["serviceWorkOrder"]
							? customCaptions["serviceWorkOrder"]
							: "Work Order"}
					</span>
					<Chart
						style={{ paddingRight: "2px" }}
						id="serviceganttchartid"
						chartType="Gantt"
						width={"100%"}
						graphID={serviceGarphId}
						data={data}
						options={updatedOptions}
						chartEvents={[
							{
								eventName: "ready",
								callback: ({ chartWrapper, google }) => {
									const chart = chartWrapper.getChart();
									var observer = new MutationObserver(function (nodes) {
										Array.prototype.forEach.call(nodes, function (node) {
											if (node.addedNodes.length > 0) {
												Array.prototype.forEach.call(
													node.addedNodes,
													function (addedNode) {
														if (
															addedNode.tagName === "rect" &&
															addedNode.getAttribute("fill") === "white"
														) {
															if (
																addedNode.parentNode.getElementsByTagName(
																	"text"
																).length === 5
															) {
																addedNode.setAttribute("fill", "transparent");
																addedNode.setAttribute("stroke", "transparent");
																Array.prototype.forEach.call(
																	addedNode.parentNode.getElementsByTagName(
																		"text"
																	),
																	function (label) {
																		label.setAttribute("fill", "transparent");
																	}
																);
															}
														}
													}
												);
											}
										});
									});

									handleCustomDateRange(axisHeight, data);
									var container = document.getElementById(
										"serviceganttchartid"
									);
									observer.observe(container, {
										childList: true,
										subtree: true,
									});

									google.visualization.events.removeAllListeners(chart);
									var handler = () => {
										if (!chart.getSelection()?.[0]?.row) return;
										var selectedItem = chart.getSelection()?.[0];
										const routeId = data?.[selectedItem?.row + 1]?.[0];
										navigate(`${appPath}${servicesPath}/${routeId}`);
									};
									google.visualization.events.addListener(
										chart,
										"select",
										handler
									);
									if (hoverFunc)
										google.visualization.events.addListener(
											chart,
											"onmouseover",
											(e) => hoverFunc(e)
										);
								},
							},
						]}
					/>
				</div>
			</div>
		</AutoFitContentInScreen>
	);
};

export default ChartView;
