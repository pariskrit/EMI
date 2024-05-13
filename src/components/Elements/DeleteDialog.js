import React, { useEffect, useState } from "react";
import DeleteDialogStyle from "styles/application/DeleteDialogStyle";
import API from "helpers/api";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import { makeStyles } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";

// Init styled components
const ADD = DeleteDialogStyle();

const DeleteDialog = ({
	entityName,
	open,
	closeHandler,
	deleteEndpoint,
	deleteID,
	handleRemoveData,
	isLogo = false,
	getError,
	pushSomeWhere = false,
	deleteButton = "Delete",
	deleteMsg = `You are about to delete a ${entityName}. This cannot be undone.`,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);

	// Handlers
	const handleDeleteData = async () => {
		// Attempting to delete data
		try {
			let result = null;

			// Making DELETE to backend
			if (isLogo) {
				result = await API.patch(`${deleteEndpoint}/${deleteID}`, [
					{
						op: "replace",
						path: "logoKey",
						value: null,
					},
				]);
			} else {
				result = await API.delete(`${deleteEndpoint}/${deleteID}`);
			}

			// Handling success
			if (result.status === 200) {
				// Updating state to match DB
				handleRemoveData(deleteID);

				return true;
			} else {
				// Throwing error if not 200
				throw new Error(result);
			}
		} catch (err) {
			if (err?.response?.status === 404) getError("could not delete");
			// TODO: real error handling
			else getError(err?.response?.data?.detail || err?.response?.data);

			return false;
		}
	};
	const handleDeleteConfirm = () => {
		// Setting progress indicator
		setIsUpdating(true);

		// Deleting status change
		handleDeleteData().then(() => {
			// Once deleted, closing dialog and updating state
			if (!pushSomeWhere) {
				setIsUpdating(false);
				closeHandler();
			}
		});
	};
	const useStyles = makeStyles({
		button: {
			backgroundColor: "#3c52b2",
			color: "#fff",
			"&.MuiButton-root:hover": {
				backgroundColor: "red",
				color: "#3c52b2",
			},
		},
	});

	const { classes } = useStyles();
	useEffect(() => {
		return () => setIsUpdating(false);
	}, []);

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeHandler}
				aria-labelledby="delete-title"
				aria-describedby="delete-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="delete-dialog-title">
						{
							<ADD.HeaderText>
								{deleteButton} {entityName}
							</ADD.HeaderText>
						}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton
							onClick={closeHandler}
							variant="contained"
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
							Cancel
						</ADD.CancelButton>
						<ADD.DeleteButton
							onClick={handleDeleteConfirm}
							variant="contained"
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
							{deleteButton}
						</ADD.DeleteButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<ADD.DialogContent>
					<ADD.InputContainer id="alert-dialog-description">
						{deleteMsg}
					</ADD.InputContainer>
				</ADD.DialogContent>
			</Dialog>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(DeleteDialog);
