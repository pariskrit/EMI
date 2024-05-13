import React from "react";
import {
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import ColourConstants from "helpers/colourConstants";
import ClientKeyRow from "./TableRow";
import PropTypes from "prop-types";

const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
	tableContainer: {
		[media]: {
			whiteSpace: "nowrap",
		},
	},

	keyContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "flex-end",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
	keyAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "100%",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},
	noDataTableRow: {
		borderBottom: "none !important",
	},
}));

function KeyContacts({ data, tableHeaders, isLoading }) {
	const { classes, cx } = useStyles();

	if (isLoading) {
		return <CircularProgress />;
	}
	return (
		<Table className={classes.tableContainer}>
			<TableHead className={classes.tableHead}>
				<TableRow>
					{tableHeaders.map((header) => (
						<TableCell key={header}>{header}</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{data.length === 0 ? (
					<TableRow>
						<TableCell className={classes.noDataTableRow}>
							No Records Found
						</TableCell>
					</TableRow>
				) : (
					data.map((row) => <ClientKeyRow key={row.id} row={row} />)
				)}
			</TableBody>
		</Table>
	);
}

KeyContacts.propTypes = {
	/**
		array of objects containing row data
	 */
	data: PropTypes.array,

	/** 
	 	array of headers of the table
	 */
	tableHeaders: PropTypes.array.isRequired,
};

export default KeyContacts;
