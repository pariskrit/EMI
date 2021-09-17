import React from "react";
import { Grid, Typography, TextField } from "@material-ui/core";
import AccordionBox from "components/Layouts/SiteWrapper/AccordionBox";
import { makeStyles } from "@material-ui/core/styles";
import Dropdown from "components/Elements/Dropdown";
import { siteApplicationOptions } from "helpers/constants";

const useStyles = makeStyles((theme) => ({
	siteContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
}));

function License() {
	const classes = useStyles();
	return (
		<AccordionBox title="License">
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">Licence Type</Typography>
						<Dropdown options={siteApplicationOptions} label="" width="auto" />
					</div>
				</Grid>
				<Grid item xs={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">Total Licence Count</Typography>
						<TextField
							name="licenses"
							// InputProps={{
							// 	endAdornment:
							// 		newInput.label === "licenses" && newInput.isUpdating ? (
							// 			<Facebook size={20} color="#A79EB4" />
							// 		) : null,
							// }}

							fullWidth
							type="number"
							variant="outlined"
							value={2}

							// onChange={onInputChange}
							// onBlur={onUpdateInput}
							// onFocus={setSelectedInputValue}
							// onKeyDown={onEnterKeyPress}
						/>
					</div>
				</Grid>
			</Grid>
		</AccordionBox>
	);
}

export default License;
