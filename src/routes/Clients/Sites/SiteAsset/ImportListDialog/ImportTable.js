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
							<TableCell>Name</TableCell>
							<TableCell>Description</TableCell>
							{test && (
								<>
									<TableCell style={{ whiteSpace: "nowrap" }}>
										Reference Name
									</TableCell>
									<TableCell style={{ whiteSpace: "nowrap" }}>
										Reference Description
									</TableCell>
									<TableCell style={{ whiteSpace: "nowrap" }}>
										Reference Planner Group
									</TableCell>
									<TableCell style={{ whiteSpace: "nowrap" }}>
										Reference Work Center
									</TableCell>
								</>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((x, i) => (
							<TableRow key={i}>
								<TableCell>{x.assetName}</TableCell>
								<TableCell>{x.description}</TableCell>
								{test && (
									<>
										<TableCell>{x.referenceName}</TableCell>
										<TableCell>{x.referenceDescription}</TableCell>
										<TableCell>{x.referencePlannerGroup}</TableCell>
										<TableCell>{x.referenceWorkCenter}</TableCell>
									</>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}
};

export default ImportTable;
