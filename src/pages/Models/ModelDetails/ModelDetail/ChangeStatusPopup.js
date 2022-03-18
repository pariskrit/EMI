import React, { useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { useState } from "react";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getModelStatuses } from "services/clients/sites/siteApplications/modelStatuses";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { updateModel } from "services/models/modelDetails/details";
import { useParams } from "react-router-dom";

const ADD = AddDialogStyle();

const useStyles = makeStyles({
	dialogContent: {
		width: 500,
	},
	createButton: {
		width: "auto",
	},
});

function ChangeStatusPopup({ open, onClose }) {
	const classes = useStyles();
	const [isUpdating, setIsUpdating] = useState(false);
	const [modelStatuses, setModelStatuses] = useState([]);
	const [selectedModelStatus, setSelectedModelStatus] = useState({});
	const dispatch = useDispatch();
	const { id } = useParams();

	const handleCreateProcess = async () => {
		setIsUpdating(true);
		const response = await updateModel(id, [
			{
				op: "replace",
				path: "ModelStatusID",
				value: selectedModelStatus.id,
			},
		]);
		if (!response.status) dispatch(showError("Could Not Update Model Status"));

		onClose();

		setIsUpdating(false);
	};

	const onModelStatusChange = (status) => setSelectedModelStatus(status);

	const fetchModelStatuses = async () => {
		const { position } =
			JSON.parse(sessionStorage.getItem("me")) ||
			JSON.parse(localStorage.getItem("me"));
		setIsUpdating(true);
		const response = await getModelStatuses(position.siteAppID);

		if (response.status) {
			setModelStatuses(
				response.data.map((status) => ({
					...status,
					publish: status.publish ? "Yes" : "No",
				}))
			);
		} else {
			dispatch(showError("Could Not Fetch Statuses"));
		}

		setIsUpdating(false);
	};

	useEffect(() => {
		if (open) {
			fetchModelStatuses();
		}

		if (!open) {
			setSelectedModelStatus({});
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
							onClick={handleCreateProcess}
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
					dataSource={modelStatuses}
					onChange={onModelStatusChange}
					selectedValue={selectedModelStatus}
					selectdValueToshow="name"
					columns={[
						{ name: "name", id: 1 },
						{ name: "publish", id: 2 },
					]}
					dataHeader={[
						{ name: "Name", id: 1 },
						{ name: "Publish", id: 2 },
					]}
					showHeader
				/>
			</DialogContent>
		</Dialog>
	);
}

export default ChangeStatusPopup;
