import { Box, Typography, makeStyles } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import React from "react";
const useStyles = makeStyles({
	textColor: {
		color: ColourConstants.commonText,
	},
	header: {
		fontSize: "24px",
		fontWeight: "bold",
	},
	normalText: {
		fontSize: "16px",
	},
	questionText: {
		fontSize: "16px",
		fontWeight: "bold",
	},
});

const ModalHeader = ({
	modelName,
	asset,
	stageName,
	zoneName,
	taskName,
	questionName,
}) => {
	const classes = useStyles();
	return (
		<Box className={classes.textColor}>
			<Typography className={classes.header}>{modelName}</Typography>
			<Typography className={classes.normalText}>{asset}</Typography>
			<Typography className={classes.normalText}>
				{`${stageName}  ${zoneName ? "/ " + zoneName : ""} ${
					taskName ? "/ " + taskName : ""
				}`}
			</Typography>
			<Typography className={classes.questionText}>{questionName}</Typography>
		</Box>
	);
};

export default ModalHeader;
