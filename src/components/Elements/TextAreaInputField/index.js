import React from "react";
import { TextareaAutosize } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const media = "@media(max-width: 414px)";

const useStyles = makeStyles((theme) => ({
	textInput: {
		width: 800,
		outline: "none",
		padding: "10px",
		fontFamily: `"Roboto Condensed", "Helvetica", "Arial",sans-serif`,
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
	const classes = useStyles();

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
