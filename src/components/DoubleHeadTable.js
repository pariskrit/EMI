import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TableStyle from "styles/application/TableStyle";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import ColourConstants from "helpers/colourConstants";

// Init styled components
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
	subcatRow: {
		width: "20%",
	},
	defaultText: {
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		color: ColourConstants.tableBorder,
		fontStyle: "italic",
		paddingLeft: 5,
		display: "inline-flex",
	},
	defaultNameText: {
		fontWeight: "bold",
	},
	yesText: {
		color: ColourConstants.yesText,
		fontFamily: "Roboto Condensed",
		fontSize: 14,
	},
	noText: {
		color: ColourConstants.commonText,
		fontFamily: "Roboto Condensed",
		fontSize: 14,
	},
});

function DoubleHeadTable({
	data,
	setData,
	handleSort,
	searchQuery,
	currentTableSort,
	setCurrentTableSort,
	searchedData,
	setSearchedData,
	children,
}) {
	// Init hooks
	const classes = useStyles();

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
			<Table aria-label="Model Table">
				<AT.TableHead>
					<TableRow>
						<TableCell
							onClick={() => {
								handleSortClick("name");
							}}
							className={clsx(classes.nameRow, {
								[classes.selectedTableHeadRow]: currentTableSort[0] === "name",
								[classes.tableHeadRow]: currentTableSort[0] !== "name",
							})}
						>
							<AT.CellContainer>
								Name
								{currentTableSort[0] === "name" &&
								currentTableSort[1] === "desc" ? (
									<AT.DefaultArrow fill="#FFFFFF" />
								) : (
									<AT.DescArrow fill="#FFFFFF" />
								)}
							</AT.CellContainer>
						</TableCell>
						<TableCell
							onClick={() => {
								handleSortClick("pauseSubcategories");
							}}
							className={clsx(classes.subcatRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "pauseSubcategories",
								[classes.tableHeadRow]:
									currentTableSort[0] !== "pauseSubcategories",
							})}
						>
							<AT.CellContainer>
								Number of subcategories
								{currentTableSort[0] === "pauseSubcategories" &&
								currentTableSort[1] === "desc" ? (
									<AT.DefaultArrow fill="#FFFFFF" />
								) : (
									<AT.DescArrow fill="#FFFFFF" />
								)}
							</AT.CellContainer>
						</TableCell>
					</TableRow>
				</AT.TableHead>

				<TableBody>{children}</TableBody>
			</Table>
		</AT.TableContainer>
	);
}

export default DoubleHeadTable;
