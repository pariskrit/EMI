import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { isoDateWithoutTimeZone } from "helpers/utils";
import React from "react";
import { makeStyles } from "tss-react/mui";
import Icon from "components/Elements/Icon";

const useStyles = makeStyles()((theme) => ({
	headerText: {
		fontWeight: 600,
		fontSize: 20,
		marginBottom: "5px",
	},
	stageheader: {
		fontWeight: 800,
		fontSize: 20,
		marginBottom: "5px",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		display: "table-row-group",
		// border: "1px solid",
	},
	noDataTableRow: {
		borderBottom: "none !important",
	},
	// tableBody: {
	// 	border: "1px solid",
	// },
}));

function dynamicWidth(i) {
	if (i === 0) {
		return {
			width: "40vw",
		};
	}

	if (i === 1) {
		return { width: "30vw" };
	}
}

const ServiceStages = ({
	tasks,
	formatQuestion,
	customCaptions,
	completedBy = "",
	showSkipped,
}) => {
	const { classes, cx } = useStyles();

	return (
		<>
			{tasks?.map((task) => (
				<>
					<Typography className={classes.stageheader}>
						{task?.stagename}
					</Typography>

					{task.stageData.map((stage) => (
						<>
							<Typography className={classes.headerText}>
								{stage?.zonename}
							</Typography>
							<Table
								className={classes.tableContainer}
								style={{ marginBottom: "10px" }}
							>
								<TableHead className={classes.tableHead}>
									<TableRow>
										{[
											customCaptions?.task,
											"Completed By",
											"Completion Date",
										].map((header, i) => (
											<TableCell key={header} style={dynamicWidth(i)}>
												{i === 0 && (
													<span style={{ opacity: 0, marginLeft: "20px" }}>
														<Icon name="SafteryCritical" />
													</span>
												)}
												{header}
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody className={classes.tableBody}>
									{stage?.zoneData
										?.map((zone) => {
											return {
												...zone,
												completedDate: zone.completedDate
													? isoDateWithoutTimeZone(zone.completedDate + "Z")
													: showSkipped
													? "Skipped"
													: "",
												actionName: (
													<span style={{ marginRight: "10px" }}>
														{zone.safetyCritical ? (
															<Icon name="SafteryCritical" />
														) : (
															<span style={{ opacity: 0 }}>
																<Icon name="SafteryCritical" />
															</span>
														)}
														<span style={{ marginLeft: "20px" }}>
															{zone.actionName} {zone.taskName}
														</span>
													</span>
												),
												completedBy,
											};
										})
										.map((t) => (
											<>
												<TableRow>
													{["actionName", "completedBy", "completedDate"].map(
														(column, i) => (
															<TableCell key={column}>{t[column]}</TableCell>
														)
													)}
												</TableRow>

												{t?.questions &&
													formatQuestion(t?.questions).map((q) => (
														<TableRow
															style={{
																backgroundColor: "rgba(214, 212, 212,0.6)",
															}}
														>
															<TableCell>
																{" "}
																<span
																	style={{ opacity: 0, marginLeft: "10px" }}
																>
																	<Icon name="SafteryCritical" />
																</span>
																<span style={{ marginLeft: "12px" }}>
																	{q?.caption}
																</span>
															</TableCell>
															{
																<TableCell colSpan={2}>
																	<div
																		style={{
																			border: q?.response
																				? "1px solid"
																				: "none",
																			width: "100%",
																			minHeight: "30px",
																			padding: "5px",
																		}}
																	>
																		{q?.response ? q.response : ""}
																	</div>
																</TableCell>
															}
														</TableRow>
													))}
											</>
										))}
								</TableBody>
							</Table>
						</>
					))}
				</>
			))}
		</>
	);
};

export default ServiceStages;
