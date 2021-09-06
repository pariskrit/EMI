import React, { useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	LinearProgress,
} from "@material-ui/core";
import { updateClientApplications } from "services/clients/clientDetailScreen";
import AddDialogStyle from "styles/application/AddDialogStyle";

// Init styled components

const AT = AddDialogStyle();

const ChangeDialog = ({
	open,
	closeHandler,
	changeId,
	status,
	getChangedValue,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);

	// Handlers
	const handleChangeData = async () => {
		// Attempting to change data
		try {
			// Making Change to backend
			const result = await updateClientApplications(changeId, [
				{ op: "replace", path: "isActive", value: status },
			]);

			// Handling success
			if (result.status) {
				getChangedValue(changeId, result.data.isActive);
				return true;
			} else {
				// Throwing error if not 200
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			console.log(err);

			return false;
		}
	};
	const handleChangeConfirm = () => {
		// Setting progress indicator
		setIsUpdating(true);

		// Deleting status change
		handleChangeData().then(() => {
			// Once Changed, closing dialog and updating state
			closeHandler();
			setIsUpdating(false);
		});
	};

	return (
		<div>
			<Dialog open={open} onClose={closeHandler}>
				{isUpdating ? <LinearProgress /> : null}
				<DialogActions>
					<AT.ConfirmButton onClick={handleChangeConfirm} variant="contained">
						Confirm
					</AT.ConfirmButton>
					<AT.CancelButton onClick={closeHandler} variant="contained">
						Cancel
					</AT.CancelButton>
				</DialogActions>
				<DialogContent>
					<DialogContentText>You are about to change</DialogContentText>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ChangeDialog;
