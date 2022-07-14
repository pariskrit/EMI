import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CommonTable from "../../../pages/Services/ServiceDetails/Impacts/CommonTable";
import { TableContainer, Typography } from "@material-ui/core";
import { formatAMPM, isoDateWithoutTimeZone } from "helpers/utils";
import { changeDate } from "helpers/date";
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
}) {
	console.log(rows);
	function setQuestionResponse(question) {
		switch (question.type) {
			case "S":
			case "L":
				return question?.valueString;

			case "N":
				return question?.valueNumeric;

			case "D":
				return changeDate(question?.valueDate);

			case "T":
				return formatAMPM(question?.valueDate);

			case "O":
				return commaSeperateValues(question?.options);

			case "C":
			case "B":
				return question?.valueBoolean
					? question?.checkboxCaption
					: commaSeperateValues(question?.options);

			default:
				return question?.valueBoolean;
		}
	}

	function commaSeperateValues(options) {
		let values = options?.map((op) => op?.name);
		return values.join(", ");
	}

	function formatQuestion(questions) {
		return questions?.map((q) => {
			return {
				...q,
				date: q.date ? isoDateWithoutTimeZone(q.date + "Z") : "",
				response: setQuestionResponse(q),
			};
		});
	}

	const groupBySize = (data) => {
		const groupbyData = data.reduce((group, current) => {
			const { zoneName } = current;
			if (zoneName) {
				group[zoneName] = group[zoneName] ?? [];
				group[zoneName].push(current);
			}
			return group;
		}, {});

		let newArray = [];

		if (groupbyData) {
			newArray = Object.keys(groupbyData).map((key) => {
				let newdict = { name: "", data: [] };
				return {
					...newdict,
					name: key,
					header: groupbyData[key][0]["stageName"],
					data: groupbyData[key],
				};
			});
		}
		return newArray;
	};

	const classes = useStyles();
	return (
		<>
			<TableContainer>
				<Table aria-label="collapsible table">
					<TableHead className={classes.tableHead}>
						<TableRow>
							<TableCell>User</TableCell>
							<TableCell align="center">Session Start Date</TableCell>
							<TableCell align="center">Session End Date</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows?.map((row) => (
							<React.Fragment>
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

								{row?.tasks.length > 0 && groupBySize(row?.tasks).length > 0 && (
									<TableRow>
										<TableCell colSpan={18}>
											<ServiceStages
												tasks={groupBySize(row?.tasks)}
												customCaptions={customCaptions}
												formatQuestion={formatQuestion}
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
