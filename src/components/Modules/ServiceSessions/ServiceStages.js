import {
	makeStyles,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";
import { isoDateWithoutTimeZone } from "helpers/utils";
import React from "react";
import Icon from "components/Elements/Icon";

const useStyles = makeStyles((theme) => ({
	headerText: {
		fontWeight: 800,
		fontSize: 20,
		marginBottom: "5px",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		// border: "1px solid",
	},
	noDataTableRow: {
		borderBottom: "none !important",
	},
	// tableBody: {
	// 	border: "1px solid",
	// },
}));

const ServiceStages = ({ tasks, customCaptions, formatQuestion }) => {
	const classes = useStyles();
	return (
		<>
			<Typography className={classes.headerText}>
				Service Stages {tasks[0]["header"]}
			</Typography>
			{tasks?.map((task) => (
				<>
					<Typography className={classes.headerText}>{task?.name}</Typography>
					<Table
						className={classes.tableContainer}
						style={{ marginBottom: "10px" }}
					>
						<TableHead className={classes.tableHead}>
							<TableRow>
								{[
									"Action Name",
									"Task Name",
									"Completion Date",
									customCaptions.safetyCritical,
								].map((header) => (
									<TableCell key={header} style={{ width: "25%" }}>
										{header}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody className={classes.tableBody}>
							{task?.data
								?.map((task) => {
									return {
										...task,
										completedDate: task.completedDate ? (
											isoDateWithoutTimeZone(task.completedDate + "Z")
										) : (
											<span style={{ color: "red", fontSize: "15px" }}>
												Skipped
											</span>
										),
										showCritical: task.safetyCritical ? (
											<span style={{ marginLeft: "10px" }}>
												<Icon name="SafteryCritical" />
											</span>
										) : (
											""
										),
									};
								})
								.map((t) => (
									<>
										<TableRow>
											{[
												"actionName",
												"taskName",
												"completedDate",
												"showCritical",
											].map((column) => (
												<TableCell key={column}>{t[column]}</TableCell>
											))}
										</TableRow>

										{t?.questions &&
											formatQuestion(t?.questions).map((q) => (
												<TableRow
													style={{
														backgroundColor: "rgb(214, 212, 212,0.6)",
													}}
												>
													<TableCell></TableCell>
													<TableCell>{q?.caption}</TableCell>
													{
														<TableCell colSpan={2}>
															<div
																style={{
																	border: q?.response ? "1px solid" : "none",
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
	);
};

export default ServiceStages;
