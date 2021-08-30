import React from "react";
import { Typography, TextField, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Dropdown from "components/Dropdown";

const options = [
	{ label: "Total Users", value: 0 },
	{ label: "Concurrent Users", value: 1 },
	{ label: "Per Job per Role", value: 2 },
	{ label: "Site-Based Licencing", value: 3 },
];

const useStyles = makeStyles((theme) => ({
	required: {
		color: "red",
	},
	siteContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
}));

const SiteDetails = () => {
	const classes = useStyles();

	return (
		<Grid container spacing={2}>
			<Grid item sm={6}>
				<div className={classes.siteContainer}>
					<Typography variant="subtitle2">
						Site name<span className={classes.required}>*</span>
					</Typography>
					<TextField
						name="name"
						fullWidth
						variant="outlined"
						defaultValue="Boddington"
					/>
				</div>
			</Grid>
			<Grid item sm={6}>
				<div className={classes.siteContainer}>
					<Typography variant="subtitle2">
						Region<span className={classes.required}>*</span>
					</Typography>
					<Dropdown
						options={[
							{ label: "Nepal", value: 0 },
							{ label: "India", value: 2 },
						]}
						selectedValue={{ label: "Nepal", value: 0 }}
						label=""
						required={true}
						width="100%"
					/>
				</div>
			</Grid>
			<Grid item sm={6}>
				<div className={classes.siteContainer}>
					<Typography variant="subtitle2">
						Company Name<span className={classes.required}>*</span>
					</Typography>
					<TextField
						name="companyName"
						fullWidth
						variant="outlined"
						defaultValue="Wen"
					/>
				</div>
			</Grid>
			<Grid item sm={6}>
				<div className={classes.siteContainer}>
					<Typography variant="subtitle2">
						Address<span className={classes.required}>*</span>
					</Typography>
					<TextField
						name="address"
						fullWidth
						variant="outlined"
						defaultValue="KTM,MAMAGHAR"
					/>
				</div>
			</Grid>
			<Grid item sm={6}>
				<div className={classes.siteContainer}>
					<Typography variant="subtitle2">
						Business Number<span className={classes.required}>*</span>
					</Typography>
					<TextField
						name="address"
						fullWidth
						variant="outlined"
						defaultValue="KTM,MAMAGHAR"
					/>
				</div>
			</Grid>
			<Grid item sm={6}>
				<div className={classes.siteContainer}>
					<Typography variant="subtitle2">
						Licence Type<span className={classes.required}>*</span>
					</Typography>
					<Dropdown
						options={options}
						selectedValue={{ label: "Total Users", value: 0 }}
						label=""
						required={true}
						width="100%"
					/>
				</div>
			</Grid>
			<Grid item sm={6}>
				<div className={classes.siteContainer}>
					<Typography variant="subtitle2">
						Total Licence Count<span className={classes.required}>*</span>
					</Typography>
					<TextField
						name="address"
						fullWidth
						type="number"
						variant="outlined"
						defaultValue="4"
					/>
				</div>
			</Grid>
		</Grid>
	);
};

export default SiteDetails;
