import React from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { makeStyles } from "@material-ui/core/styles";
import "react-quill/dist/quill.snow.css";

const useStyles = makeStyles({
	quill: {
		height: "85px",
	},
});

const TextEditor = ({
	id,
	onChange,
	theme,
	placeholder,
	value,
	name,
	readOnly,
	onBlur,
}) => {
	const classes = useStyles();
	return (
		<div>
			<ReactQuill
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
				className={classes.quill}
			/>
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
