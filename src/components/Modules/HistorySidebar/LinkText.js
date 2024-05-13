import React from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

const useStyles = makeStyles()((theme) => ({
	linkText: {
		textDecoration: "underline #1880e8",
		textDecorationThickness: "2px",
		color: "#1880e8",
		"&:hover": {
			cursor: "pointer",
		},
	},
}));

export default function LinkText({ isLink = false, text, onClick }) {
	const { classes } = useStyles();
	return isLink ? (
		<span className={classes.linkText} onClick={onClick}>
			{text}
		</span>
	) : (
		<span>{text}</span>
	);
}
