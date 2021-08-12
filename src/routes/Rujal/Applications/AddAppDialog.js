import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Typography,
	LinearProgress,
	InputAdornment,
} from "@material-ui/core";
import * as yup from "yup";
import ArrowIcon from "../../../assets/icons/arrowIcon.svg";
import AddDialogStyle from "../../../styles/application/AddDialogStyle";
import { handleValidateObj, generateErrorState } from "../../../helpers/utils";
import API from "../../../helpers/api";
import { BASE_API_PATH } from "../../../helpers/constants";
import Autocomplete from "@material-ui/lab/Autocomplete";

const schema = yup.object({
	applicationId: yup
		.number("This field must be a number")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { applicationId: null };
const defaultError = { applicationId: null };

const useStyles = makeStyles({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
	},
	createButton: {
		width: "auto",
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	inputText: {
		fontSize: 14,
	},
});
const AddAppDialog = ({ open, handleClose, createHandler }) => {
	const classes = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [availableApp, setAvailableApp] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchAvailableApp = async () => {
			setLoading(true);
			try {
				let result = await API.get(
					`${BASE_API_PATH}ClientApplications/${8}/available`
				);
				if (result.status === 200) {
					result = result.data.map((x) => ({ label: x.name, value: x.id }));
					setAvailableApp(result);
					setLoading(false);
				} else {
					throw new Error(result);
				}
			} catch (err) {
				console.log(err);
				setLoading(false);
				return err;
			}
		};
		if (open) {
			fetchAvailableApp();
		}
		return () => setAvailableApp([]);
	}, [open]);

	const closeOverride = () => {
		setInput(defaultData);
		setErrors(defaultError);

		handleClose();
	};

	const handleCreateData = async () => {
		setLoading(true);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await createHandler(input.applicationId);
				if (newData.success) {
					setLoading(false);
					closeOverride();
				} else {
					console.log(newData);
					setErrors({ ...errors, ...newData.errors });
					setLoading(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setLoading(false);
			}
		} catch (err) {
			console.log(err);

			setLoading(false);
			closeOverride();
		}
	};

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>Add Application</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={handleClose} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={handleCreateData}
						variant="contained"
						className={classes.createButton}
					>
						Add Application
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<Typography className={classes.labelText}>
					Select Application
				</Typography>
				<Autocomplete
					id="combo-box-demo"
					onChange={(e, value) => setInput({ applicationId: value.value })}
					options={availableApp}
					getOptionLabel={(option) => option.label}
					getOptionSelected={(option, value) => option.label === value.label}
					renderInput={(params) => (
						<TextField
							name="application"
							error={errors.applicationId === null ? false : true}
							helperText={
								errors.applicationId === null ? null : errors.applicationId
							}
							{...params}
							fullWidth
							variant="outlined"
							InputProps={{
								...params.InputProps,
								classes: {
									input: classes.inputText,
								},
								endAdornment: (
									<InputAdornment style={{ marginRight: -50 }}>
										<img
											alt="Expand icon"
											src={ArrowIcon}
											className={classes.expandIcon}
										/>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default AddAppDialog;
