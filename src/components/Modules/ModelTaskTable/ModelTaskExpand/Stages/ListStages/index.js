import React from "react";
import { Table, TableCell, TableBody, TableRow } from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import Row from "./Row";
import clsx from "clsx";

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
	modelAccess,
	customCaption,
	setStages,
	siteId,
}) {
	return (
		<Table aria-label="Table" className={classes.table}>
			<AT.TableHead>
				<TableRow className={classes.tableHead}>
					<TableCell
						className={clsx(classes.nameRow, {
							[classes.tableHeadRow]: true,
						})}
					>
						Selected
					</TableCell>
					<TableCell
						style={{ width: "auto" }}
						className={clsx(classes.nameRow, {
							[classes.tableHeadRow]: true,
						})}
					>
						Name
					</TableCell>
					{modelType === "F" ? (
						<TableCell className={classes.tableHeadRow}>Assets</TableCell>
					) : null}
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
						modelAccess={modelAccess}
						customCaption={customCaption}
						setStages={setStages}
						siteId={siteId}
					/>
				))}
			</TableBody>
		</Table>
	);
}

export default ListStages;
