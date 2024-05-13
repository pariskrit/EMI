import React, { useState, useEffect } from "react";
import { Facebook } from "react-spinners-css";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import AccordionBox from "components/Layouts/AccordionBox";
import { Grid, TextField } from "@mui/material";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { SuperAdminType } from "constants/UserConstants/indes";
import IOSSwitch from "components/Elements/IOSSwitch";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";

const media = "@media(max-width: 414px)";

const ADD = AddDialogStyle();

const useStyles = makeStyles()((theme) => ({
	desktopViewUserDetail: {
		[media]: { display: "none" },
		width: "100%",
	},
	mobileViewUserDetail: {
		display: "none",
		[media]: { display: "flex" },
	},
	checkboxLabel: {
		fontSize: 15,
		fontWeight: 500,
	},
	textColor: {
		color: "rgba(0, 0, 0, 0.38);",
		fontSize: 15,
		fontWeight: 500,
	},
	notifications: {
		display: "flex",
		flex: 1,
		justifyContent: "between",
		alignItems: "center",
		width: "100%",
	},
	notificaionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: 700,
		fontSize: "15px",
		display: "flex",
		flexGrow: 1,
	},
}));

const ProfileDetail = ({
	title,
	errors,
	data,
	setErrors,
	getError,
	id,
	apis,
	inputData,
	setInputData,
	isDetailsRoute,
}) => {
	const { classes, cx } = useStyles();
	const [isUpdating, setUpdating] = useState(false);

	const [status, setStatus] = useState(data?.receiveFeedbackEmail);
	const [inputValueOnFocus, setInputValueOnFocus] = useState({});
	const [openChangeConfirmDialog, setOpenChangeConfirmDialog] = useState(false);
	const { customCaptions } = JSON.parse(
		sessionStorage.getItem("me") || localStorage.getItem("me")
	);
	const dispatch = useDispatch();

	useEffect(() => {
		setInputData((details) => ({
			...details,
			position: { name: inputData.positionName, id: inputData.positionID },
			AdminType: SuperAdminType.find((d) => d.id === details?.adminType),
		}));
	}, []);

	useEffect(() => {
		setStatus(data?.receiveFeedbackEmail);
	}, [data]);

	const onCloseChangeConfirmDialog = () => {
		setOpenChangeConfirmDialog(false);
	};

	// open and close confirm change dialog
	const onOpenChangeConfirmDialog = (id) => {
		setOpenChangeConfirmDialog(true);
	};
	//Handle Update
	const handleApiCall = async (path, value) => {
		setUpdating({ [path]: { isUpdating: true } });
		try {
			const result = await apis.patchAPI(id, [{ op: "replace", path, value }]);
			if (result.status) {
				localStorage.setItem("userCrumbs", JSON.stringify(result.data));
				setInputData({
					...result.data,
					AdminType: SuperAdminType.find(
						(d) => d.id === result?.data?.adminType
					),
				});
			} else {
				const err = result.data.errors;
				setErrors({ ...errors, ...err });
				throw new Error(result);
			}
			if (path === "receiveFeedbackEmail") {
				return result;
			}
		} catch (err) {
			if (err?.response?.data?.detail) {
				getError(err.response.data.detail);
			}
			if (err?.response?.data?.errors?.name) {
				getError(err.response.data.errors.name[0]);
			}
		}

		setUpdating(false);
	};

	const handleInputChange = async (name, value, path) => {
		setErrors({ ...errors, [name]: null });
		setInputData((detail) => ({
			...detail,
			[name]: value,
		}));
	};

	const handleUpdateData = (e) => {
		if (inputValueOnFocus.value === inputData[e.target.name]) {
			return;
		}
		handleApiCall(e.target.name, e.target.value);
	};

	//email notificaions toggle handler
	const handlePatchIsActive = async (e) => {
		setUpdating(true);
		try {
			let response = await handleApiCall("receiveFeedbackEmail", !status);
			if (response.status) {
				setStatus(!status);
				onCloseChangeConfirmDialog();
			}
			setUpdating(false);
			onCloseChangeConfirmDialog();
		} catch (err) {
			dispatch(showError("Failed to update the notification status."));
			setUpdating(false);
			return false;
		}
	};

	return (
		<>
			<ConfirmChangeDialog
				open={openChangeConfirmDialog}
				isUpdating={isUpdating}
				closeHandler={onCloseChangeConfirmDialog}
				handleChangeConfirm={handlePatchIsActive}
			/>
			<AccordionBox title={title} noExpand={true}>
				<div className={classes.desktopViewUserDetail}>
					<Grid container spacing={5}>
						<Grid item sm={6}>
							<ADD.InputLabel>
								First Name <span style={{ color: "#E31212" }}>*</span>
							</ADD.InputLabel>
							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								name="firstName"
								variant="outlined"
								className={classes.input}
								fullWidth
								disabled={isDetailsRoute || isUpdating["firstName"]?.isUpdating}
								onChange={(e) => handleInputChange("firstName", e.target.value)}
								onBlur={(e) => handleUpdateData(e)}
								onFocus={(e) =>
									setInputValueOnFocus({
										label: e.target.name,
										value: e.target.value,
									})
								}
								value={inputData?.firstName || ""}
								error={errors["firstName"] === null ? false : true}
								helperText={
									errors["firstName"] === null ? null : errors["firstName"]
								}
								InputProps={{
									endAdornment: isUpdating["firstName"]?.isUpdating ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
									style: {
										color: "rgba(0, 0, 0, 0.87)",
									},
								}}
							/>
						</Grid>
						<Grid item sm={6}>
							<ADD.InputLabel>
								Last Name <span style={{ color: "#E31212" }}>*</span>
							</ADD.InputLabel>
							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								name="lastName"
								variant="outlined"
								className={classes.input}
								fullWidth
								value={inputData?.lastName || ""}
								onChange={(e) => handleInputChange("lastName", e.target.value)}
								onBlur={(e) => handleUpdateData(e)}
								onFocus={(e) =>
									setInputValueOnFocus({
										label: e.target.name,
										value: e.target.value,
									})
								}
								error={errors["lastName"] === null ? false : true}
								helperText={
									errors["lastName"] === null ? null : errors["lastName"]
								}
								disabled={isDetailsRoute || isUpdating["lastName"]?.isUpdating}
								InputProps={{
									endAdornment: isUpdating["lastName"]?.isUpdating ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
									style: {
										color: "rgba(0, 0, 0, 0.87)",
									},
								}}
							/>
						</Grid>
						<Grid item sm={6}>
							<ADD.InputLabel>
								Email Address <span style={{ color: "#E31212" }}>*</span>
							</ADD.InputLabel>
							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								name="email"
								variant="outlined"
								className={classes.input}
								fullWidth
								value={inputData?.email || ""}
								onChange={(e) => handleInputChange("email", e.target.value)}
								onBlur={(e) => handleUpdateData(e)}
								onFocus={(e) =>
									setInputValueOnFocus({
										label: e.target.name,
										value: e.target.value,
									})
								}
								error={errors["email"] === null ? false : true}
								helperText={errors["email"] === null ? null : errors["email"]}
								disabled={isDetailsRoute || isUpdating["email"]?.isUpdating}
								InputProps={{
									endAdornment: isUpdating["email"]?.isUpdating ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
									style: {
										color: "rgba(0, 0, 0, 0.87)",
									},
								}}
							/>
						</Grid>
					</Grid>
				</div>
				{/* mobile view */}
				<div className={classes.mobileViewUserDetail}>
					<Grid container spacing={5}>
						<Grid item xs={12}>
							<ADD.InputLabel>
								First Name <span style={{ color: "#E31212" }}>*</span>
							</ADD.InputLabel>
							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								name="firstName"
								variant="outlined"
								className={classes.input}
								fullWidth
								disabled={isDetailsRoute || isUpdating["firstName"]?.isUpdating}
								onChange={(e) => handleInputChange("firstName", e.target.value)}
								onBlur={(e) => handleUpdateData(e)}
								onFocus={(e) =>
									setInputValueOnFocus({
										label: e.target.name,
										value: e.target.value,
									})
								}
								value={inputData?.firstName || ""}
								error={errors["firstName"] === null ? false : true}
								helperText={
									errors["firstName"] === null ? null : errors["firstName"]
								}
								InputProps={{
									endAdornment: isUpdating["firstName"]?.isUpdating ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
									style: {
										color: "rgba(0, 0, 0, 0.87)",
									},
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<ADD.InputLabel>
								Last Name <span style={{ color: "#E31212" }}>*</span>
							</ADD.InputLabel>
							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								name="lastName"
								variant="outlined"
								className={classes.input}
								fullWidth
								value={inputData?.lastName || ""}
								onChange={(e) => handleInputChange("lastName", e.target.value)}
								onBlur={(e) => handleUpdateData(e)}
								onFocus={(e) =>
									setInputValueOnFocus({
										label: e.target.name,
										value: e.target.value,
									})
								}
								error={errors["lastName"] === null ? false : true}
								helperText={
									errors["lastName"] === null ? null : errors["lastName"]
								}
								disabled={isDetailsRoute || isUpdating["lastName"]?.isUpdating}
								InputProps={{
									endAdornment: isUpdating["lastName"]?.isUpdating ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
									style: {
										color: "rgba(0, 0, 0, 0.87)",
									},
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<ADD.InputLabel>
								Email Address <span style={{ color: "#E31212" }}>*</span>
							</ADD.InputLabel>
							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								name="email"
								variant="outlined"
								className={classes.input}
								fullWidth
								value={inputData?.email || ""}
								onChange={(e) => handleInputChange("email", e.target.value)}
								onBlur={(e) => handleUpdateData(e)}
								onFocus={(e) =>
									setInputValueOnFocus({
										label: e.target.name,
										value: e.target.value,
									})
								}
								error={errors["email"] === null ? false : true}
								helperText={errors["email"] === null ? null : errors["email"]}
								disabled={isDetailsRoute || isUpdating["email"]?.isUpdating}
								InputProps={{
									endAdornment: isUpdating["email"]?.isUpdating ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
									style: {
										color: "rgba(0, 0, 0, 0.87)",
									},
								}}
							/>
						</Grid>
					</Grid>
				</div>
			</AccordionBox>
			<AccordionBox title={"Email Notifications"} noExpand={true}>
				<div className={classes.desktopViewUserDetail}>
					<Grid item lg={12} className={classes.notifications}>
						<Typography className={classes.notificaionHeading}>
							Receive {customCaptions?.feedback ?? " Feedback"} Notifications
						</Typography>
						<IOSSwitch
							name="receiveFeedbackEmail"
							hideLabel={true}
							color={true}
							onChange={onOpenChangeConfirmDialog}
							currentStatus={status}
							disable={false}
						/>
					</Grid>
				</div>
			</AccordionBox>
		</>
	);
};

export default ProfileDetail;
