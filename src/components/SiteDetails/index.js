import React from "react";
import { Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

const SiteDetails = ({ onChange, value }) => {
	const classes = useStyles();

	return (
		<div className={classes.siteContainer}>
			<Typography variant="subtitle2">
				Site name<span className={classes.required}>*</span>
			</Typography>
			<TextField
				name="name"
				fullWidth
				variant="outlined"
				defaultValue="Boddington"
				onChange={onChange}
				value={value}
			/>
		</div>
	);
};

export default SiteDetails;
