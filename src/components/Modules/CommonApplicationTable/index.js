import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
	CircularProgress,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@material-ui/core";
import PopupMenu from "components/Elements/PopupMenu";
import ColourConstants from "helpers/colourConstants";
import TableStyle from "styles/application/TableStyle";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";

const AT = TableStyle();

const useStyles = makeStyles({
	tableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackground,
		fontWeight: "bold",
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
		width: "20%",
	},

	dataCell: {
		height: 50,
	},
});

const CommonApplicationTable = ({
	data,
	setData,
	setSearch,
	searchQuery,
	columns,
	handleSort,
	headers,
	onEdit,
	onDelete,
	isLoading,
	searchedData,
}) => {
	const classes = useStyles();
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		// Sorting table
		if (searchQuery.length === 0) handleSort(data, setData, field, newMethod);
		else handleSort(data, setSearch, field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<AT.TableContainer component={Paper} elevation={0}>
				<Table aria-label="Table">
					<AT.TableHead>
						<TableRow className={classes.tableHead}>
							{headers.map((header, index) => (
								<TableCell
									key={header}
									onClick={() => {
										handleSortClick(columns[index]);
									}}
									className={clsx(classes.nameRow, {
										[classes.selectedTableHeadRow]:
											currentTableSort[0] === columns[index],
										[classes.tableHeadRow]:
											currentTableSort[0] !== columns[index],
									})}
								>
									<AT.CellContainer className="flex justify-between">
										{header}
										{currentTableSort[0] === columns[index] &&
										currentTableSort[1] === "desc" ? (
											<AT.DefaultArrow fill="#FFFFFF" />
										) : (
											<AT.DescArrow fill="#FFFFFF" />
										)}
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
																	handler: () => onEdit(row.id),
																	isDelete: false,
																},
																{
																	name: "Delete",
																	handler: () => onDelete(row.id),
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
										return <TableCell key={head}>No Record Found</TableCell>;
									} else {
										return <TableCell key={head}></TableCell>;
									}
								})}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</AT.TableContainer>
		</div>
	);
};

CommonApplicationTable.defaultProps = {
	data: [
		{
			id: 1,
			name: "XYZ",
		},
		{
			id: 2,
			name: "ABC",
		},
	],
	columns: ["name"],
	headers: ["Name"],
	onEdit: (id) => console.log("Edit", id),
	onDelete: (id) => console.log("Delete", id),
};

CommonApplicationTable.propTypes = {
	data: PropTypes.array,
	columns: PropTypes.array,
	headers: PropTypes.array,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
};

export default CommonApplicationTable;
