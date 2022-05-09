import React, { useContext, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { useParams } from "react-router-dom";
import { ServiceContext } from "contexts/ServiceDetailContext";
import { getStatusChanges } from "services/clients/sites/siteApplications/statusChanges";
import { changeServiceStatus } from "services/services/serviceDetails/detail";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import { changeStatusReason } from "constants/serviceDetails";

const ADD = AddDialogStyle();

const useStyles = makeStyles({
	dialogContent: {
		width: 500,
	},
	createButton: {
		width: "auto",
	},
});

function ChangeStatusPopup({ open, onClose, status }) {
	const classes = useStyles();
	const [isUpdating, setIsUpdating] = useState(false);
	const [serviceStatuses, setServiceStatuses] = useState([]);
	const [selectedServiceStatus, setSelectedServiceStatus] = useState({});
	const [SelectedchangeStatusReason, setChnageStatusReason] = useState({});
	const [otherReason, setOtherReason] = useState(null);

	const dispatch = useDispatch();
	const [, serviceDispatch] = useContext(ServiceContext);
	const { id } = useParams();

	const handleCreateProcess = async () => {
		if (
			SelectedchangeStatusReason?.id === undefined ||
			selectedServiceStatus?.id === undefined
		) {
			return;
		}
		setIsUpdating(true);
		try {
			const response = await changeServiceStatus(id, {
				changeStatusReasonID: SelectedchangeStatusReason?.id,
				status: selectedServiceStatus.id,
				otherReason: otherReason,
			});
			if (!response.status)
				dispatch(showError(response.data || "Could Not Update Service Status"));
			else {
				serviceDispatch({
					type: "SET_SERVICE_STATUS",
					payload: selectedServiceStatus?.id,
				});
				onClosePop();
			}
		} catch (error) {
			console.log(error);
		}

		setIsUpdating(false);
	};

	const onClosePop = () => {
		setOtherReason(null);
		setChnageStatusReason({});
		setSelectedServiceStatus({});
		onClose();
	};

	const onModelStatusChange = (status) => setSelectedServiceStatus(status);

	const fetchserviceStatuses = async () => {
		setIsUpdating(true);
		const response = await getStatusChanges(status?.serviceDetail?.siteAppID);

		if (response.status) {
			setServiceStatuses(
				response.data
					.filter((x) => x.siteAppID === status?.serviceDetail?.siteAppID)
					.map((status) => ({
						...status,
					}))
			);
		} else {
			dispatch(showError("Could Not Fetch Statuses"));
		}

		setIsUpdating(false);
	};

	useEffect(() => {
		if (open) {
			fetchserviceStatuses();
		}

		if (!open) {
			setSelectedServiceStatus({});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	return (
		<Dialog
			open={open}
			onClose={onClosePop}
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
						<ADD.CancelButton onClick={onClosePop} variant="contained">
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
					dataSource={changeStatusReason.filter((x) => {
						if (x.showIn === status?.serviceDetail?.status) return x;
						return false;
					})}
					onChange={onModelStatusChange}
					selectedValue={selectedServiceStatus}
					selectdValueToshow="name"
					columns={[{ name: "name", id: 1 }]}
					dataHeader={[{ name: "Status", id: 1 }]}
					label="Change Status"
					width="100%"
					required
				/>
				<div style={{ marginBottom: 14 }}></div>
				<DyanamicDropdown
					dataSource={serviceStatuses}
					onChange={(val) => setChnageStatusReason(val)}
					selectedValue={SelectedchangeStatusReason}
					selectdValueToshow="name"
					columns={[{ name: "name", id: 1 }]}
					dataHeader={[{ name: "Status Reason", id: 1 }]}
					label="Change Status Reason"
					showHeader
					required
					width="100%"
				/>
				<div style={{ marginBottom: 14 }}></div>
				{SelectedchangeStatusReason.name === "Other" && (
					<TextFieldContainer
						label={"Other Reason"}
						name={"otherReason"}
						isRequired={false}
						onChange={(e) => setOtherReason(e.target.value)}
						value={otherReason}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default ChangeStatusPopup;
