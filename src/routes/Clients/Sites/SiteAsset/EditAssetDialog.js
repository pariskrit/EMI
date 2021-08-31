import React from "react";
import { Dialog, makeStyles } from "@material-ui/core";
import EditDialogStyle from "styles/application/EditDialogStyle";

const ET = EditDialogStyle();

const useStyles = makeStyles({
	// Override for paper used in dialog
	paper: { minWidth: "90%" },
});

const EditAssetDialog = ({ open, closeHandler }) => {
	const classes = useStyles();
	return (
		<div>
			<Dialog
				classes={{ paper: classes.paper }}
				open={open}
				onClose={closeHandler}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			></Dialog>
		</div>
	);
};

export default EditAssetDialog;
