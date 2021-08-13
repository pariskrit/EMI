import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import CurveButton from "components/CurveButton";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import { handleSort } from "helpers/utils";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonAddDialog from "../CommonAddDialog";
import Region from "./Region";

const useStyles = makeStyles((theme) => ({
	logoContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "flex-start",
		//paddingLeft: "2%",
	},
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
	logoContentParent: {
		width: "100%",
	},
	spinnerContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	trademarkContainer: {
		marginTop: 10,
	},
	trademarkText: {
		fontSize: "14px",
	},
	uploaderContainer: {
		marginTop: "2%",
	},
	dividerStyle: {
		width: "100%",
	},
	regionSiteContainer: {
		display: "block",
		padding: "0 16px",
	},
	addButton: {
		marginBottom: "10px",
	},
}));

function ClientRegionAndSites() {
	const classes = useStyles();
	const { id } = useParams();
	const [listOfRegions, setListOfRegions] = useState([]);

	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [regionInput, setRegionInput] = useState("");

	//add region
	const onAddRegion = async (e) => {
		e.preventDefault();
		let intId = +id;

		try {
			await API.post(BASE_API_PATH + "Regions", {
				clientID: intId,
				name: regionInput,
				sites: [],
			});
			fetchRegionsAndSites();
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	};

	// fetch RegionsAndSites of client
	const fetchRegionsAndSites = async () => {
		try {
			const result = await API.get(`${BASE_API_PATH}Regions?clientId=${id}`);
			handleSort(result.data, setListOfRegions, "name", "asc");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchRegionsAndSites();
	}, []);

	return (
		<div className={classes.logoContainer}>
			<CommonAddDialog
				open={openAddDialog}
				closeHandler={() => setOpenAddDialog(false)}
				label="Region"
				input={regionInput}
				setInput={setRegionInput}
				createHandler={onAddRegion}
			/>
			<Accordion className={classes.logoAccordion}>
				<AccordionSummary
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
					<Typography className={classes.sectionHeading}>
						Regions & Sites ({listOfRegions.length}/5)
					</Typography>
				</AccordionSummary>

				<AccordionDetails className={classes.regionSiteContainer}>
					<div className={classes.addButton}>
						<CurveButton onClick={() => setOpenAddDialog(true)}>
							Add Region
						</CurveButton>
					</div>

					{listOfRegions.map((region) => (
						<Region
							key={region.id}
							region={region}
							fetchRegionsAndSites={fetchRegionsAndSites}
						/>
					))}
				</AccordionDetails>
			</Accordion>
		</div>
	);
}

export default ClientRegionAndSites;
