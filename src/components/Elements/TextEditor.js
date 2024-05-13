import React from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import "react-quill/dist/quill.snow.css";

const useStyles = makeStyles()((theme) => ({
	quill: {},
}));

const TextEditor = ({
	id,
	onChange,
	theme,
	placeholder,
	value,
	name,
	readOnly,
	onBlur,
	onKeyDown,
}) => {
	const { classes, cx } = useStyles();
	return (
		<div>
			<ReactQuill
				preserveWhitespace={true}
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				theme={theme}
				placeholder={placeholder}
				modules={TextEditor.modules}
				formats={TextEditor.formats}
				readOnly={readOnly}
				onBlur={onBlur}
				onKeyDown={onKeyDown}
				className={classes.quill}
			></ReactQuill>
		</div>
	);
};

TextEditor.defaultProps = {
	theme: "snow",
	readOnly: false,
	onChange: () => {},
};

TextEditor.propTypes = {
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	theme: PropTypes.string,
	style: PropTypes.object,
	value: PropTypes.string,
	name: PropTypes.string,
	readOnly: PropTypes.bool,
	onBlur: PropTypes.func,
};

TextEditor.modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }],
		[{ size: [] }],
		["bold", "italic", "underline", "strike", "blockquote"],
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};

TextEditor.formats = [
	"header",
	"size",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
];

export default TextEditor;
