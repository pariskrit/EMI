import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
	Table,
	TableBody,
	TableRow,
	TableCell,
	makeStyles,
	Paper,
	CircularProgress,
} from "@material-ui/core";
import clsx from "clsx";
import TableStyle from "styles/application/TableStyle";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/PopupMenu";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { handleSort } from "helpers/utils";
import "./arrowStyle.scss";
import TablePagination from "components/TablePagination";
import useInfiniteScroll from "hooks/useInfiniteScroll";

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

const ClientSiteTable = ({
	data,
	setData,
	columns,
	headers,
	onEdit,
	onDelete,
	pagination,
	page,
	rowsPerPage,
	onPageChange,
	count,
	isLoading,
	searchText,
}) => {
	const classes = useStyles();
	const [currentTableSort, setCurrentTableSort] = useState(["asset", "asc"]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const { hasMore, loading, gotoTop } = useInfiniteScroll(
		data,
		count,
		async (pageSize, prevData) => await onPageChange(pageSize + 1, prevData),
		page,
		searchText
	);

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

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
								className={clsx(classes.nameRow, {
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
			{/* {pagination && (
				<TablePagination
					page={page}
					rowsPerPage={rowsPerPage}
					onPageChange={onPageChange}
					count={count}
				/>
			)} */}

			{/* scroll to load */}
			{loading && (
				<div style={{ padding: "16px 10px" }}>
					<b>Loading...</b>
				</div>
			)}

			{!hasMore && (
				<div
					style={{ textAlign: "center", padding: "16px 10px" }}
					className="flex justify-center"
				>
					<b>Yay! You have seen it all</b>
					<span
						className="link-color ml-md cursor-pointer"
						onClick={() => gotoTop()}
					>
						Go to top
					</span>
				</div>
			)}
		</AT.TableContainer>
	);
};

ClientSiteTable.defaultProps = {
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
	onEdit: (id) => console.log("Edit", id),
	onDelete: (id) => console.log("Delete", id),
	pagination: true,
};

ClientSiteTable.propTypes = {
	data: PropTypes.array,
	columns: PropTypes.array,
	headers: PropTypes.array,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	pagination: PropTypes.bool,
};

export default ClientSiteTable;
