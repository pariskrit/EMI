import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import { Link } from "react-router-dom";
import {
	applicationPath,
	clientsPath,
	siteAppDetailPath,
} from "helpers/routePaths";

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

function RegionAndSite({ region, sites, clientId }) {
	const classes = useStyles();

	// useEffect(() => {
	// 	const storage = JSON.parse(localStorage.getItem("crumbs"));
	// 	localStorage.setItem(
	// 		"crumbs",
	// 		JSON.stringify({ ...storage, siteNamme:sites.name })
	// 	);
	// }, []);
	return (
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
							to={`${clientsPath}/${clientId}/sites/${
								site.id
							}${applicationPath}/${site.siteAppID + siteAppDetailPath}`}
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