import React from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Region from "./Region";

const useStyles = makeStyles()((theme) => ({
	itemSize: {
		width: "50%",
	},
	accordionParent: {
		borderStyle: "solid",
		borderColor: "#000000",
		borderWidth: "1px",
	},
	summary: {
		height: 120,
	},
	logoContainer: {
		paddingRight: 2,
	},
	logo: {
		height: 40,
		width: 248,
	},
	summaryContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: "20%",
	},
	summaryContent: {
		padding: 5,
	},
	textStyle: {
		fontWeight: "bold",
	},
}));

const LaunchItem = ({ data }) => {
	// Init hooks
	const { classes, cx } = useStyles();

	const regions = Object.keys(data.regions).length;
	const sites = countAll(data.regions);

	return (
		<Grid item className={classes.itemSize}>
			<Accordion className={classes.accordionParent}>
				<AccordionSummary
					className={classes.summary}
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<div className={classes.logoContainer}>
						<img
							src={data.logo}
							alt={`${data.name} logo`}
							className={classes.logo}
						/>
					</div>
					<div className={classes.summaryContainer}>
						<div className={classes.summaryContent}>
							<Typography className={classes.textStyle}>
								{regions} Regions
							</Typography>
						</div>
						<div className={classes.summaryContent}>
							<Typography className={classes.textStyle}>
								{sites} Sites
							</Typography>
						</div>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<Grid>
						<Grid item>
							<Typography gutterBottom className={classes.textStyle}>
								Regions & Sites
							</Typography>
						</Grid>

						{Object.keys(data.regions).map((region) => (
							<Region region={region} sites={data.regions[region]} />
						))}
					</Grid>
				</AccordionDetails>
			</Accordion>
		</Grid>
	);
};

export default LaunchItem;

// Helpers
function countAll(toCount) {
	/**
	 * Getting count of all sites
	 */
	let count = 0;

	const keys = Object.keys(toCount);

	for (let i = 0; i < keys.length; i++) {
		count += toCount[keys[i]].length;
	}

	return count;
}
