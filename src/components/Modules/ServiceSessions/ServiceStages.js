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
import CommonTable from "pages/Services/ServiceDetails/Impacts/CommonTable";

import React, { useEffect, useState } from "react";

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

const ServiceStages = ({ tasks, formatQuestion }) => {
	const classes = useStyles();
	const [taskData, setTaskData] = useState([]);

	useEffect(() => {
		const mappedData = tasks.map((task) => {
			return {
				...task,
				completedDate: task.completedDate ? (
					isoDateWithoutTimeZone(task.completedDate + "Z")
				) : (
					<span style={{ color: "red", fontSize: "15px" }}>Skipped</span>
				),
			};
		});
		setTaskData(mappedData);
	}, [tasks]);

	return (
		<>
			<Typography className={classes.headerText}>Service Stages</Typography>
			{taskData?.map((task) => (
				<>
					<Typography className={classes.headerText}>
						{task?.zoneName}
					</Typography>
					<Table
						className={classes.tableContainer}
						style={{ marginBottom: "10px" }}
					>
						<TableHead className={classes.tableHead}>
							<TableRow>
								{["Action Name", "Task Name", "Completion Date"].map(
									(header) => (
										<TableCell key={header} style={{ width: "33%" }}>
											{header}
										</TableCell>
									)
								)}
							</TableRow>
						</TableHead>
						<TableBody className={classes.tableBody}>
							<TableRow>
								{["actionName", "taskName", "completedDate"].map((column) => (
									<TableCell key={column}>{task[column]}</TableCell>
								))}
							</TableRow>
							{task?.questions && (
								<TableRow>
									<TableCell colSpan={18}>
										<CommonTable
											columns={["caption", "response", "date"]}
											headers={[
												"QuestionCaption",
												"Question Response",
												"Question Response date",
											]}
											data={formatQuestion(task.questions)}
										/>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</>
			))}
		</>
	);
};

export default ServiceStages;
