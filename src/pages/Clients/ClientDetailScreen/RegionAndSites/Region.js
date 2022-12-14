import Accordion from "@material-ui/core/Accordion";
import AccordionActions from "@material-ui/core/AccordionActions";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import CurveButton from "components/Elements/CurveButton";
import { handleSort } from "helpers/utils";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addClientSite } from "services/clients/clientDetailScreen";
import CommonAddDialog from "../CommonAddDialog";
import { siteDetailPath, clientsPath } from "helpers/routePaths";

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

function Region({ region, fetchRegionsAndSites, getError, clientId }) {
	const { id, name, sites } = region;
	const classes = useStyles();
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [siteInput, setSiteInput] = useState("");
	const [modifiedSites, setModifiedSites] = useState([]);

	//add site to a specific region
	const onAddSite = async (e) => {
		e.preventDefault();

		let result = await addClientSite({
			regionID: id,
			name: siteInput,
		});

		if (result.status) {
			await fetchRegionsAndSites();

			return { success: true };
		} else {
			// Throwing response if error
			if (
				result.data.errors !== undefined &&
				result.data.detail === undefined
			) {
				return { success: false, errors: result.data.errors };
			} else if (
				result.data.errors !== undefined &&
				result.data.detail !== undefined
			) {
				return {
					success: false,
					errors: { name: result.data.detail },
				};
			} else {
				setOpenAddDialog(false);
				getError("Something went wrong!");

				return false;
			}
		}
	};

	useEffect(() => {
		handleSort(sites, setModifiedSites, "name", "asc");
	}, [sites]);

	return (
		<div className={classes.singleRegion}>
			{openAddDialog && (
				<CommonAddDialog
					open={openAddDialog}
					closeHandler={() => setOpenAddDialog(false)}
					label="Site"
					input={siteInput}
					setInput={setSiteInput}
					createHandler={onAddSite}
					reference={name}
				/>
			)}

			<Accordion
				className={classes.accordionParent}
				defaultExpanded={sites.length > 0}
			>
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

				{modifiedSites.map((site) => (
					<AccordionDetails className={classes.detailsContainer} key={site.id}>
						<Typography gutterBottom className={classes.siteText}>
							Site:
						</Typography>
						<Typography>
							<Link
								className={classes.siteLink}
								to={`${clientsPath}/${clientId}/sites/${site.id}${siteDetailPath}`}
							>
								{site.name}
							</Link>
						</Typography>
					</AccordionDetails>
				))}
			</Accordion>
			<AccordionActions className={classes.addButton}>
				<CurveButton onClick={() => setOpenAddDialog(true)}>
					Add Site
				</CurveButton>
			</AccordionActions>
		</div>
	);
}

export default Region;
