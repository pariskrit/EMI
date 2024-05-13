import React, { useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@mui/material";
import * as yup from "yup";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AddDialogStyle from "styles/application/AddDialogStyle";
import { useState } from "react";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getStatusChanges } from "services/clients/sites/siteApplications/statusChanges";
import { changeMultipleServiceStatus } from "services/services/serviceDetails/detail";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import { changeStatusReason } from "constants/serviceDetails";
import {
	FilterStatusChange,
	generateErrorState,
	handleSort,
	handleValidateObj,
} from "helpers/utils";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";

const ADD = AddDialogStyle();

const schema = yup.object({
	SelectedchangeStatusReason: yup
		.string("This field must be a string")
		.required("This field is required"),
	selectedServiceStatus: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: 500,
	},
	createButton: {
		width: "auto",
	},
}));

function ChangeStatusPopup({
	open,
	onClose,
	siteAppID,
	status,
	services = [],
	fetchData,
	setSelectedServices,
	customCaptions,
}) {
	const { classes, cx } = useStyles();
	const [isUpdating, setIsUpdating] = useState(false);
	const [serviceStatuses, setServiceStatuses] = useState([]);
	const [selectedServiceStatus, setSelectedServiceStatus] = useState({});
	const [SelectedchangeStatusReason, setChnageStatusReason] = useState({});
	const [otherReason, setOtherReason] = useState(null);
	const [errors, setErrors] = useState({
		selectedServiceStatus: null,
		SelectedchangeStatusReason: null,
	});

	const dispatch = useDispatch();

	const handleCreateProcess = async () => {
		setIsUpdating(true);
		setErrors({
			selectedServiceStatus: null,
			SelectedchangeStatusReason: null,
		});
		try {
			const localChecker = await handleValidateObj(schema, {
				selectedServiceStatus: selectedServiceStatus?.id,
				SelectedchangeStatusReason: SelectedchangeStatusReason?.id,
			});
			if (!localChecker.some((el) => el.valid === false)) {
				const response = await changeMultipleServiceStatus({
					changeStatusReasonID: SelectedchangeStatusReason?.id,
					status: selectedServiceStatus?.id,
					otherReason: otherReason,
					services: services.map((x) => x?.id),
				});
				if (!response.status)
					dispatch(
						showError(
							response?.data?.detail ||
								response?.data ||
								"Could Not Update Services Status"
						)
					);
				else {
					await fetchData();
					setSelectedServices([]);
					onClosePop();
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (error) {
			dispatch(showError("Could Not Update Services Status"));
		}

		setIsUpdating(false);
	};

	const onClosePop = () => {
		setOtherReason(null);
		setChnageStatusReason({});
		setSelectedServiceStatus({});
		setErrors({
			selectedServiceStatus: null,
			SelectedchangeStatusReason: null,
		});
		onClose();
	};

	const onModelStatusChange = (status) => setSelectedServiceStatus(status);

	const fetchserviceStatuses = async () => {
		setIsUpdating(true);
		const response = await getStatusChanges(siteAppID);

		if (response.status) {
			setServiceStatuses(
				response.data
					.filter((x) => x.siteAppID === siteAppID)
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

	useEffect(() => {
		if (services[0]?.status === "T" && open) {
			setSelectedServiceStatus(
				changeStatusReason(customCaptions).find((d) => d.name === "Incomplete")
			);
		}
	}, [services, open]);

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
				<ErrorInputFieldWrapper
					errorMessage={
						errors.selectedServiceStatus === null
							? null
							: errors.selectedServiceStatus
					}
				>
					<DyanamicDropdown
						dataSource={FilterStatusChange(
							services[0],
							changeStatusReason(customCaptions),
							customCaptions
						)}
						onChange={onModelStatusChange}
						selectedValue={selectedServiceStatus}
						selectdValueToshow="name"
						columns={[{ name: "name", id: 1 }]}
						dataHeader={[{ name: "Status", id: 1 }]}
						label="Change Status"
						width="100%"
						required
						isError={errors.selectedServiceStatus === null ? false : true}
					/>
				</ErrorInputFieldWrapper>
				<div style={{ marginBottom: 14 }}></div>
				<ErrorInputFieldWrapper
					errorMessage={
						errors.SelectedchangeStatusReason === null
							? null
							: errors.SelectedchangeStatusReason
					}
				>
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
						handleSort={handleSort}
						width="100%"
						isError={errors.SelectedchangeStatusReason === null ? false : true}
					/>
				</ErrorInputFieldWrapper>
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
