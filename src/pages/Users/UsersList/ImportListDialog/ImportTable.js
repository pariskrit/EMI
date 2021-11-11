import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
	TableHead,
	Typography,
} from "@material-ui/core";
const ImportTable = ({ data, title }) => {
	const test = title.includes("References");
	if (data.length === 0) {
		return null;
	} else {
		return (
			<div style={{ marginTop: 15 }}>
				<Typography variant="h6">{title}</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{ whiteSpace: "nowrap" }}>FirstName</TableCell>
							<TableCell style={{ whiteSpace: "nowrap" }}>LastName</TableCell>
							<TableCell style={{ whiteSpace: "nowrap" }}>Email</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.map((x, i) => (
							<TableRow key={i}>
								<TableCell>{x.firstName}</TableCell>
								<TableCell>{x.lastName}</TableCell>
								<TableCell>{x.email}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}
};

export default ImportTable;
