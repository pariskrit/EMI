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
				<div style={{ display: "flex" }}>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Note</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.ConfirmButton
							onClick={onClose}
							variant="contained"
							style={{ width: "105px" }}
						>
							Close
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</div>
				<DialogContent className={classes.dialogContent}>
					<TextField
						value={note}
						variant="outlined"
						fullWidth
						multiline
						InputProps={{
							classes: {
								input: classes.inputText,
							},
						}}
						disabled
					/>
				</DialogContent>
			</div>
		</Dialog>
	);
}

export default ContentDialog;
