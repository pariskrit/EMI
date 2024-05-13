import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import TableStyle from "styles/application/TableStyle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ColourConstants from "helpers/colourConstants";
import ModelTaskRow from "./ModelTaskRow";
import TaskDetailContext from "contexts/TaskDetailContext";
import modelTaskScroller from "helpers/modelTaskScroller";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

const useStyles = makeStyles()((theme) => ({
	table: {
		borderStyle: "solid",
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		overflowX: "auto",
		borderColor: ColourConstants.tableBorder,
		borderWidth: 1,
		borderRadius: 0,
	},
	tableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackground,
		fontWeight: "bold",
		borderRightColor: "#979797",
		borderRightStyle: "solid",
		borderRightWidth: "1px",
	},
	selectedTableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackgroundSelected,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	nameRow: {
		width: "200px",
		height: "10px",
		lineHeight: "1rem",
	},
	clientsRow: {
		width: "20%",
	},
	dataCell: {
		height: 40,
	},
	nameLink: {
		color: ColourConstants.activeLink,
	},
	clientLogo: {
		maxHeight: MAX_LOGO_HEIGHT,
	},
	noImage: {
		color: ColourConstants.commonText,
		opacity: "50%",
	},
}));

const ModelTaskTable = ({
	currentTableSort,
	setCurrentTableSort,
	data,
	handleDelete,
	handleEdit,
	setData,
	headers,
	columns,
	modelId,
	handleCopy,
	handleCopyTaskQuestion,
	customCaptions,
	totalTaskCount,
	fetchData,
	access,
	isDataLoading,
	originalData,
	handleSortClick,
}) => {
	const { classes, cx } = useStyles();
	const [updatedField, setUpdatedField] = useState({ data: "" });
	// const observer = new IntersectionObserver(
	// 	(entries) => {
	// 		entries.forEach((entry) => {
	// 			if (entry.isIntersecting) {
	// 				entry.target.click();
	// 				setTimeout(() => {
	// 					entry.target.scrollIntoView({
	// 						behavior: "smooth",
	// 						block: "center",
	// 					});
	// 				}, 500);

	// 				observer.unobserve(entry.target);
	// 			}
	// 		});
	// 	},
	// 	{ threshold: 0.1 }
	// );

	useEffect(() => {
		const newElement = document.getElementById(
			`taskExpandable${updatedField.data}`
		);
		if (updatedField.data && newElement && !isDataLoading) {
			setUpdatedField({});
			modelTaskScroller(newElement);
		}
	}, [data, updatedField.data, isDataLoading]);
	return (
		<Table aria-label="Table" className={classes.table}>
			<AT.TableHead className={classes.taskHeader}>
				<TableRow className={classes.tableHead}>
					{headers.map((header, index) => (
						<TableCell
							key={header.id}
							onClick={() => {
								header?.isSort && handleSortClick(columns[index]);
							}}
							style={{ width: header?.width || "auto" }}
							className={cx(classes.nameRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === columns[index],
								[classes.tableHeadRow]: currentTableSort[0] !== columns[index],
							})}
						>
							<AT.CellContainer className="flex justify-between">
								{header.name}
								{header.isSort && (
									<div className="arrow">
										<AT.DescArrow
											fill={
												currentTableSort[0] === columns[index] &&
												currentTableSort[1] === "asc"
													? "#D2D2D9"
													: "#F9F9FC"
											}
											className="arrowUp"
										/>
										<AT.DefaultArrow
											fill={
												currentTableSort[0] === columns[index] &&
												currentTableSort[1] === "desc"
													? "#D2D2D9"
													: "#F9F9FC"
											}
											className="arrowDown"
										/>
									</div>
								)}
							</AT.CellContainer>
						</TableCell>
					))}
				</TableRow>
			</AT.TableHead>
			<TableBody>
				{data.length !== 0 && !isDataLoading ? (
					data.map((row, index) => (
						<TaskDetailContext key={row.id}>
							<ModelTaskRow
								key={row.id}
								row={row}
								index={index}
								handleEdit={handleEdit}
								handleDelete={handleDelete}
								handleCopy={handleCopy}
								handleCopyTaskQuestion={handleCopyTaskQuestion}
								classes={classes}
								columns={columns}
								data={data}
								modelId={modelId}
								customCaptions={customCaptions}
								access={access}
								totalTaskCount={totalTaskCount}
								fetchData={fetchData}
								originalRow={originalData[index]}
								updatedFieldFunc={setUpdatedField}
							/>
						</TaskDetailContext>
					))
				) : (
					<TableRow>
						{headers.map((head, i) => {
							if (i === 0) {
								return (
									<TableCell key={head.id}>
										{isDataLoading ? "Data Loading..." : "No Record Found"}
									</TableCell>
								);
							} else {
								return <TableCell key={head.id}></TableCell>;
							}
						})}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

ModelTaskTable.propTypes = {
	data: PropTypes.array.isRequired,
	headers: PropTypes.arrayOf(PropTypes.object).isRequired,
	columns: PropTypes.arrayOf(PropTypes.string).isRequired,
	handleEdit: PropTypes.func.isRequired,
	handleDelete: PropTypes.func.isRequired,
	isDataLoading: PropTypes.bool.isRequired,
};

export default ModelTaskTable;
