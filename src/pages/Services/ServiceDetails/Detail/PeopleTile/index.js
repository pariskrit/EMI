import React from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { sortFromDate } from "helpers/utils";

function PeopleTile({ classes, data = [], customCaptions }) {
	return (
		<AccordionBox title={"People"}>
			<div className={classes.inputContainer}>
				<Table>
					<TableHead className={classes.tableHead}>
						<TableRow>
							<TableCell style={{ width: "170px" }}>User</TableCell>
							<TableCell>Start Time</TableCell>
							<TableCell>End Time</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length ? (
							sortFromDate(data, "startTime")?.map((row) => (
								<TableRow>
									<TableCell style={{ width: "170px" }}>{row?.name}</TableCell>
									<TableCell style={{ width: "170px" }}>
										{row?.startTime}
									</TableCell>
									<TableCell style={{ width: "170px" }}>
										{row?.endTime}
									</TableCell>

									{/* <TableCell style={{ width: "100px" }}>{changeDate(row.date)}</TableCell> */}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell>No Records Found</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</AccordionBox>
	);
}

export default PeopleTile;
