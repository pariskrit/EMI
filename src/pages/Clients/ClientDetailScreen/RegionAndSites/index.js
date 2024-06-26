import { CircularProgress } from "@mui/material";
import AccordionActions from "@mui/material/AccordionActions";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AccordionBox from "components/Layouts/AccordionBox";
import CurveButton from "components/Elements/CurveButton";
import { handleSort } from "helpers/utils";
import React, { useEffect, useRef, useState } from "react";
import {
	addClientRegion,
	getClientRegion,
} from "services/clients/clientDetailScreen";
import CommonAddDialog from "pages/Clients/ClientDetailScreen/CommonAddDialog";
import Region from "pages/Clients/ClientDetailScreen/RegionAndSites/Region";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles()((theme) => ({
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

function ClientRegionAndSites({ clientId, getError }) {
	const { classes, cx } = useStyles();
	const [listOfRegions, setListOfRegions] = useState([]);

	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [regionInput, setRegionInput] = useState("");
	const cancelFetch = useRef(false);
	const [isLoading, setLoading] = useState(true);
	const dispatch = useDispatch();

	//add region
	const onAddRegion = async (e) => {
		e.preventDefault();
		let intId = clientId;

		let result = await addClientRegion({
			clientID: intId,
			name: regionInput,
			sites: [],
		});

		if (result.status) {
			// Getting response
			result = result.data;

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

	// fetch RegionsAndSites of client
	const fetchRegionsAndSites = async () => {
		try {
			const result = await getClientRegion(clientId);

			if (cancelFetch.current) {
				return;
			}
			handleSort(result.data, setListOfRegions, "name", "asc");
			setLoading(false);
		} catch (error) {
			setLoading(false);
			dispatch(showError("Failed to fetch region and sites."));
		}
	};

	useEffect(() => {
		fetchRegionsAndSites();
		// eslint-disable-next-line react-hooks/exhaustive-deps

		return () => {
			cancelFetch.current = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={classes.logoContainer}>
			{openAddDialog && (
				<CommonAddDialog
					open={openAddDialog}
					closeHandler={() => setOpenAddDialog(false)}
					label="Region"
					input={regionInput}
					setInput={setRegionInput}
					createHandler={onAddRegion}
				/>
			)}

			<AccordionBox
				title={`Regions And Sites`}
				accordianDetailsCss={classes.regionSiteContainer}
			>
				<AccordionActions className={classes.actionButton}>
					<CurveButton onClick={() => setOpenAddDialog(true)}>
						Add Region
					</CurveButton>
				</AccordionActions>
				{isLoading ? (
					<CircularProgress />
				) : (
					listOfRegions.map((region) => (
						<Region
							key={region.id}
							region={region}
							fetchRegionsAndSites={fetchRegionsAndSites}
							clientId={clientId}
							getError={getError}
						/>
					))
				)}
			</AccordionBox>
		</div>
	);
}

export default ClientRegionAndSites;
