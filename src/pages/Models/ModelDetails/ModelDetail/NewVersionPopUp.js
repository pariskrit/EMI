import React from "react";
import { Dialog, DialogTitle, LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { postNewModelVersion } from "services/models/modelDetails/details";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { modelsPath } from "helpers/routePaths";

const ADD = AddDialogStyle();

const useStyles = makeStyles({
	dialogContent: {
		width: 500,
	},
	createButton: {
		// width: "auto",
	},
});

function NewVersionPopUp({ open, onClose }) {
	const classes = useStyles();
	const [isUpdating, setIsUpdating] = useState(false);
	const dispatch = useDispatch();
	const { id } = useParams();
	const history = useHistory();

	const handleCreateProcess = async () => {
		setIsUpdating(true);
		try {
			const response = await postNewModelVersion(id);
			if (response.status) {
				onClose();
				history.push(`${modelsPath}/${response.data}`);
			} else {
				dispatch(
					showError(
						response.data?.detail || "Error: Could not create new version"
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
