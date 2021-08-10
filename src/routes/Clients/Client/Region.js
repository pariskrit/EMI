import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ArrowIcon from "../../../assets/icons/arrowIcon.svg";

// Constants
const SUMMARY_COLOR = "#EDEDF4";

const useStyles = makeStyles((theme) => ({
	regionContainer: {
		width: "200%",
		marginBottom: "10%",
	},
	accordionParent: {
		borderStyle: "solid",
		borderColor: "#000000",
		borderWidth: "1px",
	},
	summary: {
		backgroundColor: SUMMARY_COLOR,
	},
	summaryContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	// summaryContent: {
	//  TODO: may use
	// },
	detailsContainer: {
		borderBottom: "1px solid rgba(0, 0, 0, .125)",
		borderTop: "1px solid rgba(0, 0, 0, .125)",
	},
	regionText: {
		fontWeight: "bold",
	},
	siteText: {
		fontWeight: "bold",
		paddingRight: "3px",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	activeSwitch: {
		marginLeft: "auto",
	},
}));

function Region({ region, sites }) {
	const classes = useStyles();
	return (
		<Grid item className={classes.regionContainer}>
			<Accordion className={classes.accordionParent}>
				<AccordionSummary
					className={classes.summary}
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
					<div className={classes.summaryContainer}>
						<div className={classes.summaryContent}>
							<Typography className={classes.regionText}>
								{region} ({sites.length} {sites.length === 1 ? "Site" : "Sites"}
								)
							</Typography>
						</div>
					</div>
				</AccordionSummary>

				{sites.map((site) => (
					<AccordionDetails className={classes.detailsContainer}>
						<Typography gutterBottom className={classes.siteText}>
							Site:
						</Typography>
						<Typography>
							<Link>{site}</Link>
						</Typography>
						<div className={classes.activeSwitch}>
							<button type="button">Active</button>
						</div>
					</AccordionDetails>
				))}
			</Accordion>
		</Grid>
	);
}

export default Region;
