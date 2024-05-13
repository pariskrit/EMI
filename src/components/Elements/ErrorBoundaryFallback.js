import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import CancelIcon from "@mui/icons-material/Cancel";

const useStyles = makeStyles()((theme) => ({
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
}));

const ErrorBoundaryFallback = ({ error, removeError }) => {
	const { classes, cx } = useStyles();
	const handleClose = () => removeError();

	return (
		<Dialog
			open={error?.status}
			onClose={handleClose}
			fullWidth
			style={{ position: "absolute" }}
		>
			<DialogTitle className={classes.dialogTitle}>
				<CancelIcon style={{ fontSize: "9rem" }} />
			</DialogTitle>
			<DialogContent style={{ textAlign: "center" }}>
				<h1>{error?.message}</h1>
			</DialogContent>
		</Dialog>
	);
};

export default ErrorBoundaryFallback;
