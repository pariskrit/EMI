import React, { useState } from "react";
import { Table, TableCell, TableBody, TableRow } from "@mui/material";
import TableStyle from "styles/application/TableStyle";
import Row from "./Row";
import { makeStyles } from "tss-react/mui";
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
	fetchFromDropDwn,
	fetchTaskStages,
}) {
	const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
	const useStyles = makeStyles()((theme) => ({}));
	const { cx } = useStyles();
	return (
		<Table aria-label="Table" className={classes.table}>
			<AT.TableHead>
				<TableRow className={classes.tableHead}>
					<TableCell
						className={cx(classes.nameRow, {
							[classes.tableHeadRow]: true,
						})}
					>
						Selected
					</TableCell>
					<TableCell
						style={{ width: "auto" }}
						className={cx(classes.nameRow, {
							[classes.tableHeadRow]: true,
						})}
					>
						Name
					</TableCell>
					{modelType === "F" ? (
						<TableCell className={classes.tableHeadRow}>Assets</TableCell>
					) : null}
					{modelType === "F" ? (
						<TableCell
							style={{ width: "auto" }}
							className={cx(classes.nameRow, {
								[classes.tableHeadRow]: true,
							})}
						>
							{customCaption?.assetReference}
						</TableCell>
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
						fetchFromDropDwn={fetchFromDropDwn}
						page={page}
						setPage={setPage}
						fetchTaskStages={fetchTaskStages}
					/>
				))}
			</TableBody>
		</Table>
	);
}

export default ListStages;
