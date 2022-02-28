import React from "react";
import {
	Paper,
	Table,
	TableCell,
	TableBody,
	TableRow,
} from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import Row from "./Row";

const AT = TableStyle();

function ListStages({
	classes,
	data,
	assets,
	count,
	postStage,
	deleteStage,
	patchStage,
	pageChange,
	modelType,
}) {
	let headers = ["Selected", "Name"];
	// If modelType is facility based model (F), then asset header column is shown
	if (modelType === "F") {
		headers.push("Assets");
	}

	return (
		<AT.TableContainer component={Paper} elevation={0}>
			<Table aria-label="Table">
				<AT.TableHead>
					<TableRow className={classes.tableHead}>
						{headers.map((header) => (
							<TableCell key={header} className={classes.tableHeadRow}>
								<AT.CellContainer className="flex justify-between">
									{header}
								</AT.CellContainer>
							</TableCell>
						))}
					</TableRow>
				</AT.TableHead>
				<TableBody>
					{data.length === 0 && "No Records Found"}
					{data.map((x) => (
						<Row
							x={x}
							key={x.modelVersionStageID}
							assets={assets}
							count={count}
							postStage={postStage}
							deleteStage={deleteStage}
							patchStage={patchStage}
							pageChange={pageChange}
							modelType={modelType}
						/>
					))}
				</TableBody>
			</Table>
		</AT.TableContainer>
	);
}

export default ListStages;
