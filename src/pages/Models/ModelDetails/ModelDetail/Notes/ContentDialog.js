import {
	Dialog,
	DialogContent,
	DialogTitle,
	TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";

const ADD = AddDialogStyle();

const useStyles = makeStyles({
	dialogContainer: {
		width: "370px",
	},
	dialogContent: {
		display: "flex",
		flexDirection: "column",
	},
});

function ContentDialog({ open, onClose, note }) {
	const classes = useStyles();
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<div className={classes.dialogContainer}>
				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Note</ADD.HeaderText>}
					</DialogTitle>
				</ADD.ActionContainer>
				<DialogContent className={classes.dialogContent}>
					<TextField label="Note" value={note} fullWidth multiline />
				</DialogContent>
			</div>
		</Dialog>
	);
}

export default ContentDialog;
