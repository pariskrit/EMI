import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	makeStyles,
} from "@material-ui/core";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getLocalStorageData } from "helpers/utils";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { showError } from "redux/common/actions";
import { getDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";
import { updateDefect } from "services/defects/details";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { getFeedbackStatuses } from "services/clients/sites/siteApplications/feedbackStatuses";
import { updateFeedback } from "services/feedback/feedbackdetails";

const ADD = AddDialogStyle();

const useStyles = makeStyles({
	dialogContent: {
		width: 500,
	},
	createButton: {
		width: "auto",
	},
});

function ChangeStatusPopup({ open, onClose, setDetails }) {
	const classes = useStyles();
	const [isUpdating, setIsUpdating] = useState(false);
	const [statuses, setStatuses] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState({});
	const dispatch = useDispatch();
	const { id } = useParams();

	const handleConfirmStatusChange = async () => {
		if (selectedStatus?.id === undefined) {
			return;
		}
		setIsUpdating(true);
		const response = await updateFeedback(id, [
			{
				op: "replace",
				path: "feedbackStatusID",
				value: selectedStatus.id,
			},
		]);
		if (response.status)
			setDetails((prev) => ({
				...prev,
				feedbackStatusID: selectedStatus.id,
				statusName: selectedStatus.name,
				statusType: selectedStatus.type,
			}));
		else
			dispatch(
				showError(
					response.data?.detail || response.data || "Could Not Update Status"
				)
			);
		onClose();

		setIsUpdating(false);
	};
	const handleStatusChange = (status) => setSelectedStatus(status);

	const fetchDefectStatuses = async () => {
		const { siteAppID } = getLocalStorageData("me");
		setIsUpdating(true);
		const response = await getFeedbackStatuses(siteAppID);

		if (response.status) {
			setStatuses(response.data.map((status) => status));
		} else {
			dispatch(showError("Could Not Fetch Statuses"));
		}

		setIsUpdating(false);
	};

	useEffect(() => {
		if (open) {
			fetchDefectStatuses();
		}

		if (!open) {
			setSelectedStatus({});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

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
					{<ADD.HeaderText>Change Status</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<div className="modalButton">
						<ADD.CancelButton onClick={onClose} variant="contained">
							Cancel
						</ADD.CancelButton>
					</div>
					<div className="modalButton">
						<ADD.ConfirmButton
							onClick={handleConfirmStatusChange}
							variant="contained"
							className={classes.createButton}
							disabled={isUpdating}
						>
							Confirm
						</ADD.ConfirmButton>
					</div>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>

			<DialogContent className={classes.dialogContent}>
				<DyanamicDropdown
					dataSource={statuses}
					onChange={handleStatusChange}
					selectedValue={selectedStatus}
					selectdValueToshow="name"
					columns={[{ name: "name", id: 1 }]}
					dataHeader={[{ name: "Name", id: 1 }]}
					showHeader
				/>
			</DialogContent>
		</Dialog>
	);
}

export default ChangeStatusPopup;
