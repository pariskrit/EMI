import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Typography,
} from "@material-ui/core";
import ColourConstants from "../../helpers/colourConstants";

const useStyles = makeStyles((theme) => ({
	detailContainer: {
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
	detailAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "99%",
	},
}));
const CompanyDetails = () => {
	const classes = useStyles();

	return (
		<Accordion className={classes.detailAccordion} expanded={true}>
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
				<div>
					<Typography className={classes.sectionHeading}>
						Company Details
					</Typography>
				</div>
			</AccordionSummary>
			<AccordionDetails>This is detail section</AccordionDetails>
		</Accordion>
	);
};

export default CompanyDetails;
