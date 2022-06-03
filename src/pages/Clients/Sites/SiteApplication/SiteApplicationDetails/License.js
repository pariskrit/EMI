import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField } from "@material-ui/core";
import AccordionBox from "components/Layouts/AccordionBox";
import { makeStyles } from "@material-ui/core/styles";
import Dropdown from "components/Elements/Dropdown";
import {
	clientOptions,
	siteApplicationOptions,
	siteOptions,
} from "helpers/constants";
import { useParams } from "react-router";
import { Facebook } from "react-spinners-css";
import { patchApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import { getLocalStorageData } from "helpers/utils";

const useStyles = makeStyles((theme) => ({
	siteContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	license_para: {
		margin: 0,
	},
	license_container: {
		display: "flex",
		flexDirection: "column",
		gap: "25px",
	},
	span: {
		marginLeft: 5,
	},
}));

function License({ details }) {
	const classes = useStyles();
	const [input, setInput] = useState({});
	const [isUpdating, setIsUpdating] = useState(false);
	const { appId } = useParams();
	const { role } = getLocalStorageData("me");
	const onInputChange = (e) =>
		setInput({ ...input, [e.target.name]: e.target.value });

	const onDropDownInputChange = async (value) => {
		setInput({ ...input, licenseType: value.value });
		try {
			const result = await patchApplicationDetail(appId, [
				{
					op: "replace",
					path: "licenseType",
					value: value.value,
				},
			]);
			console.log(result);
		} catch (error) {
			console.log(error);
		}
	};

	const updateInput = async () => {
		if (details.licenses === input.licenses) {
			return;
		}
		setIsUpdating(true);
		try {
			const result = await patchApplicationDetail(appId, [
				{
					op: "replace",
					path: "licenses",
					value: input.licenses,
				},
			]);
			console.log(result);
		} catch (error) {
			console.log(error);
		} finally {
			setIsUpdating(false);
		}
	};

	const onEnterKeyPress = (e) => {
		if (e.key === "Enter") {
			updateInput();
		}
	};

	useEffect(() => {
		if (Object.keys(details).length > 0) {
			setInput(details);
		}
	}, [details]);

	// setting licensetype value to site licenseType value if client license type is equal to 'site-based' and site license type is equal to 'application-based'
	//  else set client license type value
	const licenseType =
		details.clientLicenseType === 3 && details.siteLicenseType !== 3
			? siteOptions.find((option) => option.value === details.siteLicenseType)
			: clientOptions.find(
					(option) => option.value === details.clientLicenseType
			  );

	// same as licenseType Value
	const licenseCount =
		details.clientLicenseType === 3 && details.siteLicenseType !== 3
			? details.siteLicenses
			: details.clientLicenses;
	return (
		<AccordionBox title="License">
			{((details.clientLicenseType === 3 && details.siteLicenseType !== 3) ||
				details.clientLicenseType !== 3) && (
				<section className={classes.license_container}>
					<p className={classes.license_para}>
						This Application is using a{" "}
						{details.clientLicenseType === 3 && details.siteLicenseType !== 3
							? "Site"
							: "Client"}{" "}
						License.
					</p>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<label>
								<b>License Type:</b>
							</label>
							<span className={classes.span}>{licenseType?.label}</span>
						</Grid>
						{licenseType?.value !== 2 && (
							<Grid item xs={12}>
								<label>
									<b>License Count:</b>
								</label>
								<span className={classes.span}>{licenseCount}</span>
							</Grid>
						)}
					</Grid>
				</section>
			)}
			{details.clientLicenseType === 3 && details.siteLicenseType === 3 && (
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">Licence Type</Typography>
							<Dropdown
								options={siteApplicationOptions}
								label=""
								width="auto"
								selectedValue={siteApplicationOptions[input?.licenseType]}
								onChange={onDropDownInputChange}
								isReadOnly={role !== "SuperAdmin"}
							/>
						</div>
					</Grid>
					<Grid item xs={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">Total Licence Count</Typography>
							<TextField
								name="licenses"
								value={input?.licenses ?? 0}
								InputProps={{
									endAdornment: isUpdating ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
								}}
								fullWidth
								type="number"
								variant="outlined"
								onChange={onInputChange}
								onBlur={updateInput}
								onKeyDown={onEnterKeyPress}
								disabled={role !== "SuperAdmin"}
							/>
						</div>
					</Grid>
				</Grid>
			)}
		</AccordionBox>
	);
}

export default License;
