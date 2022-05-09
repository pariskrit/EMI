import { TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { Facebook } from "react-spinners-css";

const useStyles = makeStyles((theme) => ({
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
		marginBottom: "5px",
	},
	inputText: {
		color: "#000000de",
	},
}));
function TextFieldContainer({
	label,
	name,
	value,
	onChange,
	className = null,
	onBlur = () => {},
	isFetching = false,
	isDisabled = false,
	onKeyDown,
	isRequired = true,
	type = "text",
}) {
	const classes = useStyles();

	return (
		<div className={className} style={{ width: "100%", marginBottom: "14px" }}>
			<Typography className={classes.labelText}>
				{label}
				{isRequired ? <span style={{ color: "#E31212" }}>*</span> : null}
			</Typography>
			<TextField
				name={name}
				variant="outlined"
				fullWidth
				InputProps={{
					classes: {
						input: classes.inputText,
					},
					endAdornment: isFetching ? (
						<Facebook size={20} color="#A79EB4" />
					) : null,
				}}
				onChange={onChange}
				onBlur={onBlur}
				disabled={isFetching || isDisabled}
				onKeyDown={onKeyDown}
				value={value ?? ""}
				type={type}
			/>
		</div>
	);
}

export default TextFieldContainer;
