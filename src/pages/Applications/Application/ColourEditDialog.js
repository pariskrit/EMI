import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ColourPicker from "components/Elements/ColourPicker";

const useStyles = makeStyles()((theme) => ({
	contentContainer: {
		textAlign: "center",
	},
	colourPicker: {
		display: "flex",
		justifyContent: "center",
	},
}));

const ColourEditDialog = ({
	open,
	handleClose,
	handleUpdateColour,
	currentColour,
	title = "Edit Application Colour",
	subtitle = "Select new application colour below.",
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	// Init state
	const [colour, setColour] = useState(currentColour);

	// Handlers
	const saveColourUpdate = () => {
		handleUpdateColour(colour);
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="edit-colour"
				aria-describedby="edit-dialog-colour"
			>
				<Grid container className={classes.contentContainer}>
					<Grid item xs={12}>
						<DialogTitle
							id="alert-dialog-title"
							className={classes.dialogTitle}
						>
							{title}
						</DialogTitle>

						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								{subtitle}
							</DialogContentText>
						</DialogContent>
					</Grid>

					<Grid item xs={12} className={classes.colourPicker}>
						<ColourPicker
							updateParent={setColour}
							colour={colour}
							includeInput={true}
						/>
					</Grid>
				</Grid>
				<DialogActions>
					<Button onClick={handleClose} variant="contained">
						Cancel
					</Button>
					<Button
						onClick={saveColourUpdate}
						color="primary"
						variant="contained"
					>
						Update Colour
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ColourEditDialog;
