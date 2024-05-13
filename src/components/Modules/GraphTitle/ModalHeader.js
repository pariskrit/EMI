import { Box, Typography } from "@mui/material";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "tss-react/mui";
import React from "react";
const useStyles = makeStyles()((theme) => ({
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
}));

const ModalHeader = ({
	modelName,
	asset,
	stageName,
	zoneName,
	taskName,
	questionName,
}) => {
	const { classes, cx } = useStyles();
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
