import React, { useState } from "react";
import { Facebook } from "react-spinners-css";
import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/Layouts/AccordionBox";
import { Grid, TextField, Typography } from "@material-ui/core";

import Roles from "helpers/roles";
import RoleWrapper from "../RoleWrapper";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getSiteDepartments } from "services/clients/sites/siteDepartments";
import { updateClientUserSite } from "services/users/userModelAccess";
import { useParams } from "react-router-dom";
import AddDialogStyle from "styles/application/AddDialogStyle";

const media = "@media(max-width: 414px)";

const ADD = AddDialogStyle();

const useStyles = makeStyles(() => ({
	desktopViewUserDetail: {
		[media]: { display: "none" },
	},
	mobileViewUserDetail: {
		display: "none",
		[media]: { display: "flex" },
	},
}));

const UserDetail = ({
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
}) => {
	const classes = useStyles();
	// const [userDetail, setUserDetail] = useState({});
	const [isUpdating, setUpdating] = useState(false);
	const [inputValueOnFocus, setInputValueOnFocus] = useState({});
	const { customCaptions, siteID, isSiteUser, role } = JSON.parse(
		sessionStorage.getItem("me") || localStorage.getItem("me")
	);

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
					setInputData(result.data);
				} else {
					const err = result.data.errors;
					setErrors({ ...errors, ...err });
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
		}
		setUpdating(false);
	};

	const handleInputChange = async (name, value) => {
		const tempDepartment = inputData.department;
		setErrors({ ...errors, [name]: null });
		setInputData((detail) => ({
			...detail,
			[name]: value,
		}));

		if (name === "department") {
			const response = await updateClientUserSite(data.clientUserSiteID, [
				{
					op: "replace",
					path: "SiteDepartmentID",
					value: value.id,
				},
			]);

			if (!response.status) {
				setInputData((detail) => ({
					...detail,
					[name]: tempDepartment,
				}));
				getError("Cannot update department");
			}
		}
	};

	const handleUpdateData = (e) => {
		if (inputValueOnFocus.value === inputData[e.target.name]) {
			return;
		}
		handleApiCall(e.target.name, e.target.value);
	};

	const userIsSiteUser = role === "SiteUser" || isSiteUser;
	return (
		<AccordionBox title={title} noExpand={true}>
			<div className={classes.desktopViewUserDetail}>
				<Grid container spacing={5}>
					<Grid item sm={6}>
						<ADD.InputLabel>
							First Name <span style={{ color: "#E31212" }}>*</span>
						</ADD.InputLabel>
						<TextField
							name="firstName"
							variant="outlined"
							fullWidth
							disabled={isUpdating["firstName"]?.isUpdating}
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
							}}
						/>
					</Grid>
					<Grid item sm={6}>
						<ADD.InputLabel>
							Last Name <span style={{ color: "#E31212" }}>*</span>
						</ADD.InputLabel>
						<TextField
							name="lastName"
							variant="outlined"
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
							disabled={isUpdating["lastName"]?.isUpdating}
							InputProps={{
								endAdornment: isUpdating["lastName"]?.isUpdating ? (
									<Facebook size={20} color="#A79EB4" />
								) : null,
							}}
						/>
					</Grid>
					<Grid item sm={6}>
						<ADD.InputLabel>
							Email Address <span style={{ color: "#E31212" }}>*</span>
						</ADD.InputLabel>
						<TextField
							name="email"
							variant="outlined"
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
							disabled={isUpdating["email"]?.isUpdating}
							InputProps={{
								endAdornment: isUpdating["email"]?.isUpdating ? (
									<Facebook size={20} color="#A79EB4" />
								) : null,
							}}
						/>
					</Grid>
					<Grid item sm={6}>
						<ADD.InputLabel>Mobile Number</ADD.InputLabel>
						<TextField
							name="phone"
							variant="outlined"
							fullWidth
							value={inputData?.phone || ""}
							onChange={(e) => handleInputChange("phone", e.target.value)}
							onBlur={(e) => handleUpdateData(e)}
							onFocus={(e) =>
								setInputValueOnFocus({
									label: e.target.name,
									value: e.target.value,
								})
							}
							disabled={isUpdating["phone"]?.isUpdating}
							InputProps={{
								endAdornment: isUpdating["phone"]?.isUpdating ? (
									<Facebook size={20} color="#A79EB4" />
								) : null,
							}}
						/>
					</Grid>

					<Grid item sm={6}>
						<RoleWrapper roles={[Roles.siteUser, Roles.clientAdmin]}>
							<ADD.InputLabel>External Reference Number </ADD.InputLabel>
							<TextField
								name="externalReference"
								variant="outlined"
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
									endAdornment: isUpdating["externalReference"]?.isUpdating ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
								}}
							/>
						</RoleWrapper>
					</Grid>
					<Grid item sm={6}>
						{userIsSiteUser && (
							<ErrorInputFieldWrapper
								errorMessage={
									errors?.department === null ? null : errors?.department
								}
							>
								<DyanamicDropdown
									label={customCaptions?.department ?? "Department"}
									dataHeader={[
										{ id: 1, name: "Name" },
										{ id: 2, name: "Description" },
									]}
									showHeader
									onChange={(val) => handleInputChange("department", val)}
									selectedValue={inputData.department || ""}
									columns={[
										{ name: "name", id: 1 },
										{ name: "description", id: 2 },
									]}
									selectdValueToshow="name"
									required={true}
									isError={errors?.department ? true : false}
									fetchData={() => getSiteDepartments(siteID)}
									width="100%"
								/>
							</ErrorInputFieldWrapper>
						)}
					</Grid>
				</Grid>
			</div>
			<div className={classes.mobileViewUserDetail}>
				<Grid container spacing={5}>
					<Grid item xs={12}>
						<ADD.InputLabel>
							First Name <span style={{ color: "#E31212" }}>*</span>
						</ADD.InputLabel>
						<TextField
							name="firstName"
							variant="outlined"
							fullWidth
							disabled={isUpdating["firstName"]?.isUpdating}
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
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<ADD.InputLabel>
							Last Name <span style={{ color: "#E31212" }}>*</span>
						</ADD.InputLabel>
						<TextField
							name="lastName"
							variant="outlined"
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
							disabled={isUpdating["lastName"]?.isUpdating}
							InputProps={{
								endAdornment: isUpdating["lastName"]?.isUpdating ? (
									<Facebook size={20} color="#A79EB4" />
								) : null,
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<ADD.InputLabel>
							Email Address <span style={{ color: "#E31212" }}>*</span>
						</ADD.InputLabel>
						<TextField
							name="email"
							variant="outlined"
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
							disabled={isUpdating["email"]?.isUpdating}
							InputProps={{
								endAdornment: isUpdating["email"]?.isUpdating ? (
									<Facebook size={20} color="#A79EB4" />
								) : null,
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<ADD.InputLabel>Mobile Number</ADD.InputLabel>
						<TextField
							name="phone"
							variant="outlined"
							fullWidth
							value={inputData?.phone || ""}
							onChange={(e) => handleInputChange("phone", e.target.value)}
							onBlur={(e) => handleUpdateData(e)}
							onFocus={(e) =>
								setInputValueOnFocus({
									label: e.target.name,
									value: e.target.value,
								})
							}
							disabled={isUpdating["phone"]?.isUpdating}
							InputProps={{
								endAdornment: isUpdating["phone"]?.isUpdating ? (
									<Facebook size={20} color="#A79EB4" />
								) : null,
							}}
						/>
					</Grid>

					<Grid item xs={12}>
						<RoleWrapper roles={[Roles.siteUser, Roles.clientAdmin]}>
							<ADD.InputLabel>External Reference Number </ADD.InputLabel>
							<TextField
								name="externalRef"
								variant="outlined"
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
								}}
							/>
						</RoleWrapper>
					</Grid>
					<Grid item xs={12}>
						{userIsSiteUser && (
							<ErrorInputFieldWrapper
								errorMessage={
									errors?.department === null ? null : errors?.department
								}
							>
								<DyanamicDropdown
									label={customCaptions?.department ?? "Department"}
									dataHeader={[
										{ id: 1, name: "Name" },
										{ id: 2, name: "Description" },
									]}
									showHeader
									onChange={(val) => handleInputChange("department", val)}
									selectedValue={inputData.department || ""}
									columns={[
										{ name: "name", id: 1 },
										{ name: "description", id: 2 },
									]}
									selectdValueToshow="name"
									required={true}
									isError={errors?.department ? true : false}
									fetchData={() => getSiteDepartments(siteID)}
									width="100%"
								/>
							</ErrorInputFieldWrapper>
						)}
					</Grid>
				</Grid>
			</div>
		</AccordionBox>
	);
};

export default UserDetail;
