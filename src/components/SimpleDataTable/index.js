import AccordionBox from "components/AccordionBox";
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ColourConstants from "helpers/colourConstants";
import ClientKeyRow from "./TableRow";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
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
}));

function KeyContacts({ data, tableHeaders }) {
	const classes = useStyles();
	return (
		<Table>
			<TableHead className={classes.tableHead}>
				<TableRow>
					{tableHeaders.map((header) => (
						<TableCell>{header}</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{data.map((row) => (
					<ClientKeyRow key={row.id} row={row} />
				))}
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
