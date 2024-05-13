import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Table,
	TableBody,
	TableRow,
	TableCell,
	Paper,
	CircularProgress,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";

import TableStyle from "styles/application/TableStyle";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/Elements/PopupMenu";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { handleSort } from "helpers/utils";
import "components/Modules/ClientSiteTable/arrowStyle.scss";

const AT = TableStyle();

const useStyles = makeStyles()((theme) => ({
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
}));

const ClientSiteDepartmentTable = ({
	data,
	setData,
	columns,
	headers,
	onEdit,
	onDelete,
	page,
	onPageChange,
	count,
	isLoading,
	searchText,
	pagination,
	isReadOnly = false,
}) => {
	const { classes, cx } = useStyles();
	const [currentTableSort, setCurrentTableSort] = useState(["asset", "asc"]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod =
			currentTableSort[0] === field && currentTableSort[1] === "asc"
				? "desc"
				: "asc";

		// Sorting table
		handleSort(data, setData, field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
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
								className={cx(classes.nameRow, {
									[classes.selectedTableHeadRow]:
										currentTableSort[0] === columns[index],
									[classes.tableHeadRow]:
										currentTableSort[0] !== columns[index],
								})}
							>
								<AT.CellContainer className="flex justify-between">
									{header}
									<div className="arrow">
										<AT.DescArrow fill="#F9F9FC" className="arrowUp" />
										<AT.DefaultArrow fill="#F9F9FC" className="arrowDown" />
									</div>
									{/* {currentTableSort[0] === columns[index] &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)} */}
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
										className={cx(classes.dataCell, classes.nameRow, {
											[classes.lastCell]: index === data.length - 1,
										})}
									>
										<AT.CellContainer key={col}>
											<AT.TableBodyText>{row[col]}</AT.TableBodyText>
											{arr.length === i + 1 && !isReadOnly ? (
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
	);
};

ClientSiteDepartmentTable.defaultProps = {
	data: [
		{
			id: 1,
			asset: "Rujal",
			description: "2060-100-22-80-BLG007-AIHV",
		},
		{
			id: 2,
			asset: "Rudra",
			description: "2060-100-22-80-BLG007-AIHV",
		},
	],
	columns: ["asset", "description"],
	headers: ["Asset", "Description"],
	onEdit: (id) => {},
	onDelete: (id) => {},
	pagination: true,
};

ClientSiteDepartmentTable.propTypes = {
	data: PropTypes.array,
	columns: PropTypes.array,
	headers: PropTypes.array,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	pagination: PropTypes.bool,
};

export default ClientSiteDepartmentTable;
