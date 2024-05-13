import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Typography from "@mui/material/Typography";
import ColourConstants from "helpers/colourConstants";
import { headerDateFormat } from "helpers/date";

const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
	historyContainer: {
		// marginTop: 10,
		// marginBottom: 10,
		paddingLeft: 2,
		display: "flex",
		gap: "20px",
		[media]: {
			display: "block",
			width: "100%",
		},
	},
	historyText: {
		display: "flex",
		color: ColourConstants.commonText,
	},
	lastSaved: {
		fontWeight: "bold",
		paddingRight: 8,
		fontSize: "14px",
	},
	timestampSize: {
		fontSize: "14px",
	},
}));

const SaveHistory = ({
	hideLastLogin = false,
	hideLastSave = false,
	hideVersion = true,
	versionNumber,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	// Init state
	const [lastSave, setLastSave] = useState("");

	// Running on pageload to set date
	// NOTE: IRL this will have an API call for lastsave or get from global state or receive prop
	useEffect(() => {
		// Creating mock date/time
		const date = headerDateFormat(new Date());

		// Updating date state to render
		setLastSave(date);
	}, []);

	return (
		<div className={`${classes.historyContainer} mt-sm`}>
			{hideLastSave ? null : (
				<div className={classes.historyText}>
					<Typography className={classes.lastSaved}>Last saved:</Typography>
					<Typography className={classes.timestampSize}>{lastSave}</Typography>
				</div>
			)}
			{hideLastLogin ? null : (
				<div className={classes.historyText}>
					<Typography className={classes.lastSaved}>Last login:</Typography>
					<Typography className={classes.timestampSize}>{lastSave}</Typography>
				</div>
			)}
			{hideVersion ? null : (
				<div className={classes.historyText}>
					<Typography className={classes.lastSaved}>Version:</Typography>
					<Typography className={classes.timestampSize}>
						{versionNumber ?? 1}
					</Typography>
				</div>
			)}
		</div>
	);
};

export default SaveHistory;
