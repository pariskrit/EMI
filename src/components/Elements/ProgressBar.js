import React from "react";
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const BorderLinearProgress = withStyles((theme) =>
	createStyles({
		root: {
			height: 10,
			borderRadius: 5,
			marginTop: "5px",
		},
		colorPrimary: {
			backgroundColor: "#ece1e1",
		},
		bar: {
			borderRadius: 5,
			backgroundColor: "#23BB79",
		},
	})
)(LinearProgress);

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
	},
});

export default function ProgressBar({ value }) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<BorderLinearProgress variant="determinate" value={value} />
		</div>
	);
}
