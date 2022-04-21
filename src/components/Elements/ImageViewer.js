import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	dailogBox: {
		overflowX: "hidden!important",
	},
});
function ImageViewer({ open, onClose, imgSource }) {
	const classes = useStyles();
	return (
		<Dialog open={open} onClose={onClose} className="image_Viewer_Dialouge">
			<DialogContent className={classes.dailogBox}>
				<img src={imgSource} alt="" />
			</DialogContent>
		</Dialog>
	);
}

export default ImageViewer;
