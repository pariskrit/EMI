import React from "react";
import PropTypes from "prop-types";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CurveButton from "./CurveButton";

const useStyles = makeStyles({
	dialogTitle: {
		backgroundColor: "#E31212",
		color: "#FFFFFF",
		display: "flex",
		justifyContent: "center",
	},
	dialogAction: {
		display: "flex",
		justifyContent: "center",
	},
});

const ErrorDialog = ({ open, handleClose, message }) => {
	const classes = useStyles();

	return (
		<Dialog open={open} onClose={handleClose} fullWidth>
			<DialogTitle className={classes.dialogTitle}>
				<CancelIcon style={{ fontSize: "9rem" }} />
			</DialogTitle>
			<DialogContent style={{ textAlign: "center" }}>
				<h1>Oh shap!</h1>
				<p>{message}</p>
			</DialogContent>
			<DialogActions className={classes.dialogAction}>
				<CurveButton
					style={{ backgroundColor: "#E31212" }}
					onClick={handleClose}
				>
					Dismiss
				</CurveButton>
			</DialogActions>
		</Dialog>
	);
};

export default ErrorDialog;

ErrorDialog.defaultProps = {
	message: "Change a few things up and try submitting again",
};

ErrorDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	message: PropTypes.string,
};
