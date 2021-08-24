import React from "react";
import { Accordion, AccordionDetails } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import ColourConstants from "helpers/colourConstants";

const useStyles = makeStyles((theme) => ({
	logoAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "100%",
	},
}));
function AccordionBox({ children }) {
	const classes = useStyles();

	return (
		<Accordion className={classes.logoAccordion} defaultExpanded={true}>
			{children}
		</Accordion>
	);
}

export default AccordionBox;
