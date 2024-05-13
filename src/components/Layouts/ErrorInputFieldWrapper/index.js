import React from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

const useStyles = makeStyles()((theme) => ({
	error: {
		color: "#f44336",
		fontSize: "0.75rem",
		marginBottom: 0,
	},
}));

function ErrorInputFieldWrapper({ errorMessage, children }) {
	const { classes, cx } = useStyles();
	return (
		<div>
			{children}
			<p className={classes.error}>{errorMessage}</p>
		</div>
	);
}
export default ErrorInputFieldWrapper;
