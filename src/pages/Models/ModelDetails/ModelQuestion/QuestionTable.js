import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ColourConstants from "helpers/colourConstants";
import { handleSort, sortData } from "helpers/utils";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import clsx from "clsx";
import { QuestionColumn, Questionheaders } from "constants/modelDetails";
import QuestionRow from "./QuestionRow";

const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

const useStyles = makeStyles({
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
});

const QuestionTable = ({ data, setData, menuData, rolePlural }) => {
	const classes = useStyles();
	const [currentTableSort, setCurrentTableSort] = useState([]);

	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		// Sorting table
		handleSort(data, setData, field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};
	return (
		<Table aria-label="Table" className={classes.table}>
			<AT.TableHead className={classes.taskHeader}>
				<TableRow className={classes.tableHead}>
					{Questionheaders(rolePlural).map((header, index) => (
						<TableCell
							key={header.id}
							onClick={() => {
								handleSortClick(QuestionColumn[index].name);
							}}
							style={{ width: header?.width || "auto" }}
							className={clsx(classes.nameRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === QuestionColumn[index].name,
								[classes.tableHeadRow]:
									currentTableSort[0] !== QuestionColumn[index].name,
							})}
						>
							<AT.CellContainer className="flex justify-between">
								{header.name}
								{
									<div className="arrow">
										<AT.DescArrow
											fill={
												currentTableSort[0] === QuestionColumn[index].name &&
												currentTableSort[1] === "asc"
													? "#D2D2D9"
													: "#F9F9FC"
											}
											className="arrowUp"
										/>
										<AT.DefaultArrow
											fill={
												currentTableSort[0] === QuestionColumn[index].name &&
												currentTableSort[1] === "desc"
													? "#D2D2D9"
													: "#F9F9FC"
											}
											className="arrowDown"
										/>
									</div>
								}
							</AT.CellContainer>
						</TableCell>
					))}
				</TableRow>
			</AT.TableHead>
			<TableBody>
				{data.length !== 0 ? (
					sortData(
						data,
						currentTableSort[0],
						currentTableSort[1]
					).map((row, index) => (
						<QuestionRow
							row={row}
							index={index}
							data={data}
							menuData={menuData}
							classes={classes}
						/>
					))
				) : (
					<TableRow>
						{Questionheaders(rolePlural).map((head, i) => {
							if (i === 0) {
								return <TableCell key={head.id}>No Record Found</TableCell>;
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

export default QuestionTable;
