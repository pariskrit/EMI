import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { makeStyles } from "tss-react/mui";

import Typography from "@mui/material/Typography";
import ArrowIcon from "assets/icons/arrowIcon.svg";

import { useDispatch } from "react-redux";

import { handleSiteAppClick } from "helpers/handleSiteAppClick";
// Constants
const SUMMARY_COLOR = "#EDEDF4";

const useStyles = makeStyles()((theme) => ({
	accordionParent: {
		borderStyle: "solid",
		borderColor: "#000000",
		borderWidth: "1px",
		marginBottom: "15px",
	},
	summary: {
		margin: 0,
		backgroundColor: SUMMARY_COLOR,
	},
	summaryContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},

	detailsContainer: {
		borderBottom: "1px solid rgba(0, 0, 0, .125)",
		borderTop: "1px solid rgba(0, 0, 0, .125)",
		padding: "14px 20px",
		alignItems: "center",
		display:'flex',
		justifyContent:'start'
	},
	regionText: {
		fontWeight: "bold",
	},
	siteText: {
		fontWeight: "bold",
		paddingRight: "3px",
		margin: 0,
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	statusSwitch: {
		marginLeft: "auto",
	},
	singleRegion: {
		marginBottom: "30px",
	},
	addButton: {
		textAlign: "right",
		padding: "8px 0",
	},
	siteLink: {
		color: "#307AD6",
		fontSize: "1rem",
		fontWeight: "400",
		lineHeight: "1.5",
		border: "none",
		textDecoration: "underline",
		backgroundColor: "transparent",
		"&:hover": {
			cursor: "pointer",
		},
	},
}));

function RegionAndSite({ region, sites }) {
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	return (
		<Accordion className={classes.accordionParent} defaultExpanded>
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
							{region.name} ({sites.length}{" "}
							{sites.length === 1 ? "Site" : "Sites"})
						</Typography>
					</div>
				</div>
			</AccordionSummary>

			{sites.map((site) => (
				<AccordionDetails className={classes.detailsContainer} key={site.id}>
					<Typography gutterBottom className={classes.siteText}>
						Site:
					</Typography>
					<Typography>
						<button
							className={classes.siteLink}
							//	target="_blank"
							// to={modelsPath}
							onClick={() => dispatch(handleSiteAppClick(site.siteAppID))}
						>
							{site.name}
						</button>
					</Typography>
				</AccordionDetails>
			))}
		</Accordion>
	);
}

export default RegionAndSite;
