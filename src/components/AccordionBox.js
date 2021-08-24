import React from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionActions,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import { makeStyles } from "@material-ui/core/styles";
import ColourConstants from "helpers/colourConstants";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import CurveButton from "components/CurveButton";

const useStyles = makeStyles((theme) => ({
	logoAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "100%",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
}));

function AccordionBox({
	title,
	accordianDetailsCss,
	buttonName,
	buttonAction,
	isActionsPresent = false,
	noExpand,
	children,
}) {
	const classes = useStyles();

	return (
		<Accordion className={classes.logoAccordion} defaultExpanded={true}>
			<AccordionSummary
				expandIcon={
					noExpand ? null : (
						<img
							alt="Expand icon"
							src={ArrowIcon}
							className={classes.expandIcon}
						/>
					)
				}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<Typography className={classes.sectionHeading}>{title}</Typography>
			</AccordionSummary>
			<AccordionDetails className={accordianDetailsCss}>
				{children}
			</AccordionDetails>
			{isActionsPresent && (
				<AccordionActions className={classes.actionButton}>
					<CurveButton onClick={buttonAction}>{buttonName}</CurveButton>
				</AccordionActions>
			)}
		</Accordion>
	);
}

export default AccordionBox;
