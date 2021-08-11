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
import ArrowIcon from "../../assets/icons/arrowIcon.svg";
import ColourConstants from "../../helpers/colourConstants";

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

const KeyContacts = () => {
	const classes = useStyles();

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
							<TableRow>
								<TableCell>Sarah MacPherson</TableCell>
								<TableCell>Africa</TableCell>
								<TableCell>Product 1</TableCell>
								<TableCell>myinfo@email.com</TableCell>
								<TableCell>986678634</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default KeyContacts;
