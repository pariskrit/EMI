import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import TableStyle from "styles/application/TableStyle";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
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
	handleDragEnd,
	headers,
	columns,
	disableDnd,
	menuData,
	isModelEditable,
}) => {
	// Init hooks
	const classes = useStyles();

	// Init State
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	return (
		<AT.TableContainer component={Paper} elevation={0}>
			<DragDropContext
				onDragEnd={(dragProps) => {
					document
						.querySelectorAll(
							`[data-rbd-draggable-id="${dragProps.draggableId}"]`
						)[0]
						.classList.remove("no-border");
					handleDragEnd(dragProps);
				}}
				onDragStart={(dragProps) => {
					document
						.querySelectorAll(
							`[data-rbd-draggable-id="${dragProps.draggableId}"]`
						)[0]
						.classList.add("no-border");
				}}
			>
				<Table aria-label="Table">
					<AT.TableHead>
						<TableRow className={classes.tableHead}>
							{headers.map((header) => (
								<TableCell
									key={header}
									className={clsx(classes.tableHeadRow, classes.nameRow)}
								>
									<AT.CellContainer className="flex justify-between">
										{header}
									</AT.CellContainer>
								</TableCell>
							))}
						</TableRow>
					</AT.TableHead>
					<Droppable
						droppableId="droppable-1"
						isCombineEnabled
						isDropDisabled={disableDnd}
					>
						{(pp) => (
							<TableBody
								className={classes.tableBody}
								ref={pp.innerRef}
								{...pp.droppableProps}
							>
								{data.map((row, index) => (
									<Draggable
										key={row.id}
										draggableId={row.id + ""}
										index={index}
									>
										{(provider) => (
											<TableRow
												key={index}
												{...provider.draggableProps}
												ref={provider.innerRef}
											>
												{columns.map((col, i, arr) => (
													<AT.DataCell key={col} className={classes.nameRow}>
														<AT.CellContainer key={col}>
															<AT.TableBodyText>
																{i === 0 ? (
																	<div
																		style={{
																			display: "flex",
																			flexDirection: "space-around",
																			alignItems: "center",
																		}}
																	>
																		{!disableDnd && (
																			<span
																				{...provider.dragHandleProps}
																				ref={provider.innerRef}
																				className="flex"
																			>
																				<DragIndicatorIcon />
																			</span>
																		)}
																		<span style={{ marginTop: "2px" }}>
																			{row[col]}
																		</span>
																	</div>
																) : (
																	row[col]
																)}
															</AT.TableBodyText>

															{arr.length === i + 1
																? isModelEditable && (
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
																				id={row.id}
																				clickAwayHandler={() => {
																					setAnchorEl(null);
																					setSelectedData(null);
																				}}
																				menuData={menuData}
																			/>
																		</AT.DotMenu>
																  )
																: null}
														</AT.CellContainer>
													</AT.DataCell>
												))}
											</TableRow>
										)}
									</Draggable>
								))}
								{pp.placeholder}
							</TableBody>
						)}
					</Droppable>
				</Table>
			</DragDropContext>
		</AT.TableContainer>
	);
};

DragAndDropTable.defaultProps = {
	disableDnd: false,
	menuData: [
		{
			name: "Edit",
			handler: () => {},
			isDelete: false,
		},
		{
			name: "Delete",
			handler: () => {},
			isDelete: true,
		},
	],
};

DragAndDropTable.propTypes = {
	data: PropTypes.array.isRequired,
	handleDelete: PropTypes.func,
	handleEdit: PropTypes.func,
	handleDragEnd: PropTypes.func.isRequired,
	headers: PropTypes.arrayOf(PropTypes.string).isRequired,
	columns: PropTypes.arrayOf(PropTypes.object).isRequired,
	isModelEditable: PropTypes.bool,
};

export default DragAndDropTable;