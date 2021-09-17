import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ColourPicker from "components/Elements/ColourPicker";

const useStyles = makeStyles((theme) => ({
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
}) => {
	// Init hooks
	const classes = useStyles();

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
							{"Edit Application Colour"}
						</DialogTitle>

						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								Select new application colour below.
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
