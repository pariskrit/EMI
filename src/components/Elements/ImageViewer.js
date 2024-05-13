import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

const useStyles = makeStyles()((theme) => ({
	dailogBox: {
		overflowX: "hidden!important",
	},
}));
function ImageViewer({ open, onClose, imgSource }) {
	const { classes, cx } = useStyles();
	return (
		<Dialog open={open} onClose={onClose} className="image_Viewer_Dialouge">
			<DialogContent className={classes.dailogBox}>
				<img src={imgSource} alt="" />
			</DialogContent>
		</Dialog>
	);
}

export default ImageViewer;
