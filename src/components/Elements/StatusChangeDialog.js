import React, { useEffect, useState } from "react";
import API from "helpers/api";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import StatusChangeDialogStyle from "styles/application/StatusChangeDialogStyle";
import ColourConstants from "helpers/colourConstants";

// Init styled components
const ADD = StatusChangeDialogStyle();

const StatusChangeDialog = ({
	entityName,
	open,
	closeHandler,
	statusChangeEndpoint,
	clientID,
	clientStatus,
	handleRemoveData,
	getError,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);

	// Handlers

	const changeStatusHandler = async () => {
		setIsUpdating(true);
		try {
			await API.patch(`${statusChangeEndpoint}/${clientID}`, [
				{
					op: "replace",
					path: "isActive",
					value: !clientStatus,
				},
			]);

			await closeHandler(true);
		} catch (err) {
			if (err?.response?.status === 404) getError("could not change status");
			// TODO: real error handling
			else getError(err?.response?.data?.detail || err?.response.data);
			return false;
		} finally {
			setIsUpdating(false);
		}
	};

	useEffect(() => {
		return () => setIsUpdating(false);
	}, []);

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeHandler}
				aria-labelledby="status-title"
				aria-describedby="status-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="delete-dialog-title">
						{<ADD.HeaderText>Change Status of {entityName}</ADD.HeaderText>}
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
						<ADD.ChangeStatusButton
							onClick={changeStatusHandler}
							variant="contained"
							sx={{
								"&.MuiButton-root:hover": {
									backgroundColor: ColourConstants.deleteDialogHover,
									color: "#ffffff",
								},
							}}
						>
							Change Status
						</ADD.ChangeStatusButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>
				<ADD.DialogContent>
					<ADD.InputContainer id="alert-dialog-description">
						You are about to change status of a {entityName}. This cannot be
						undone.
					</ADD.InputContainer>
				</ADD.DialogContent>
			</Dialog>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(StatusChangeDialog);
