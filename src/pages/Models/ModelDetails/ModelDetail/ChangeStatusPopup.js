import React, { useContext, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AddDialogStyle from "styles/application/AddDialogStyle";
import { useState } from "react";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getModelStatuses } from "services/clients/sites/siteApplications/modelStatuses";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { updateModel } from "services/models/modelDetails/details";
import { useParams } from "react-router-dom";
import { ModelContext } from "contexts/ModelDetailContext";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import { convertDateToUTC } from "helpers/utils";
import { handleSort } from "helpers/utils";

const ADD = AddDialogStyle();

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: "500px",
	},
	createButton: {
		width: "auto",
	},
	reviewDate: {
		width: "322px",
	},
}));

function ChangeStatusPopup({ open, onClose }) {
	const { classes, cx } = useStyles();
	const [isUpdating, setIsUpdating] = useState(false);
	const [modelStatuses, setModelStatuses] = useState([]);
	const [selectedModelStatus, setSelectedModelStatus] = useState({});
	const dispatch = useDispatch();
	const [, modelDispatch] = useContext(ModelContext);
	const { id } = useParams();
	const [reviewDate, setReviewDate] = useState("");
	const { position, customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const handleCreateProcess = async () => {
		if (selectedModelStatus?.id === undefined) {
			return;
		}
		let payload = [
			{
				op: "replace",
				path: "ModelStatusID",
				value: selectedModelStatus.id,
			},
		];
		if (reviewDate) {
			payload = [
				{
					op: "replace",
					path: "ModelStatusID",
					value: selectedModelStatus.id,
				},
				{
					op: "replace",
					path: "reviewDate",
					value: convertDateToUTC(new Date(reviewDate)),
				},
			];
		}
		setIsUpdating(true);
		try {
			const response = await updateModel(id, payload);
			if (!response.status)
				dispatch(showError(response?.data || "Could Not Update Model Status"));
			else {
				modelDispatch({
					type: "SET_ISPUBLISHED",
					payload: {
						isPublished: response?.data?.isPublished,
						modelStatusName: selectedModelStatus.name,
						reviewDate: response?.data?.reviewDate,
					},
				});
				!response?.data?.arrangementsExist &&
					dispatch(
						showError(
							`Please review your ${customCaptions["asset"]} ${customCaptions["arrangementPlural"]}. Some  ${customCaptions["assetPlural"]} contain an invalid ${customCaptions["arrangement"]} configuration for this new published version.`
						)
					);
			}

			onClose();
		} catch (error) {
			dispatch(showError(error?.message || "Could Not Update Model Status"));
		}

		setIsUpdating(false);
	};
	const onModelStatusChange = (status) => setSelectedModelStatus(status);

	const fetchModelStatuses = async () => {
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
			setReviewDate("");
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
					width="100%"
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
					handleSort={handleSort}
				/>
			</DialogContent>
			{selectedModelStatus.publish === "Yes" && (
				<DialogContent className={classes.dialogContent}>
					<TextFieldContainer
						style={{ width: "300px" }}
						placeholder="Select Date"
						type="date"
						label={"Review Date"}
						name={"reviewDate"}
						value={reviewDate}
						onChange={(e) => setReviewDate(e.target.value)}
						isRequired={false}
					/>
				</DialogContent>
			)}
		</Dialog>
	);
}

export default ChangeStatusPopup;
