import React from "react";
import DeleteDialogStyle from "styles/application/DeleteDialogStyle";
import Dialog from "@mui/material/Dialog";
import { LinearProgress } from "@mui/material";

// Init styled components
const ADD = DeleteDialogStyle();

const ConfirmDialog = ({
	open,
	closeHandler,
	handleImport,
	loading,
	emptyRoles,
}) => {
	const EmptyRole = () => {
		return (
			<ul>
				{emptyRoles.map((e) => (
					<li>{e}</li>
				))}
			</ul>
		);
	};

	const customCaptions = localStorage.getItem("me")
		? JSON.parse(localStorage.getItem("me"))?.customCaptions
		: {};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeHandler}
				aria-labelledby="confirm-title"
				aria-describedby="confirm-description"
			>
				{loading ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<ADD.ButtonContainer>
						<ADD.DeleteButton onClick={closeHandler} variant="contained">
							Cancel
						</ADD.DeleteButton>

						<ADD.CancelButton onClick={handleImport} variant="contained">
							Proceed
						</ADD.CancelButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<ADD.DialogContent>
					<ADD.InputContainer id="alert-dialog-description">
						{`The following ${customCaptions?.rolePlural}  have not been mapped:`}
						<EmptyRole />
						{`If you choose to proceed, these ${customCaptions?.rolePlural} will not be created and Tasks will not be assigned to them. Are you sure you wish to continue?`}
					</ADD.InputContainer>
				</ADD.DialogContent>
			</Dialog>
		</div>
	);
};

export default ConfirmDialog;
