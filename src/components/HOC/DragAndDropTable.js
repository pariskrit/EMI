import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TableStyle from "styles/application/TableStyle";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import PopupMenu from "components/Elements/PopupMenu";
import ColourConstants from "helpers/colourConstants";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

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
		width: "40%",
	},
	clientsRow: {
		width: "20%",
	},
	dataCell: {
		height: 85,
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
	lastCell: {
		borderBottom: "none",
	},
});

const DragAndDropTable = ({
	data,
	setData,
	handleSort,
	searchQuery,
	searchedData,
	setSearchedData,
	handleDragEnd,
	headers,
	columns,
	handleEdit,
	handleDelete,
}) => {
	// Init hooks
	const classes = useStyles();

	// Init State
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		// Sorting table
		handleSort(data, setData, field, newMethod);

		// Sorting searched table if present
		if (searchQuery !== "") {
			handleSort(searchedData, setSearchedData, field, newMethod);
		}

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	return (
		<AT.TableContainer component={Paper} elevation={0}>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Table aria-label="Table">
					<AT.TableHead>
						<TableRow className={classes.tableHead}>
							<TableCell className={classes.tableHeadRow}>
								<AT.CellContainer>ICON</AT.CellContainer>
							</TableCell>
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
					<Droppable droppableId="droppable-1" isCombineEnabled>
						{(pp) => (
							<TableBody
								className={classes.tableBody}
								ref={pp.innerRef}
								{...pp.droppableProps}
							>
								{(searchQuery === "" ? data : searchedData).map(
									(row, index) => (
										<Draggable
											key={row.id}
											draggableId={row.id + ""}
											index={index}
										>
											{(provider, snapshot) => (
												<TableRow
													key={index}
													{...provider.draggableProps}
													ref={provider.innerRef}
												>
													<AT.DataCell {...provider.dragHandleProps}>
														<AT.CellContainer>
															<AT.TableBodyText>=</AT.TableBodyText>
														</AT.CellContainer>{" "}
													</AT.DataCell>
													{columns.map((col, i, arr) => (
														<AT.DataCell key={col}>
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
																				anchorEl === e.currentTarget
																					? null
																					: index
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
																			isLast={
																				searchQuery === ""
																					? index === data.length - 1
																					: index === searchedData.length - 1
																			}
																			id={row.id}
																			clickAwayHandler={() => {
																				setAnchorEl(null);
																				setSelectedData(null);
																			}}
																			menuData={[
																				{
																					name: "Edit",
																					handler: handleEdit,
																					isDelete: false,
																				},
																				{
																					name: "Delete",
																					handler: handleDelete,
																					isDelete: true,
																				},
																			]}
																		/>
																	</AT.DotMenu>
																) : null}
															</AT.CellContainer>
														</AT.DataCell>
													))}
												</TableRow>
											)}
										</Draggable>
									)
								)}
								{pp.placeholder}
							</TableBody>
						)}
					</Droppable>
				</Table>
			</DragDropContext>
		</AT.TableContainer>
	);
};

DragAndDropTable.propTypes = {
	data: PropTypes.array.isRequired,
	setData: PropTypes.any,
	handleSort: PropTypes.func,
	handleDelete: PropTypes.func,
	handleEdit: PropTypes.func,
	searchQuery: PropTypes.string,
	handleDeleteDialogOpen: PropTypes.func,
	searchedData: PropTypes.array,
	setSearchedData: PropTypes.any,
	handleDragEnd: PropTypes.func.isRequired,
	headers: PropTypes.arrayOf(PropTypes.string),
	columns: PropTypes.arrayOf(PropTypes.string),
};

export default DragAndDropTable;
