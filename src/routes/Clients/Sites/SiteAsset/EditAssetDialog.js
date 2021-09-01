import React, { useState } from "react";
import {
	Dialog,
	DialogContentText,
	DialogTitle,
	LinearProgress,
	makeStyles,
} from "@material-ui/core";
import EditDialogStyle from "styles/application/EditDialogStyle";

const ET = EditDialogStyle();

const useStyles = makeStyles({
	// Override for paper used in dialog
	paper: { minWidth: "90%" },
});

const EditAssetDialog = ({ open, closeHandler, data }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);

	const closeOverride = () => {
		closeHandler();
	};

	return (
		<div>
			<Dialog
				classes={{ paper: classes.paper }}
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{loading ? <LinearProgress /> : null}
				<ET.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						<ET.HeaderText>Edit Asset</ET.HeaderText>
					</DialogTitle>
					<ET.ButtonContainer>
						<ET.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</ET.CancelButton>
						<ET.ConfirmButton variant="contained" onClick={() => {}}>
							Save
						</ET.ConfirmButton>
					</ET.ButtonContainer>
				</ET.ActionContainer>
				<ET.DialogContent>
					<DialogContentText></DialogContentText>
				</ET.DialogContent>
			</Dialog>
		</div>
	);
};

export default EditAssetDialog;
