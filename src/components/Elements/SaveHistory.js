import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ColourConstants from "../../helpers/colourConstants";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
	historyContainer: {
		// marginTop: 10,
		// marginBottom: 10,
		paddingLeft: 2,
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

const SaveHistory = () => {
	// Init hooks
	const classes = useStyles();

	// Init state
	const [lastSave, setLastSave] = useState("");

	// Running on pageload to set date
	// NOTE: IRL this will have an API call for lastsave or get from global state or receive prop
	useEffect(() => {
		// Creating mock date/time
		let date = dayjs();

		// Updating date state to render
		setLastSave(`${date.format("DD.MM.YYYY")} / ${date.format("HH:mm")} AEDT`);
	}, []);

	return (
		<div className={`${classes.historyContainer} mt-sm`}>
			<div className={classes.historyText}>
				<Typography className={classes.lastSaved}>Last saved:</Typography>
				<Typography className={classes.timestampSize}>{lastSave}</Typography>
			</div>
		</div>
	);
};

export default SaveHistory;
