import React, { useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@material-ui/core";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { useState } from "react";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getStatusChanges } from "services/clients/sites/siteApplications/statusChanges";
import {
	changeServiceStatus,
	resetServiceStatus,
} from "services/services/serviceDetails/detail";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import {
	generateErrorState,
	handleSort,
	handleValidateObj,
} from "helpers/utils";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { DefaultPageSize } from "helpers/constants";

const ADD = AddDialogStyle();

const schema = yup.object({
	SelectedchangeStatusReason: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const useStyles = makeStyles({
	dialogContent: {
		width: 500,
	},
	createButton: {
		width: "auto",
	},
});

function ChangeStatusPopup({
	open,
	onClose,
	serviceId,
	siteAppID,
	title,
	fetchData,
	setDataForFetchingService,
}) {
	const classes = useStyles();
	const [isUpdating, setIsUpdating] = useState(false);
	const [serviceStatuses, setServiceStatuses] = useState([]);
	const [SelectedchangeStatusReason, setChnageStatusReason] = useState({});
	const [otherReason, setOtherReason] = useState(null);
	const [errors, setErrors] = useState({
		SelectedchangeStatusReason: null,
	});

	const dispatch = useDispatch();

	const handleCreateProcess = async () => {
		setIsUpdating(true);
		setErrors({
			SelectedchangeStatusReason: null,
		});
		try {
			const localChecker = await handleValidateObj(schema, {
				SelectedchangeStatusReason: SelectedchangeStatusReason?.id,
			});
			if (!localChecker.some((el) => el.valid === false)) {
				const response =
					serviceId.changeTostatus === "R"
						? await resetServiceStatus(serviceId.id, {
								changeStatusReasonID: SelectedchangeStatusReason?.id,
								otherReason: otherReason,
						  })
						: await changeServiceStatus(serviceId.id, {
								changeStatusReasonID: SelectedchangeStatusReason?.id,
								status: serviceId.changeTostatus,
								otherReason: otherReason,
						  });

				if (!response.status) {
					dispatch(
						showError(
							response?.data?.detail || "Could Not Update Service Status"
						)
					);
				} else {
					setDataForFetchingService({
						pageNumber: 1,
						pageSize: DefaultPageSize,
						search: "",
						sortField: "",
						sort: "",
					});
					await fetchData();
					onClosePop();
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (error) {
			dispatch(
				showError(error?.response?.data || "Could Not Update Service Status")
			);
		}

		setIsUpdating(false);
	};

	const onClosePop = () => {
		setOtherReason(null);
		setChnageStatusReason({});
		setErrors({
			selectedServiceStatus: null,
			SelectedchangeStatusReason: null,
		});
		onClose();
	};

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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	return (
		<Dialog
			open={open}
			onClose={onClosePop}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="medium-application-dailog"
		>
			{isUpdating ? <LinearProgress /> : null}

			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>{title}</ADD.HeaderText>}
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
