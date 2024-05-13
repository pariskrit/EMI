import React from "react";
import { TextareaAutosize } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

const media = "@media(max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
	textInput: {
		width: 800,
		fontWeight: 400,
		lineHeight: 1.43,
		letterSpacing: "0.01071em",
		outline: "none",
		padding: "10px",
		fontFamily: `"Roboto", "Helvetica", "Arial",sans-serif`,
		[media]: {
			width: "100%",
		},
	},
}));

function TextAreaInputField({
	value,
	minRows,
	onChange,
	onKeyPress,
	onBlur,
	disabled,
	...props
}) {
	const { classes, cx } = useStyles();

	return (
		<TextareaAutosize
			minRows={minRows}
			onBlur={onBlur}
			onKeyPress={onKeyPress}
			value={value}
			onChange={onChange}
			disabled={disabled}
			className={classes.textInput}
			{...props}
		/>
	);
}

export default TextAreaInputField;
