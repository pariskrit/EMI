import { TextareaAutosize } from "@material-ui/core";
import React from "react";

function TextAreaInputField({
	value,
	minRows,
	onChange,
	onKeyPress,
	onBlur,
	disabled,
}) {
	return (
		<TextareaAutosize
			minRows={minRows}
			onBlur={onBlur}
			onKeyPress={onKeyPress}
			style={{
				width: 800,
				outline: "none",
				padding: "10px",
				fontFamily: `"Roboto", "Helvetica", "Arial",sans-serif`,
			}}
			value={value}
			onChange={onChange}
			disabled={disabled}
		/>
	);
}

export default TextAreaInputField;
