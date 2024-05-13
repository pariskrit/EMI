import React, { useEffect, useRef, useState } from "react";
import DetailsPanel from "components/Elements/DetailsPanel";
import { getLocalStorageData, isoDateWithoutTimeZone } from "helpers/utils";
import TabTitle from "components/Elements/TabTitle";
import { Grid, Typography } from "@mui/material";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import LoggedInUsers from "./LoggedInUsers";
import CheckedOutServices from "./CheckedOutServices";
import {
	getLicenseCount,
	getLicenses,
	getCheckedOutServices,
	getLicenseDetails,
} from "services/clients/sites/siteLicenses";
import License from "./License";

const media = "@media(max-width: 414px)";
const useStyles = makeStyles()((theme) => ({
	listActions: {
		marginBottom: 30,
	},
	headerContainer: {
		display: "flex",
		[media]: {
			flexDirection: "column",
		},
	},
	headerText: {
		fontSize: 21,
	},
	buttonContainer: {
		display: "flex",
		marginLeft: "auto",
		[media]: {
			marginLeft: 0,
		},
	},
	importButton: {
		background: "#ED8738",
		width: "50%",
	},
	productButton: {
		backgroundColor: ColourConstants.confirmButton,
		color: "#FFFFFF",
		fontFamily: "Roboto Condensed",
		width: 150,
		fontSize: "13.5px",
		fontWeight: "bold",
		marginRight: "10px",
	},
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
	filter: {
		display: "flex",
	},
}));
const SiteLicenses = () => {
	const { classes, cx } = useStyles();
	const [isLoading, setIsLoading] = useState(false);
	const cancelFetch = useRef(false);
	const [usersList, setUsersList] = useState([]);
	const [servicesList, setServicesList] = useState([]);
	const [licenseCount, setLicenseCount] = useState(0);
	const [licenseData, setLicenseData] = useState({});
	const importButton = {
		"&.MuiButton-root": {
			backgroundColor: "#ED8738",
		},
	};

	const { customCaptions, application, siteAppID, siteName } =
		getLocalStorageData("me");

	const fetchAllData = async () => {
		setIsLoading(true);
		const [response1, response2, response3, response4] = await Promise.all([
			getLicenseCount(siteAppID),
			getLicenses(siteAppID),
			getCheckedOutServices(siteAppID),
			getLicenseDetails(siteAppID),
		]);
		if (cancelFetch.current) {
			return;
		}
		if (response2?.status) {
			setLicenseCount(response1?.data);
			setUsersList(
				response2?.data.map((data) => ({
					id: data?.userID,
					firstName: data?.firstName,
					lastName: data?.lastName,
					dateTime: isoDateWithoutTimeZone(data?.dateTime + "Z"),
				}))
			);
		}
		if (response3?.status) {
			setServicesList(
				response3?.data.map((data) => ({
					id: data?.userID,
					workOrder: data?.workOrder,
					modelName: data?.modelName,
					asset: data?.assetName,
					intervalName: data?.intervalName,
					roleName: data?.roleName,
					displayName: data?.displayName,
					checkOutDate: isoDateWithoutTimeZone(data?.checkOutDate + "Z"),
				}))
			);
		}
		if (response4?.status) {
			setLicenseData(response4?.data);
		}
		setIsLoading(false);
	};
	useEffect(() => {
		fetchAllData();

		return () => {
			cancelFetch.current = true;
		};
		// esl`int`-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<TabTitle title={`Licenses Used | ${application.name}`} />
			<div className="container">
				<Typography className={classes.headerText} component="h1" gutterBottom>
					<strong>Licenses Used</strong>
				</Typography>
				<div
					className="detailsContainer"
					style={{ alignItems: "center", marginTop: "-15px" }}
				>
					<DetailsPanel
						showHeader={false}
						description={`Licenses that are currently used for ${application.name} - ${siteName}`}
					/>
				</div>
				<div style={{ marginTop: 22 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<License
										details={licenseData}
										loggedInUsersCount={usersList?.length}
									/>
								</Grid>
							</Grid>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<LoggedInUsers usersList={usersList} isLoading={isLoading} />
								</Grid>
							</Grid>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<CheckedOutServices
										customCaptions={customCaptions}
										servicesList={servicesList}
										isLoading={isLoading}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</div>
		</>
	);
};
export default SiteLicenses;
