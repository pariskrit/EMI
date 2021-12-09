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
import ColourConstants from "helpers/colourConstants";
import { handleSort } from "helpers/utils";
import ModelTaskRow from "./ModelTaskRow";

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

const ModelTaskTable = ({
	data,
	handleDelete,
	handleEdit,
	setData,
	headers,
	columns,
}) => {
	const classes = useStyles();
	const [currentTableSort, setCurrentTableSort] = useState(["asset", "asc"]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		// Sorting table
		handleSort(data, setData, field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};
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
								</AT.CellContainer>
							</TableCell>
						))}
					</TableRow>
				</AT.TableHead>
				<TableBody>
					{data.length !== 0 ? (
						data.map((row, index) => (
							<ModelTaskRow
								key={row.id}
								row={row}
								index={index}
								setAnchorEl={setAnchorEl}
								anchorEl={anchorEl}
								selectedData={selectedData}
								setSelectedData={setSelectedData}
								handleEdit={handleEdit}
								handleDelete={handleDelete}
								classes={classes}
								columns={columns}
								data={data}
							/>
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

ModelTaskTable.propTypes = {
	data: PropTypes.array.isRequired,
};

export default ModelTaskTable;
