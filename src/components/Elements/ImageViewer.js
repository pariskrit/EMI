import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";

function ImageViewer({ open, onClose, imgSource }) {
	return (
		<Dialog open={open} onClose={onClose} className="image_Viewer_Dialouge">
			<DialogContent>
				<img src={imgSource} alt="" />
			</DialogContent>
		</Dialog>
	);
}

export default ImageViewer;
