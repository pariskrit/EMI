import React from "react";
import { connect } from "react-redux";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import { hideError } from "redux/common/actions";
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

const ErrorDialog = ({ error, removeError }) => {
	const classes = useStyles();
	const handleClose = () => removeError();

	return (
		<Dialog
			open={error.status}
			onClose={handleClose}
			fullWidth
			style={{ position: "absolute" }}
		>
			<DialogTitle className={classes.dialogTitle}>
				<CancelIcon style={{ fontSize: "9rem" }} />
			</DialogTitle>
			<DialogContent style={{ textAlign: "center" }}>
				<h1>{error.message}</h1>
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

const mapStateToProps = ({ commonData: { error } }) => ({ error });
const mapDispatchToProps = (dispatch) => ({
	removeError: () => dispatch(hideError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorDialog);
