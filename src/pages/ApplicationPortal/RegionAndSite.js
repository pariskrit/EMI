import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import { Link } from "react-router-dom";
import { modelsPath } from "helpers/routePaths";

// Constants
const SUMMARY_COLOR = "#EDEDF4";

const useStyles = makeStyles((theme) => ({
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
		margin: "0 4px",
	},
}));

function RegionAndSite({ region, sites }) {
	const classes = useStyles();

	const handleSiteAppClick = async (id) => {
		localStorage.setItem("siteAppId", id);
		localStorage.setItem(
			"clientUserId",
			sessionStorage.getItem("clientUserId")
		);
		localStorage.setItem("isAdmin", sessionStorage.getItem("isAdmin"));
	};
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
						<Link
							className={classes.siteLink}
							target="_blank"
							to={modelsPath}
							onClick={() => handleSiteAppClick(site.siteAppID)}
						>
							{site.name}
						</Link>
					</Typography>
				</AccordionDetails>
			))}
		</Accordion>
	);
}

export default RegionAndSite;
