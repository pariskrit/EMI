import { TextField, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import React from "react";
import { Facebook } from "react-spinners-css";

const useStyles = makeStyles()((theme) => ({
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
		marginBottom: "5px",
	},
}));
function TextFieldContainer({
	label,
	name,
	value,
	onChange,
	className = null,
	onBlur = () => {},
	onFocus = () => {},
	isFetching = false,
	isDisabled = false,
	onKeyDown,
	isRequired = true,
	type = "text",
	error = false,
	placeholder = "",
}) {
	const { classes } = useStyles();

	return (
		<div className={className} style={{ width: "100%", marginBottom: "14px" }}>
			<Typography className={classes.labelText}>
				{label}
				{isRequired ? <span style={{ color: "#E31212" }}>*</span> : null}
			</Typography>
			<TextField
				name={name}
				placeholder={placeholder}
				variant="outlined"
				fullWidth
				InputProps={{
					endAdornment: isFetching ? (
						<Facebook size={20} color="#A79EB4" />
					) : null,
				}}
				sx={{
					"& .MuiInputBase-input.Mui-disabled": {
						WebkitTextFillColor: "#000000",
					},
				}}
				onChange={onChange}
				onBlur={onBlur}
				onFocus={onFocus}
				disabled={isFetching || isDisabled}
				onKeyDown={onKeyDown}
				value={value ?? ""}
				type={type}
				error={error}
			/>
		</div>
	);
}

export default TextFieldContainer;
