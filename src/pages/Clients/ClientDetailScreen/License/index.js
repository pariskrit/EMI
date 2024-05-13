import { CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import Dropdown from "components/Elements/Dropdown";
import AccordionBox from "components/Layouts/AccordionBox";
import { RESELLER_ID } from "constants/UserConstants/indes";
import { clientOptions } from "helpers/constants";
import React, { useEffect, useState } from "react";
import { updateClientDetails } from "services/clients/clientDetailScreen";
import UserRoles from "helpers/roles";

const useStyles = makeStyles()((theme) => ({
	detailContainer: {
		marginTop: "25px !important",
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
	},
	inputText: {
		fontSize: 14,
	},
}));

function License({ data, clientId, getError, isLoading, adminType, role }) {
	const { classes, cx } = useStyles();
	const [license, setLicense] = useState({});

	// handling license type dropdown input change and call update api function
	const handleLicenseChange = (value, path) => {
		if (value?.label !== license?.licenseType?.label) {
			setLicense({ ...license, licenseType: value });
			updateLicense(path, value.value);
		}
	};

	// handle licenses input field change
	const handleLicenseInputChange = (e) => {
		setLicense({ ...license, licenses: +e.target.value });
	};

	// update api
	const updateLicense = async (path, value) => {
		const result = await updateClientDetails(clientId, [
			{ op: "replace", path, value },
		]);

		if (!result.status) {
			getError(result.data?.detail || result.data || "Could not update");
		}
	};

	useEffect(() => {
		setLicense({
			...data,
			licenseType: clientOptions.find(
				(option) => option.value === data?.licenseType
			),
		});
	}, [data]);

	const isDisabled =
		license?.licenseType?.label !== "Total Users" &&
		license?.licenseType?.label !== "Concurrent Users";

	return (
		<AccordionBox title="Licenses" accordionClass={classes.detailContainer}>
			{isLoading ? (
				<CircularProgress />
			) : (
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography className={classes.labelText}>
							Licence Type<span style={{ color: "#E31212" }}>*</span>
						</Typography>
						<Dropdown
							options={clientOptions}
							selectedValue={license.licenseType}
							onChange={(value) => handleLicenseChange(value, "licenseType")}
							label=""
							required={true}
							disabled={
								adminType === RESELLER_ID || role === UserRoles.clientAdmin
							}
							width="100%"
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography className={classes.labelText}>
							Total Licence Count<span style={{ color: "#E31212" }}>*</span>
						</Typography>
						<TextField
							sx={{
								"& .MuiInputBase-input.Mui-disabled": {
									WebkitTextFillColor: "#000000",
								},
							}}
							name="licenses"
							disabled={
								isDisabled ||
								adminType === RESELLER_ID ||
								role === UserRoles.clientAdmin
							}
							type="number"
							variant="outlined"
							fullWidth
							InputProps={{
								classes: {
									input: classes.inputText,
								},
							}}
							value={license.licenses || ""}
							onChange={handleLicenseInputChange}
							onBlur={(e) => updateLicense("licenses", +e.target.value)}
						/>
					</Grid>
				</Grid>
			)}
		</AccordionBox>
	);
}

export default License;
