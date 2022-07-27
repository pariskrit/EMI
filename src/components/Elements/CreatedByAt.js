import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ColourConstants from "helpers/colourConstants";
import { formatAMPM } from "helpers/utils";
import { changeDate } from "helpers/date";

const media = "@media (max-width: 414px)";

const useStyles = makeStyles((theme) => ({
	mainDiv: {
		marginLeft: "5px",
		paddingLeft: "2px",
		display: "flex",
		[media]: {
			marginLeft: 0,
			display: "block",
			width: "100%",
		},
	},
	childDiv: {
		marginLeft: "8px",
		display: "flex",
		color: ColourConstants.commonText,
		[media]: {
			marginLeft: 0,
		},
	},
	boldText: {
		fontWeight: "bold",
		paddingRight: "8px",
		fontSize: "14px",
	},
	simpleText: {
		fontSize: "14px",
	},
}));
const CreatedByAt = ({ time, userName }) => {
	let localTime = changeDate(time);
	let amPm = formatAMPM(new Date(time + "Z"));
	const classes = useStyles();
	return (
		<div className={`${classes.mainDiv} mt-sm `}>
			<div className={classes.childDiv}>
				<Typography className={classes.boldText}>Created By:</Typography>
				<Typography className={classes.simpleText}>{userName}</Typography>
			</div>
			<div className={classes.childDiv}>
				<Typography className={classes.boldText}>on</Typography>
				<Typography className={classes.simpleText}>{localTime}</Typography>
			</div>
			<div className={classes.childDiv}>
				<Typography className={classes.boldText}>at</Typography>
				<Typography className={classes.simpleText}>{amPm}</Typography>
			</div>
		</div>
	);
};
export default CreatedByAt;
