import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import ColourConstants from "helpers/colourConstants";

const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: 500,
		[media]: {
			width: "100%",
			overflow: "hidden",
		},
	},
	spinnerContainer: {
		minHeight: 120,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	actionContainer: {
		display: "inline-flex",
		[media]: {
			flexWrap: "wrap",
			overflow: "hidden",
		},
	},
	headerText: {
		marginRight: "auto",
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: 21,
		// width: "100%",
		[media]: {
			fontSize: 18,
			width: "100%",
		},
	},
	buttonContainer: {
		marginLeft: "auto",
		[media]: {
			marginLeft: "18px",
		},
	},
	confirmButon: {
		height: 43,
		fontSize: 15,
		backgroundColor: ColourConstants.confirmButton,
		color: "#FFFFFF",
		fontFamily: "Roboto Condensed",
	},
	cancelButton: {
		height: 43,
		fontSize: 15,
		backgroundColor: ColourConstants.cancelButton,
		color: "#FFFFFF",
		fontFamily: "Roboto Condensed",
	},
	inputContainer: {
		width: "100%",
	},
}));

const DefaultDialog = ({
	open,
	closeHandler,
	data,
	entity,
	handleDefaultUpdate,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);

	// Handlers
	const handleUpdateClick = () => {
		setIsUpdating(true);

		handleDefaultUpdate().then(() => {
			setIsUpdating(false);
			closeHandler();
		});
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeHandler}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<div className={classes.actionContainer}>
					<DialogTitle id="alert-dialog-title">
						{
							<Typography className={classes.headerText}>
								Make {entity} default
							</Typography>
						}
					</DialogTitle>
					<DialogActions className={classes.buttonContainer}>
						<Button
							onClick={closeHandler}
							variant="contained"
							className={classes.cancelButton}
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
							Cancel
						</Button>
						<Button
							className={classes.confirmButon}
							variant="contained"
							onClick={handleUpdateClick}
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
							Confirm
						</Button>
					</DialogActions>
				</div>
				<DialogContent className={classes.dialogContent}>
					<DialogContentText
						id="alert-dialog-description"
						className={classes.inputContainer}
					>
						You are about to make <strong>{data[1]}</strong> the default{" "}
						{entity}. Are you sure?
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DefaultDialog;
