import React from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CommonTable from "pages/Services/ServiceDetails/Impacts/CommonTable";
import { TableContainer, Typography } from "@mui/material";
import { dateDifference, isoDateWithoutTimeZone } from "helpers/utils";
import Grid from "@mui/material/Grid";
import ServiceStages from "./ServiceStages";

const useStyles = makeStyles()((theme) => ({
	headerText: {
		marginTop: 10,
		fontWeight: 800,
		fontSize: 20,
		marginBottom: "5px",
	},
	tableContainer: {
		marginTop: 40,
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},
	noDataTableRow: {
		borderBottom: "none !important",
	},
	footerLabel: {
		fontWeight: 600,
		fontSize: 15,
		marginBottom: "3px",
	},
	footerText: {
		fontWeight: 400,
		fontSize: "0.875rem",
		marginBottom: "3px",
	},
	main: {
		display: "flex",
		flexDirection: "column",
	},
	childClass: {
		display: "flex",
		margin: "5px 0",
	},
	headingText: {
		width: 100,
	},
}));

export default function ServiceReport({
	completedService: rows,
	roleName,
	customCaptions,
	formatQuestion,
	groupByStage,
	isPrint,
}) {
	const { classes, cx } = useStyles();
	return (
		<>
			<TableContainer>
				<Table aria-label="collapsible table">
					<TableBody>
						{rows?.map((row) => (
							<React.Fragment>
								<span style={{ fontWeight: "800px", marginTop: "-10px" }}>
									{`Session Started by ${row?.displayName} at ${
										row.startDate &&
										isoDateWithoutTimeZone(row?.startDate + "Z")
									}
									`}
								</span>
								<TableRow
									key={row.id}
									sx={{ "& > *": { borderBottom: "unset" } }}
								>
									<TableCell
										className={classes.noDataTableRow}
										component="th"
										scope="row"
									>
										{row.displayName}
									</TableCell>
									<TableCell align="center">
										{row.startDate &&
											isoDateWithoutTimeZone(row?.startDate + "Z")}
									</TableCell>
									<TableCell align="center">
										{row.endDate && isoDateWithoutTimeZone(row?.endDate + "Z")}
									</TableCell>
								</TableRow>
								{row?.questions?.filter((d) => d?.timing === "B")?.length >
									0 && (
									<TableRow>
										<TableCell colSpan={10}>
											<Typography className={classes.headerText}>
												Start Questions
											</Typography>
											<CommonTable
												headers={[
													"Question",
													`${customCaptions?.user}`,
													"Question Response",
													"Question Response date",
												]}
												columns={["caption", "displayName", "response", "date"]}
												isPrint={isPrint}
												data={formatQuestion(
													row?.questions?.filter((d) => d?.timing === "B"),
													row?.displayName
												)}
											/>
										</TableCell>
									</TableRow>
								)}
								{row?.tasks.length > 0 && groupByStage(row?.tasks).length > 0 && (
									<TableRow>
										<TableCell colSpan={18}>
											<ServiceStages
												completedBy={row?.displayName}
												tasks={groupByStage(row?.tasks)}
												customCaptions={customCaptions}
												formatQuestion={formatQuestion}
												showSkipped
											/>
										</TableCell>
									</TableRow>
								)}

								{row?.pauses.length > 0 && (
									<TableRow>
										<TableCell colSpan={18}>
											<CommonTable
												headers={[
													"Pause",
													"Pause Subcategory",
													"Other Reason",
													`${customCaptions?.user}`,
													"Start Date",
													"End Date",
													"Duration",
												]}
												columns={[
													"pauseReason",
													"pauseSubcategory",
													"pauseOtherReason",
													"displayName",
													"startDate",
													"endDate",
													"duration",
												]}
												isPrint={isPrint}
												data={row.pauses?.map((x) => ({
													...x,
													startDate: isoDateWithoutTimeZone(x.startDate + "Z"),
													endDate: isoDateWithoutTimeZone(x.endDate + "Z"),
													duration: dateDifference(x.endDate, x.startDate),
													displayName: row?.displayName,
												}))}
											/>
										</TableCell>
									</TableRow>
								)}

								{row?.question?.filter((d) => d?.timing === "E")?.length >
									0 && (
									<TableRow>
										<TableCell colSpan={10}>
											<Typography className={classes.headerText}>
												End Questions
											</Typography>
											<CommonTable
												headers={[
													"Question",
													`${customCaptions?.user}`,
													"Question Response",
													"Question Response date",
												]}
												columns={["caption", "displayName", "response", "date"]}
												data={formatQuestion(
													row?.questions?.filter((d) => d?.timing === "E")
												)}
											/>
										</TableCell>
									</TableRow>
								)}
								{row.endDate && (
									<React.Fragment>
										<Typography className={classes.headerText}>
											End of {customCaptions?.service} session{" "}
										</Typography>
										<TableRow>
											<TableCell colSpan={10}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={6}>
														<div className={classes.main}>
															<div className={classes.childClass}>
																<Typography
																	className={cx(
																		classes.headingText,
																		classes.footerLabel
																	)}
																	component="span"
																>
																	Name
																</Typography>
																<Typography
																	className={cx(
																		classes.responseData,
																		classes.footerText
																	)}
																	component="span"
																>
																	{row?.displayName}
																</Typography>
															</div>
															<div className={classes.childClass}>
																<Typography
																	className={cx(
																		classes.headingText,
																		classes.footerLabel
																	)}
																	component="span"
																>
																	Role
																</Typography>
																<Typography
																	className={cx(
																		classes.responseData,
																		classes.footerText
																	)}
																	component="span"
																>
																	{roleName}
																</Typography>
															</div>
															<div className={classes.childClass}>
																<Typography
																	className={cx(
																		classes.headingText,
																		classes.footerLabel
																	)}
																	component="span"
																>
																	Date
																</Typography>
																<Typography
																	className={cx(
																		classes.responseData,
																		classes.footerText
																	)}
																	component="span"
																>
																	{isoDateWithoutTimeZone(
																		row?.endDate
																			? row.endDate + "Z"
																			: row.endDate
																	)}
																</Typography>
															</div>
														</div>
													</Grid>

													{row.signatureURL && (
														<Grid item xs={6}>
															<div>
																<img
																	src={row.signatureURL}
																	style={{
																		width: "100%",
																		height: "100%",
																		maxHeight: "400px",
																		maxWidth: "600px",
																		objectFit: "contain",
																	}}
																	alt="signature"
																/>
															</div>
														</Grid>
													)}
												</Grid>
											</TableCell>
										</TableRow>
									</React.Fragment>
								)}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
