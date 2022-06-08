import React from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import {
	dateDifference,
	isoDateWithoutTimeZone,
	sortFromDate,
} from "helpers/utils";

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
							<TableCell>Total Time</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length ? (
							sortFromDate(data, "startDate")?.map((row) => (
								<TableRow key={row?.id}>
									<TableCell style={{ width: "170px" }}>
										{row?.displayName}
									</TableCell>
									<TableCell style={{ width: "170px" }}>
										{isoDateWithoutTimeZone(row?.startDate)}
									</TableCell>
									<TableCell style={{ width: "170px" }}>
										{isoDateWithoutTimeZone(row?.endDate)}
									</TableCell>
									<TableCell style={{ width: "170px" }}>
										{dateDifference(row?.endDate, row?.startDate)}
									</TableCell>
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
