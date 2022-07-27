import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import CommonTable from "../../../pages/Services/ServiceDetails/Impacts/CommonTable";
import { TableContainer, Typography } from "@material-ui/core";
import { dateDifference, isoDateWithoutTimeZone } from "helpers/utils";
import Grid from "@material-ui/core/Grid";
import ServiceStages from "./ServiceStages";
import clsx from "clsx";

const useStyles = makeStyles({
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
});

export default function ServiceReport({
	completedService: rows,
	roleName,
	customCaptions,
	formatQuestion,
	groupByStage,
}) {
	const classes = useStyles();
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
													"Question Response",
													"Question Response date",
												]}
												columns={["caption", "response", "date"]}
												data={formatQuestion(
													row?.questions?.filter((d) => d?.timing === "B")
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
													"other Reasons",
													"Start Date",
													"End Date",
													"Duration",
												]}
												columns={[
													"pauseReason",
													"pauseSubcategory",
													"pauseOtherReason",
													"startDate",
													"endDate",
													"duration",
												]}
												data={row.pauses?.map((x) => ({
													...x,
													startDate: isoDateWithoutTimeZone(x.startDate + "Z"),
													endDate: isoDateWithoutTimeZone(x.endDate + "Z"),
													duration: dateDifference(x.endDate, x.startDate),
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
													"Question Response",
													"Question Response date",
												]}
												columns={["caption", "response", "date"]}
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
																	className={clsx(
																		classes.headingText,
																		classes.footerLabel
																	)}
																	component="span"
																>
																	Name
																</Typography>
																<Typography
																	className={clsx(
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
																	className={clsx(
																		classes.headingText,
																		classes.footerLabel
																	)}
																	component="span"
																>
																	Role
																</Typography>
																<Typography
																	className={clsx(
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
																	className={clsx(
																		classes.headingText,
																		classes.footerLabel
																	)}
																	component="span"
																>
																	Date
																</Typography>
																<Typography
																	className={clsx(
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
