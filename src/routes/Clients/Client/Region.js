import React, { useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ArrowIcon from "../../../assets/icons/arrowIcon.svg";
import IOSSwitch from "../../../components/IOSSwitch";
import CurveButton from "../../../components/CurveButton";
import CommonAddDialog from "./CommonAddDialog";
import API from "../../../helpers/api";
import { BASE_API_PATH } from "../../../helpers/constants";

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
	},
}));

function Region({
	region,
	onStatusChange,
	setIsLoading,
	fetchRegionsAndSites,
}) {
	const { id, name, sites } = region;
	const classes = useStyles();
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [siteInput, setSiteInput] = useState("");

	//add site to a specific region
	const onAddSite = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await API.post(BASE_API_PATH + "Sites", {
				regionID: id,
				name: siteInput,
			});

			fetchRegionsAndSites();
			setOpenAddDialog(false);
		} catch (error) {
			console.log(error);
			setOpenAddDialog(false);
		}
	};

	return (
		<div className={classes.singleRegion}>
			<CommonAddDialog
				open={openAddDialog}
				closeHandler={() => setOpenAddDialog(false)}
				label="Site"
				input={siteInput}
				setInput={setSiteInput}
				createHandler={onAddSite}
				reference={name}
			/>
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
								{name} ({sites.length} {sites.length === 1 ? "Site" : "Sites"})
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
							<Link>{site.name}</Link>
						</Typography>
						<div className={classes.statusSwitch}>
							{/* <IOSSwitch
								onChange={() => onStatusChange(region.id, site.id)}
								currentStatus={site.isActive ? true : false}
							/> */}
						</div>
					</AccordionDetails>
				))}
			</Accordion>
			<div className={classes.addButton}>
				<CurveButton onClick={() => setOpenAddDialog(true)}>
					Add Site
				</CurveButton>
			</div>
		</div>
	);
}

export default Region;
