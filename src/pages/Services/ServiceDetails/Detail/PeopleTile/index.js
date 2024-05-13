import React from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { dateDifference, isoDateWithoutTimeZone } from "helpers/utils";

function PeopleTile({ classes, data = [], customCaptions }) {
	return (
		<AccordionBox title={"People"}>
			<div className={classes.inputContainer}>
				<Table>
					<TableHead className={classes.tableHead}>
						<TableRow>
							<TableCell style={{ width: "170px" }}>
								{customCaptions?.user}
							</TableCell>
							<TableCell>Start Time</TableCell>
							<TableCell>End Time</TableCell>
							<TableCell>Total Time</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length ? (
							data?.map((row) => (
								<TableRow key={row?.id}>
									<TableCell style={{ width: "170px" }}>
										{row?.displayName}
									</TableCell>
									<TableCell style={{ width: "170px" }}>
										{isoDateWithoutTimeZone(row?.startDate + "Z")}
									</TableCell>
									<TableCell style={{ width: "170px" }}>
										{isoDateWithoutTimeZone(row?.endDate + "Z")}
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
