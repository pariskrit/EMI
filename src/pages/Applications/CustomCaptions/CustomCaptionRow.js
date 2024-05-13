import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { styled } from "@mui/styles";
import TableStyle from "styles/application/TableStyle";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";

import { Facebook } from "react-spinners-css";

// Icon Import
import { ReactComponent as CaptionIcon } from "assets/icons/custom-caption.svg";

// Init styled components
const AT = TableStyle();

const useStyles = makeStyles()((theme) => ({
	root: {
		"& .MuiFormLabel-root": {
			color: "#CCCCCC",
			fontStyle: "italic",
		},
	},
	captionIconContainer: {
		display: "flex",
		marginRight: 20,
	},
	standardCaptionText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
	},
	inputCell: {
		paddingRight: 15,
		paddingLeft: 15,
	},
}));

const CustomCaptionRow = ({
	singularKey,
	singularValue,
	singularDefault,
	pluralKey,
	pluralValue,
	pluralDefault,
	handleUpdateCustomCaption,
	indents,
	isReseller,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	// Init state
	const [isUpdating, setIsUpdating] = useState("");
	const [errors, setErrors] = useState({
		[singularKey]: null,
		[pluralKey]: null,
	});
	const [indentArr, setIndentArr] = useState([]);
	const [singularInput, setSingularInput] = useState(
		singularValue === null ? "" : singularValue
	);
	const [pluralInput, setPluralInput] = useState(
		pluralValue === null ? "" : pluralValue
	);

	// Handlers
	const handleUpdate = (input, original, key, param) => {
		// Clearing errors (if present)
		setErrors({ ...errors, ...{ [key]: null } });

		// Instant return if no new input
		if (input === original) {
			return;
		}
		if (input === "") {
			if (param === "singular") {
				setSingularInput(original);
			}
			if (param === "plural") {
				setPluralInput(original);
			}
		}

		setIsUpdating(key);

		handleUpdateCustomCaption(key, input).then((res) => {
			if (res.success) {
				setIsUpdating("false");
			} else {
				setErrors({ ...errors, ...res.error });
				setIsUpdating("false");
			}
		});
	};

	// Building indent array if required
	useEffect(() => {
		if (indents !== 0) {
			const Indenter = styled("div")({
				paddingRight: 30,
			});

			let newIndentArr = [];

			for (let i = 0; i < indents; i++) {
				newIndentArr.push(Indenter);
			}

			setIndentArr(newIndentArr);
		}
	}, [indents]);

	return (
		<TableRow>
			<AT.DataCell>
				<AT.CellContainer>
					{indentArr.map((Indenter, index) => {
						return <Indenter key={index} />;
					})}
					<div className={classes.captionIconContainer}>
						<CaptionIcon />
					</div>

					<AT.TableBodyText className={classes.standardCaptionText}>
						{singularDefault}
					</AT.TableBodyText>
				</AT.CellContainer>
			</AT.DataCell>

			<AT.DataCell className={classes.inputCell}>
				<AT.CellContainer>
					<TextField
						sx={{
							"& .MuiInputBase-input.Mui-disabled": {
								WebkitTextFillColor: "#000000",
							},
						}}
						className={`${classes.root} inputCustomCaptionRow`}
						InputProps={{
							endAdornment:
								isUpdating === singularKey ? (
									<Facebook size={20} color="#A79EB4" />
								) : null,
							readOnly: isReseller,
						}}
						InputLabelProps={{ shrink: false }}
						variant="outlined"
						fullWidth
						size="small"
						error={errors[singularKey] === null ? false : true}
						helperText={
							errors[singularKey] === null ? null : errors[singularKey]
						}
						label={singularInput !== "" ? null : singularDefault}
						disabled={isUpdating === singularKey}
						value={singularInput}
						onChange={(e) => setSingularInput(e.target.value)}
						onBlur={() => {
							handleUpdate(
								singularInput,
								singularValue,
								singularKey,
								"singular"
							);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter")
								handleUpdate(
									singularInput,
									singularValue,
									singularKey,
									"singular"
								);
						}}
					/>
				</AT.CellContainer>
			</AT.DataCell>

			<AT.DataCell className={classes.inputCell}>
				<AT.CellContainer>
					<TextField
						sx={{
							"& .MuiInputBase-input.Mui-disabled": {
								WebkitTextFillColor: "#000000",
							},
						}}
						className={`${classes.root} inputCustomCaptionRow`}
						InputProps={{
							endAdornment:
								isUpdating === pluralKey ? (
									<Facebook size={20} color="#A79EB4" />
								) : null,
							readOnly: isReseller,
						}}
						InputLabelProps={{ shrink: false }}
						variant="outlined"
						fullWidth
						size="small"
						error={errors[pluralKey] === null ? false : true}
						helperText={errors[pluralKey] === null ? null : errors[pluralKey]}
						label={pluralInput !== "" ? null : pluralDefault}
						disabled={isUpdating === pluralKey}
						value={pluralInput}
						onChange={(e) => setPluralInput(e.target.value)}
						onBlur={() => {
							handleUpdate(pluralInput, pluralValue, pluralKey, "plural");
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter")
								handleUpdate(pluralInput, pluralValue, pluralKey, "plural");
						}}
					/>
				</AT.CellContainer>
			</AT.DataCell>
		</TableRow>
	);
};

export default CustomCaptionRow;
