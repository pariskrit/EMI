import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CloseSharp } from "@material-ui/icons";
import Dropdown from "components/Dropdown";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import useDidMountEffect from "hooks/useDidMountEffect";
import React, { useEffect, useState } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import * as yup from "yup";

const schema = yup.object({
	applicationId: yup
		.number("This field must be a number")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { applicationId: null };
const defaultError = { applicationId: null };

const useStyles = makeStyles({
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
});
const selectedDefault = {
	id: null,
	logoURL: "",
	name: "",
	purpose: "",
};
const AddAppDialog = ({
	open,
	handleClose,
	createHandler,
	siteId,
	setApplicationList,
	setError,
}) => {
	const classes = useStyles();
	const [isLoading, setIsLoading] = useState(true);
	const [availableApplications, setAvailableApplications] = useState([]);
	const [selectedApplication, setSelectedApplication] = useState({});

	const onSelectedApplicationChange = (application) => {
		const selectedApp = availableApplications.find(
			(app) => app.id === application.value
		);

		setSelectedApplication(selectedApp);
	};

	const onAddApplicationClick = async () => {
		if (Object.keys(selectedApplication).length === 0) {
			handleClose();
			return;
		}
		setIsLoading(true);

		try {
			const response = await API.post(`${BASE_API_PATH}siteapps/`, {
				siteID: siteId,
				applicationID: selectedApplication.id,
			});
			console.log(response);

			setIsLoading(false);
			handleClose();
			if (response.status === 404 || response.status === 400) {
				throw new Error(response);
			}

			setApplicationList((prev) => [...prev, selectedApplication]);
		} catch (error) {
			if (Object.keys(error.response.data.errors).length !== 0) {
				setError(error.response.data.errors.name);
			} else if (error.response.data.detail !== undefined) {
				setError(error.response.data.detail);
			} else {
				setError("Something went wrong!");
			}
			setIsLoading(false);
			handleClose();
		}
	};

	const fetchAvailableApplications = async () => {
		try {
			const result = await API.get(
				`${BASE_API_PATH}siteapps/${siteId}/available`
			);
			setIsLoading(false);

			setAvailableApplications(result.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (open) {
			fetchAvailableApplications();
		}

		return () => {
			setIsLoading(true);
			setSelectedApplication({});
			setAvailableApplications([]);
		};
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
				<Typography className={classes.labelText}>
					Select Application
				</Typography>

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
					label=""
					required={true}
					width="100%"
				/>
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
