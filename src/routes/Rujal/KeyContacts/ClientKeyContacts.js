import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";
import ArrowIcon from "../../../assets/icons/arrowIcon.svg";
import ColourConstants from "../../../helpers/colourConstants";
import { useState } from "react";
import ClientKeyRow from "./ClientKeyRow";

const useStyles = makeStyles((theme) => ({
	keyContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
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
		width: "99%",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},
}));

const ClientKeyContacts = () => {
	const classes = useStyles();
	const [data] = useState([
		{
			id: 1,
			name: "Sarah",
			site: "Africe",
			product: "Product One",
			email: "test@gmail.com",
			phone: "986544542",
		},
	]);

	return (
		<div className={classes.keyContainer}>
			<Accordion className={classes.keyAccordion}>
				<AccordionSummary
					expandIcon={
						<img
							alt="Expand icon"
							src={ArrowIcon}
							className={classes.expandIcon}
						/>
					}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<div>
						<Typography className={classes.sectionHeading}>
							Key Contacts
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<Table>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell>Full Name</TableCell>
								<TableCell>Site</TableCell>
								<TableCell>Product</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row) => (
								<ClientKeyRow key={row.id} row={row} />
							))}
						</TableBody>
					</Table>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default ClientKeyContacts;
