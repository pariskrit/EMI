import React, { useState, useEffect } from "react";
import { Facebook } from "react-spinners-css";
import { makeStyles } from "tss-react/mui";
import AccordionBox from "components/Layouts/AccordionBox";
import { Grid, TextField } from "@mui/material";
import Roles from "helpers/roles";
import RoleWrapper from "components/Modules/RoleWrapper";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getSiteDepartments } from "services/clients/sites/siteDepartments";
import { updateClientUserSite } from "services/users/userModelAccess";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { getPositions } from "services/clients/sites/siteApplications/userPositions";
import { updateClientUserSiteAppsStatus } from "services/users/userSites";
import { SuperAdminType } from "constants/UserConstants/indes";
import EMICheckbox from "components/Elements/EMICheckbox";
import UserNotes from "../UserNotes";

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

const UserDetailClientAdmin = ({
	title,
	errors,
	data,
	setErrors,
	getError,
	id,
	apis,
	inputData,
	setInputData,
	clientUserId = null,
	isDetailsRoute,
	notes,
	setNotes,
	handleGetNotes,
}) => {
	const { classes } = useStyles();
	const [isUpdating, setUpdating] = useState(false);
	const [inputValueOnFocus, setInputValueOnFocus] = useState({});
	const { customCaptions, siteID } = JSON.parse(
		sessionStorage.getItem("me") || localStorage.getItem("me")
	);

	useEffect(() => {
		setInputData((details) => ({
			...details,
			position: { name: inputData.positionName, id: inputData.positionID },
			AdminType: SuperAdminType.find((d) => d.id === details?.adminType),
		}));
	}, []);

	//Handle Update
	const handleApiCall = async (path, value) => {
		setUpdating({ [path]: { isUpdating: true } });
		if (path === "externalReference") {
			try {
				const result = await apis.patchExternalReferenceAPI(clientUserId, [
					{ op: "replace", path, value },
				]);
				if (result.status) {
					localStorage.setItem("userCrumbs", JSON.stringify(result.data));
				} else {
					throw new Error(result);
				}
			} catch (err) {
				if (err?.response?.data?.detail) {
					getError(err.response.data.detail);
				}
				if (err?.response?.data?.errors?.name) {
					getError(err.response.data.errors.name[0]);
				}
			}
		} else {
			try {
				const result = await apis.patchAPI(id, [
					{ op: "replace", path, value },
				]);

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
	const handleDropDownChange = async (name, value, path) => {
		const tempDetail = inputData[name];
		setErrors({ ...errors, [name]: null });
		setInputData((detail) => ({
			...detail,
			[name]: value,
		}));
		let response = null;

		if (name === "department") {
			response = await updateClientUserSite(data.clientUserSiteID, [
				{
					op: "replace",
					path,
					value: value.id,
				},
			]);
		}

		if (name === "AdminType") {
			setUpdating({ AdminType: { isUpdating: true } });
			response = await apis.patchAPI(id, [
				{ op: "replace", path, value: value.id },
			]);
			setUpdating({ AdminType: { isUpdating: false } });
		}

		if (name === "position") {
			response = await updateClientUserSiteAppsStatus(inputData.id, [
				{
					op: "replace",
					path,
					value: value.id,
				},
			]);
		}
		if (!response.status) {
			setInputData((detail) => ({
				...detail,
				[name]: tempDetail,
			}));
			getError(`Cannot update ${name}`);
		}
	};

	const handleUpdateData = (e) => {
		if (inputValueOnFocus.value === inputData[e.target.name]) {
			return;
		}
		handleApiCall(e.target.name, e.target.value);
	};

	const handleCheckboxChange = async (e) => {
		setUpdating(true);
		try {
			const response = await apis.patchExternalReferenceAPI(clientUserId, [
				{ op: "replace", path: "isAdmin", value: e.target.checked },
			]);
			if (response.status) {
				setInputData((prev) => ({
					...prev,
					isAdmin: response?.data?.isAdmin,
				}));
			} else {
				getError(response?.data?.detail);
			}
		} catch (err) {
			let error =
				err?.response?.data?.detail ||
				err?.response?.detail ||
				err?.response?.data?.errors?.name[0];
			getError(error);
		}
		setUpdating(false);
	};
	//email notificaions toggle handler

	return (
		<>
			<Grid item xs={12}>
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
									disabled={
										isDetailsRoute || isUpdating["firstName"]?.isUpdating
									}
									onChange={(e) =>
										handleInputChange("firstName", e.target.value)
									}
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
									onChange={(e) =>
										handleInputChange("lastName", e.target.value)
									}
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
									disabled={
										isDetailsRoute || isUpdating["lastName"]?.isUpdating
									}
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

							<Grid item sm={6}>
								<ADD.InputLabel>
									{customCaptions?.userReference
										? `${customCaptions.userReference} `
										: "Reference Number"}
								</ADD.InputLabel>
								<TextField
									sx={{
										"& .MuiInputBase-input.Mui-disabled": {
											WebkitTextFillColor: "#000000",
										},
									}}
									name="externalReference"
									variant="outlined"
									className={classes.input}
									fullWidth
									value={inputData?.externalReference || ""}
									onChange={(e) =>
										handleInputChange("externalReference", e.target.value)
									}
									onBlur={(e) => handleUpdateData(e)}
									onFocus={(e) =>
										setInputValueOnFocus({
											label: e.target.name,
											value: e.target.value,
										})
									}
									disabled={isUpdating["externalReference"]?.isUpdating}
									InputProps={{
										endAdornment: isUpdating["externalReference"]
											?.isUpdating ? (
											<Facebook size={20} color="#A79EB4" />
										) : null,
										style: {
											color: "rgba(0, 0, 0, 0.87)",
										},
									}}
								/>
							</Grid>
							{!siteID && (
								<Grid item sm={6}>
									<EMICheckbox
										state={inputData?.isAdmin}
										changeHandler={handleCheckboxChange}
										disabled={isUpdating}
									/>
									<span
										className={
											isUpdating ? classes.textColor : classes.checkboxLabel
										}
									>
										User is a Client Administrator
									</span>
								</Grid>
							)}
						</Grid>
					</div>
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
									disabled={
										isDetailsRoute || isUpdating["firstName"]?.isUpdating
									}
									onChange={(e) =>
										handleInputChange("firstName", e.target.value)
									}
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
									onChange={(e) =>
										handleInputChange("lastName", e.target.value)
									}
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
									disabled={
										isDetailsRoute || isUpdating["lastName"]?.isUpdating
									}
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

							<Grid item xs={12}>
								<ADD.InputLabel>
									{customCaptions?.userReference
										? `${customCaptions.userReference} `
										: "Reference Number"}
								</ADD.InputLabel>
								<TextField
									sx={{
										"& .MuiInputBase-input.Mui-disabled": {
											WebkitTextFillColor: "#000000",
										},
									}}
									name="externalRef"
									variant="outlined"
									className={classes.input}
									fullWidth
									value={inputData?.externalReference || ""}
									onChange={(e) =>
										handleInputChange("externalRef", e.target.value)
									}
									onBlur={(e) => handleUpdateData(e)}
									onFocus={(e) =>
										setInputValueOnFocus({
											label: e.target.name,
											value: e.target.value,
										})
									}
									disabled={isUpdating["externalRef"]?.isUpdating}
									InputProps={{
										endAdornment: isUpdating["externalRef"]?.isUpdating ? (
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
			</Grid>
			<Grid item xs={12}>
				<UserNotes
					id={+data?.clientUserID || +id || +data?.id}
					notes={notes}
					setNotes={setNotes}
					getError={getError}
					apis={apis}
					handleGetNotes={handleGetNotes}
				/>
			</Grid>
		</>
	);
};

export default UserDetailClientAdmin;
