import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	error: {
		color: "#f44336",
		fontSize: "0.75rem",
		marginBottom: 0,
	},
});

function ErrorInputFieldWrapper({ errorMessage, children }) {
	const classes = useStyles();
	return (
		<div>
			{children}
			<p className={classes.error}>{errorMessage}</p>
		</div>
	);
}
export default ErrorInputFieldWrapper;
