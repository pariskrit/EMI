import AccordionActions from "@material-ui/core/AccordionActions";
import { makeStyles } from "@material-ui/core/styles";

import CurveButton from "components/CurveButton";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";
import { handleSort } from "helpers/utils";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonAddDialog from "../CommonAddDialog";
import Region from "./Region";
import ErrorDialog from "components/ErrorDialog";
import AccordionBox from "components/AccordionBox";

const useStyles = makeStyles((theme) => ({
	logoContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "flex-start",
		//paddingLeft: "2%",
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

	addButton: {
		marginBottom: "10px",
	},
	actionButton: {
		padding: "8px 0",
		justifyContent: "flex-end",
	},
	regionSiteContainer: {
		display: "block",
		padding: "0 16px",
	},
}));

function ClientRegionAndSites() {
	const classes = useStyles();
	const { id } = useParams();
	const [listOfRegions, setListOfRegions] = useState([]);

	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [regionInput, setRegionInput] = useState("");
	const [openErrorDialog, setOpenErrorDialog] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	//add region
	const onAddRegion = async (e) => {
		e.preventDefault();
		let intId = +id;

		try {
			let result = await API.post(BASE_API_PATH + "Regions", {
				clientID: intId,
				name: regionInput,
				sites: [],
			});

			if (result.status === 201 || result.status === 200) {
				// Getting response
				result = result.data;

				await fetchRegionsAndSites();

				return { success: true };
			} else {
				// Throwing response if error
				throw new Error(result);
			}
		} catch (err) {
			if (
				err.response.data.errors !== undefined &&
				err.response.data.detail === undefined
			) {
				return { success: false, errors: err.response.data.errors };
			} else if (
				err.response.data.errors !== undefined &&
				err.response.data.detail !== undefined
			) {
				return {
					success: false,
					errors: { name: err.response.data.detail },
				};
			} else {
				setOpenAddDialog(false);
				setOpenErrorDialog(true);
				setErrorMessage("Something went wrong!");

				return false;
			}
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
			<ErrorDialog
				open={openErrorDialog}
				handleClose={() => setOpenErrorDialog(false)}
				message={errorMessage}
			/>

			<AccordionBox
				title={`Regions And Sites ${listOfRegions.length}/5`}
				accordianDetailsCss={classes.regionSiteContainer}
			>
				<AccordionActions className={classes.actionButton}>
					<CurveButton onClick={() => setOpenAddDialog(true)}>
						Add Region
					</CurveButton>
				</AccordionActions>
				{listOfRegions.map((region) => (
					<Region
						key={region.id}
						region={region}
						fetchRegionsAndSites={fetchRegionsAndSites}
					/>
				))}
			</AccordionBox>
		</div>
	);
}

export default ClientRegionAndSites;
