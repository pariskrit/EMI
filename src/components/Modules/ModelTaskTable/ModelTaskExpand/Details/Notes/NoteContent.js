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
	dialogAction: {
		display: "flex",
	},
	inputText: {
		color: "#000000de",
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
				<div className={classes.dialogAction}>
					<DialogTitle id="alert-dialog-title">
						<ADD.HeaderText>Note</ADD.HeaderText>
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.ConfirmButton onClick={onClose} variant="contained">
							Close
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</div>
				<DialogContent className={classes.dialogContent}>
					<TextField
						value={note}
						variant="outlined"
						fullWidth
						InputProps={{
							classes: {
								input: classes.inputText,
							},
						}}
						disabled
						multiline
					/>
				</DialogContent>
			</div>
		</Dialog>
	);
}

export default ContentDialog;
