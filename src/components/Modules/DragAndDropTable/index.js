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
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ColourConstants from "helpers/colourConstants";

// Icon imports
import Row from "./Row";

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
							{headers.map((header, i) => (
								<TableCell
									key={header}
									className={clsx(classes.tableHeadRow)}
									style={columns[i]?.style}
								>
									<AT.CellContainer
										className="flex justify-between"
										style={i === 0 ? { marginLeft: "38px" } : {}}
									>
										{header}
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
								{data.map((row, index) => (
									<Draggable
										key={row.id}
										draggableId={row.id + ""}
										index={index}
										isDragDisabled={disableDnd}
									>
										{(provider) => (
											<Row
												index={index}
												provider={provider}
												row={row}
												columns={columns}
												menuData={menuData}
												isModelEditable={isModelEditable}
											/>
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
			handler: (id) => console.log(id),
			isDelete: false,
		},
		{
			name: "Delete",
			handler: (id) => console.log(id),
			isDelete: true,
		},
	],
};

DragAndDropTable.propTypes = {
	data: PropTypes.array.isRequired,
	handleDragEnd: PropTypes.func.isRequired,
	headers: PropTypes.arrayOf(PropTypes.string).isRequired,
	disableDnd: PropTypes.bool,
	menuData: PropTypes.array,
	columns: PropTypes.arrayOf(PropTypes.object).isRequired,
	isModelEditable: PropTypes.bool,
};

export default DragAndDropTable;
