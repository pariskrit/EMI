import React from "react";
import { Dialog, DialogTitle, LinearProgress } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AddDialogStyle from "styles/application/AddDialogStyle";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { postNewModelVersion } from "services/models/modelDetails/details";
import { useParams, useNavigate } from "react-router-dom";
import { appPath, modelsPath } from "helpers/routePaths";

const ADD = AddDialogStyle();

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: 500,
	},
	createButton: {
		// width: "auto",
	},
}));

function NewVersionPopUp({ open, onClose }) {
	const { classes, cx } = useStyles();
	const [isUpdating, setIsUpdating] = useState(false);
	const dispatch = useDispatch();
	const { id } = useParams();
	const navigate = useNavigate();

	const handleCreateProcess = async () => {
		setIsUpdating(true);
		try {
			const response = await postNewModelVersion(id);
			if (response.status) {
				onClose();
				navigate(`${appPath}${modelsPath}/${response.data}`);
			} else {
				dispatch(
					showError(
						response?.data?.detail || "Error: Could not create new version"
					)
				);
			}
		} catch (error) {
			dispatch(
				showError(error?.data?.detail || "Error: Could not create new version")
			);
		}
		setIsUpdating(false);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="application-dailog"
		>
			{isUpdating ? <LinearProgress /> : null}

			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>Create New Version</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<div className="modalButton">
						<ADD.CancelButton onClick={onClose} variant="contained">
							Cancel
						</ADD.CancelButton>
					</div>
					<div className="modalButton">
						<ADD.ConfirmButton
							onClick={handleCreateProcess}
							variant="contained"
							className={classes.createButton}
							disabled={isUpdating}
						>
							Ok
						</ADD.ConfirmButton>
					</div>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
		</Dialog>
	);
}

export default NewVersionPopUp;
