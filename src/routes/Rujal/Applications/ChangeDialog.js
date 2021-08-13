import React, { useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	Button,
	LinearProgress,
} from "@material-ui/core";
import API from "../../../helpers/api";
import { BASE_API_PATH } from "../../../helpers/constants";
import ColourConstants from "../../../helpers/colourConstants";
import AddDialogStyle from "../../../styles/application/AddDialogStyle";

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
		// Attempting to delete data
		try {
			// Making DELETE to backend
			const result = await API.patch(
				`${BASE_API_PATH}ClientApplications/${changeId}`,
				[{ op: "replace", path: "isActive", value: status }]
			);

			// Handling success
			if (result.status === 200) {
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
			// Once deleted, closing dialog and updating state
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
