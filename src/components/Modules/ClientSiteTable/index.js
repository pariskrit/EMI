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
import "./arrowStyle.scss";
import useInfiniteScroll from "hooks/useInfiniteScroll";

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

const ClientSiteTable = ({
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
	taskPluralCC,
	assetCC,
	downloadReportHandler,
	isSiteUser,
	currentTableSort,
	setCurrentTableSort,
	handleSort,
}) => {
	const { classes, cx } = useStyles();

	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	const { hasMore, loading, gotoTop } = useInfiniteScroll(
		data,
		count,
		async (pageSize, prevData, name) =>
			await onPageChange(pageSize + 1, prevData, name),
		page,
		searchText,
		window,
		{
			sortField: currentTableSort[0],
			sortOrder: currentTableSort[1],
		}
	);

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod =
			field === currentTableSort[0] && currentTableSort[1] === "asc"
				? "desc"
				: "asc";

		// Sorting table
		handleSort(field, newMethod);

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
														menuData={
															isSiteUser
																? [
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
																		{
																			name: `${taskPluralCC} where ${assetCC} Used`,
																			handler: () =>
																				downloadReportHandler(row.id),
																			isDelete: false,
																		},
																  ]
																: [
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
																  ]
														}
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
	onEdit: (id) => {},
	onDelete: (id) => {},
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
