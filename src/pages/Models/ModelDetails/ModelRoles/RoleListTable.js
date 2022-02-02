import React, { useState } from "react";
import TableStyle from "styles/application/TableStyle";
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import { handleSort } from "helpers/utils";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import clsx from "clsx";
import PopupMenu from "components/Elements/PopupMenu";

const AT = TableStyle();

const useStyles = makeStyles({
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
});

function RoleListTable({
	data,
	setData,
	headers,
	columns,
	handleDeteleDialogOpen,
	handleEditDialogOpen,
}) {
	const classes = useStyles();
	const [currentTableSort, setCurrentTableSort] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedData, setSelectedData] = useState(null);

	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		// Sorting table
		handleSort(data, setData, field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	return (
		<AT.TableContainer>
			<Table aria-label="Table">
				<AT.TableHead>
					<TableRow className={classes.tableHead}>
						{headers.map((header, index) => (
							<TableCell
								key={header.id}
								onClick={() => {
									handleSortClick(columns[index]);
								}}
								style={{ width: header?.width || "auto" }}
								className={clsx(classes.nameRow, {
									[classes.selectedTableHeadRow]:
										currentTableSort[0] === columns[index],
									[classes.tableHeadRow]:
										currentTableSort[0] !== columns[index],
								})}
							>
								<AT.CellContainer className="flex justify-between">
									{header.name}

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
								</AT.CellContainer>
							</TableCell>
						))}
					</TableRow>
				</AT.TableHead>
				<TableBody>
					{data.length !== 0 ? (
						data.map((row, index) => (
							<TableRow key={row.id}>
								{columns.map((col, i, arr) => (
									<TableCell
										key={col}
										component="th"
										scope="row"
										className={clsx(classes.dataCell, classes.nameRow, {
											[classes.lastCell]: index === data.length - 1,
										})}
									>
										<AT.CellContainer key={col}>
											<AT.TableBodyText>{row[col]}</AT.TableBodyText>
											{arr.length === i + 1 ? (
												<AT.DotMenu
													onClick={(e) => {
														setAnchorEl(
															anchorEl === e.currentTarget
																? null
																: e.currentTarget
														);
														setSelectedData(
															anchorEl === e.currentTarget ? null : index
														);
													}}
												>
													<AT.TableMenuButton>
														<MenuIcon />
													</AT.TableMenuButton>

													<PopupMenu
														index={index}
														selectedData={selectedData}
														anchorEl={anchorEl}
														id={row.id}
														clickAwayHandler={() => {
															setAnchorEl(null);
															setSelectedData(null);
														}}
														menuData={[
															{
																name: "Edit",
																handler: () => handleEditDialogOpen(row),
																isDelete: false,
															},
															{
																name: "Delete",
																handler: () => handleDeteleDialogOpen(row.id),
																isDelete: true,
															},
														]}
													/>
												</AT.DotMenu>
											) : null}
										</AT.CellContainer>
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							{headers.map((head, i) => {
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
		</AT.TableContainer>
	);
}

export default RoleListTable;
