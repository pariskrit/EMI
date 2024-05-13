import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Dropdown from "components/Elements/Dropdown";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import useDidMountEffect from "hooks/useDidMountEffect";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import AddDialogStyle from "styles/application/AddDialogStyle";
import * as yup from "yup";

const schema = yup.object({
	applicationId: yup
		.number("This field must be a number")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { applicationId: null };
const defaultError = { applicationId: null };

const useStyles = makeStyles()((theme) => ({
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
}));
const selectedDefault = {
	id: null,
	logoURL: "",
	name: "",
	purpose: "",
};
const AddAppDialog = ({ open, handleClose, createHandler, clientId }) => {
	const { classes, cx } = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [availableApp, setAvailableApp] = useState([]);
	const [selectedApp, setSelectedApp] = useState(selectedDefault);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	useEffect(() => {
		const fetchAvailableApp = async () => {
			setLoading(true);
			try {
				let result = await API.get(
					`${BASE_API_PATH}ClientApplications/${clientId}/available`
				);
				if (result.status === 200) {
					result = result.data;
					setAvailableApp(result);
					setLoading(false);
				} else {
					throw new Error(result);
				}
			} catch (err) {
				setLoading(false);
				dispatch(showError(`Failed to fetch available application.`));
				return err;
			}
		};
		if (open) {
			fetchAvailableApp();
		}
	}, [open, clientId]);

	// This hook won't called in first render or when mounted like ComponentDidUpdate
	useDidMountEffect(() => {
		const selectedOne = availableApp.find((x) => x.id === input.applicationId);
		if (selectedOne) {
			setSelectedApp(selectedOne);
		} else {
			setSelectedApp(selectedDefault);
		}
	}, [input]);

	const closeOverride = () => {
		handleClose();
		setSelectedApp(selectedDefault);
		setInput(defaultData);
		setErrors(defaultError);
		setAvailableApp([]);
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
					setErrors({ ...errors, ...newData.errors });
					setLoading(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setLoading(false);
			}
		} catch (err) {
			setLoading(false);
			closeOverride();
			dispatch(showError(`Failed to add client application.`));
		}
	};

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="application-dailog"
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>Add Application</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={handleCreateData}
						variant="contained"
						className={classes.createButton}
						disabled={loading}
					>
						Add Application
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<Typography className={classes.labelText}>
					Select Application
				</Typography>

				{errors.applicationId === null ? null : (
					<span style={{ color: "#E31212" }}>{errors.applicationId}</span>
				)}
				<Dropdown
					options={availableApp.map((x) => ({ label: x.name, value: x.id }))}
					selectedValue={{ label: selectedApp.name, value: selectedApp.id }}
					onChange={(value) => setInput({ applicationId: value.value })}
					label=""
					required={true}
					width="100%"
				/>
				<div style={{ marginTop: 12 }}>
					<img src={selectedApp.logoURL} alt={selectedApp.name} />
					<p>{selectedApp.purpose}</p>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddAppDialog;
