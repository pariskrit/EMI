import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Dropdown from "components/Elements/Dropdown";
import React, { useEffect, useState } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import {
	addSiteApplications,
	getApplicationPositions,
	getAvailableSiteApplications,
} from "services/clients/sites/siteDetails";
import { getSiteDepartments } from "services/clients/sites/siteDepartments";
import * as yup from "yup";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import roles from "helpers/roles";

const ADD = AddDialogStyle();

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
	},
	createButton: {
		width: "auto",
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	inputText: {
		fontSize: 14,
	},
	dropdownMargin: {
		marginTop: 15,
	},
}));

const schema = yup.object({
	application: yup
		.string("This field must be a string")
		.required("This field is required"),
	department: yup
		.string("This field must be a string")
		.required("This field is required"),

	position: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const defaultError = { application: null, department: null, position: null };

const AddAppDialog = ({
	open,
	handleClose,
	fetchKeyContactsList,
	fetchApplicationList,
	siteId,
	role,
	setError,
}) => {
	const { classes, cx } = useStyles();
	const [isLoading, setIsLoading] = useState(true);
	const [availableApplications, setAvailableApplications] = useState([]);
	const [selectedApplication, setSelectedApplication] = useState({});
	const [availableSiteDepartmenst, setAvailableSiteDepartments] = useState([]);
	const [availablePosition, setAvailablePosition] = useState([]);
	const [selectedDepartment, setSelectedDepartment] = useState({});
	const [selectedPosition, setSelectedPosition] = useState({});
	const [errorMsg, setErrorMsg] = useState(defaultError);
	const onSelectedApplicationChange = (application) => {
		const selectedApp = availableApplications.find(
			(app) => app.id === application.value
		);
		setSelectedApplication(selectedApp);
		if (selectedApplication.id !== application.value) {
			setSelectedPosition({});
		}
	};

	const onSelectDepartment = (value) => {
		setSelectedDepartment(value);
	};

	const onSelectPosition = (value) => {
		setSelectedPosition(value);
	};

	const onAddApplicationClick = async () => {
		const validateData = {
			application: selectedApplication?.name,
			department: selectedDepartment?.label,
			position: selectedPosition?.label,
		};

		try {
			const localChecker = await handleValidateObj(schema, validateData);
			if (!localChecker.some((el) => el.valid === false)) {
				setIsLoading(true);

				const response = await addSiteApplications(
					siteId,
					selectedApplication?.id,
					selectedDepartment?.value,
					selectedPosition?.value
				);
				if (response.status) {
					await fetchKeyContactsList();
					await fetchApplicationList();
					handleClose();
				} else {
					handleClose();
					setError(response.data.detail || response.data);
				}
			} else {
				setIsLoading(false);
				const newErrors = generateErrorState(localChecker);
				setErrorMsg({ ...errorMsg, ...newErrors });
			}
		} catch (err) {
			setIsLoading(false);
			setError("Failed to add application");
			handleClose();
		}
	};

	const fetchAvailableApplications = async () => {
		const result = await getAvailableSiteApplications(siteId);

		if (result.status) {
			setAvailableApplications(result?.data);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (open) {
			fetchAvailableApplications();
		}

		return () => {
			setIsLoading(true);
			setSelectedApplication({});
			setAvailableApplications([]);
			setSelectedDepartment({});
			setAvailableSiteDepartments([]);
			setSelectedPosition({});
			setAvailablePosition([]);
			setSelectedPosition({});
			setErrorMsg(defaultError);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	useEffect(() => {
		const fetchApplicationPosition = async (id) => {
			const result = await getApplicationPositions(id);
			if (result.status) {
				setAvailablePosition(result.data);
			}
			setIsLoading(false);
		};
		if (Object.keys(selectedApplication).length > 0) {
			fetchApplicationPosition(selectedApplication?.id);
		}
	}, [selectedApplication]);

	useEffect(() => {
		const fetchSiteDepartment = async (id) => {
			const result = await getSiteDepartments(id);
			if (result.status) {
				setAvailableSiteDepartments(result?.data);
			}
			setIsLoading(false);
		};
		if (role === roles.superAdmin && open) {
			fetchSiteDepartment(siteId);
		}
	}, [open]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="application-dailog"
		>
			{isLoading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>Add Application</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={handleClose} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={onAddApplicationClick}
						variant="contained"
						className={classes.createButton}
						disabled={isLoading}
					>
						Add Application
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				{/* <Typography className={classes.labelText}>
					Select Application
				</Typography> */}
				<ErrorInputFieldWrapper errorMessage={errorMsg?.application}>
					<Dropdown
						options={availableApplications.map((x) => ({
							label: x.name,
							value: x.id,
						}))}
						selectedValue={{
							label: selectedApplication.name,
							value: selectedApplication.id,
						}}
						onChange={onSelectedApplicationChange}
						label="Select Application"
						required={true}
						width="100%"
					/>
				</ErrorInputFieldWrapper>
				{role === roles.superAdmin && (
					<>
						<div className={classes.dropdownMargin}>
							<ErrorInputFieldWrapper errorMessage={errorMsg?.department}>
								<Dropdown
									options={availableSiteDepartmenst.map((x) => ({
										label: x.name,
										value: x.id,
									}))}
									selectedValue={{
										label: selectedDepartment.label,
										value: selectedDepartment.value,
									}}
									onChange={onSelectDepartment}
									placeholder="Select Department"
									label="Department"
									required={true}
									width="100%"
								/>
							</ErrorInputFieldWrapper>
						</div>
						<div className={classes.dropdownMargin}>
							<ErrorInputFieldWrapper errorMessage={errorMsg?.position}>
								<Dropdown
									options={availablePosition.map((x) => ({
										label: x.name,
										value: x.id,
									}))}
									selectedValue={{
										label: selectedPosition.label,
										value: selectedPosition.value,
									}}
									onChange={onSelectPosition}
									placeholder="Select Position"
									label="Position"
									required={true}
									width="100%"
								/>
							</ErrorInputFieldWrapper>
						</div>
					</>
				)}
				<div style={{ marginTop: 12 }}>
					<img
						src={selectedApplication.logoURL}
						alt={selectedApplication.name}
					/>
					<p>{selectedApplication.purpose}</p>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const mapStateToProps = ({ commonData: { error } }) => ({ error });

const mapDispatchToProps = (dispatch) => ({
	setError: (message) => dispatch(showError(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAppDialog);
