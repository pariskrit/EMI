import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Constants
const SUMMARY_COLOR = "#EDEDF4";

const useStyles = makeStyles()((theme) => ({
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
}));

const Region = ({ region, sites }) => {
	// Init hooks
	const { classes, cx } = useStyles();

	return (
		<Grid item className={classes.regionContainer}>
			<Accordion className={classes.accordionParent}>
				<AccordionSummary
					className={classes.summary}
					expandIcon={<ExpandMoreIcon />}
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
							Region:
						</Typography>
						<Typography>
							<Link>{site}</Link>
						</Typography>
					</AccordionDetails>
				))}
			</Accordion>
		</Grid>
	);
};

export default Region;
