import { Grid, Typography } from "@material-ui/core";
import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import RegionAndSite from "./RegionAndSite";

const useStyles = makeStyles((theme) => ({
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

	logo: {
		height: 40,
		width: 248,
	},
	summaryContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		gap: "25px",
	},
	summaryContainerRight: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	summaryContent: {
		padding: 5,
	},
	textStyle: {
		fontWeight: "bold",
	},
	expandIcon: {
		width: "80%",
	},
	details: {
		display: "block",
	},
}));

function SingleApplication({ data }) {
	const totalNumberOfRegions = Object.keys(data.regions).length;
	const totalNumberOfSites = Object.keys(data.regions).reduce(
		(accSite, region) => data.regions[region].length + accSite,
		0
	);
	const classes = useStyles();

	return (
		<Grid item className={classes.itemSize}>
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
						<img
							src={data.logo}
							alt={`${data.name} logo`}
							className={classes.logo}
						/>

						<div className={classes.summaryContainerRight}>
							<div className={classes.summaryContent}>
								<Typography className={classes.textStyle}>
									{totalNumberOfRegions}{" "}
									{totalNumberOfRegions === 1 ? "Region" : "Regions"}
								</Typography>
							</div>
							<div className={classes.summaryContent}>
								<Typography className={classes.textStyle}>
									{totalNumberOfSites}{" "}
									{totalNumberOfSites === 1 ? "Site" : "Sites"}
								</Typography>
							</div>
						</div>
					</div>
				</AccordionSummary>
				<AccordionDetails className={classes.details}>
					{Object.keys(data.regions).map((region) => (
						<RegionAndSite
							region={region}
							sites={data.regions[region]}
							key={region}
						/>
					))}
				</AccordionDetails>
			</Accordion>
		</Grid>
	);
}

export default React.memo(SingleApplication);
