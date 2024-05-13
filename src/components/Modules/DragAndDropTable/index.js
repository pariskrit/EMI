import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import TableStyle from "styles/application/TableStyle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ColourConstants from "helpers/colourConstants";

// Icon imports
import Row from "./Row";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

const mediaMobile = "@media (max-width: 414px)";
const mediaIpadpro = "@media (max-width: 1024px)";
const mediaIpad = "@media (max-width: 768px)";

const useStyles = makeStyles()((theme) => ({
	table: {
		borderStyle: "solid",
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		overflowX: "auto",
		borderColor: ColourConstants.tableBorder,
		borderWidth: 1,
		borderRadius: 0,
		[mediaMobile]: {
			maxWidth: "87vw",
			overflowX: "auto",
		},
		[mediaIpadpro]: {
			maxWidth: "87vw",
			overflowX: "auto",
		},
		[mediaIpad]: {
			maxWidth: "85vw",
			overflowX: "auto",
		},
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
}));

const DragAndDropTable = ({
	data,
	handleDragEnd,
	headers,
	columns,
	disableDnd,
	menuData,
	isModelEditable,
	type,
	classEl,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	return (
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
			<Table aria-label="Table" className={classes.table}>
				<AT.TableHead>
					<TableRow className={classes.tableHead}>
						{headers.map((header, i) => (
							<TableCell
								key={header}
								className={cx(classes.tableHeadRow)}
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
											type={type}
											classEl={classEl}
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
	);
};

DragAndDropTable.defaultProps = {
	disableDnd: false,
	menuData: [
		{
			name: "Edit",
			handler: (id) => {},
			isDelete: false,
		},
		{
			name: "Delete",
			handler: (id) => {},
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
