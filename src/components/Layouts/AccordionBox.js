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
import CurveButton from "components/Elements/CurveButton";
import Icon from "components/Elements/Icon";
import { getLocalStorageData } from "helpers/utils";

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
	summary: {
		alignItems: "center",
		justifyContent: "space-between",
		marginRight: "70px !important",
	},
	critical: {
		color: ColourConstants.red,
		margin: "0 !important",
	},
	criticalPara: {
		fontWeight: "600 !important",
		marginLeft: "5px",
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
	defaultExpanded = true,
	accordionClass = "",
	style = { marginTop: "10px" },
	showSafetyCritical = false,
}) {
	const classes = useStyles();
	const { customCaptions } = getLocalStorageData("me");

	return (
		<Accordion
			className={`${classes.logoAccordion} ${accordionClass}`}
			defaultExpanded={defaultExpanded}
			expanded={noExpand}
			style={style}
		>
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
				classes={{ content: classes.summary }}
			>
				<Typography className={classes.sectionHeading}>{title}</Typography>
				{showSafetyCritical && (
					<p className={classes.critical}>
						<Icon name="SafteryCritical" />
						<span className={classes.criticalPara}>
							{customCaptions?.safetyCritical}
						</span>
					</p>
				)}
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
