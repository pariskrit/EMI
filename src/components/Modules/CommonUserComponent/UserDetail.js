import React, { useState } from "react";
import { Facebook } from "react-spinners-css";
import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/Layouts/AccordionBox";
import { Grid, TextField, Typography } from "@material-ui/core";

import Roles from "helpers/roles";
import RoleWrapper from "../RoleWrapper";

const media = "@media(max-width: 414px)";

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
	setErrors,
	getError,
	id,
	apis,
	inputData,
	setInputData,
}) => {
	const classes = useStyles();

	// const [userDetail, setUserDetail] = useState({});
	const [isUpdating, setUpdating] = useState(false);
	const [inputValueOnFocus, setInputValueOnFocus] = useState({});

	//Handle Update
	const handleApiCall = async (path, value) => {
		setUpdating({ [path]: { isUpdating: true } });

		if (path === "externalRef") {
			try {
				const result = await apis.patchExternalReferenceAPI(id, [
					{ op: "replace", path, value },
				]);
				if (result.status) {
					localStorage.setItem("userCrumbs", JSON.stringify(result.data));
					return true;
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
				return err;
			}
		} else {
			try {
				const result = await apis.patchAPI(id, [
					{ op: "replace", path, value },
				]);
				if (result.status) {
					localStorage.setItem("userCrumbs", JSON.stringify(result.data));
					setInputData(result.data);
					setUpdating(false);
					return true;
				} else {
					setUpdating(false);

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
				return err;
			}
		}
	};

	const handleInputChange = (name, value) => {
		setErrors({ ...errors, [name]: null });

		// setData((detail) => ({
		// 	...detail,
		// 	[name]: value,
		// }));

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

	return (
		<AccordionBox title={title} noExpand={true}>
			<div className={classes.desktopViewUserDetail}>
				<Grid container spacing={5}>
					<Grid item sm={6}>
						<Typography>
							First Name <span style={{ color: "#E31212" }}>*</span>
						</Typography>
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
						<Typography>
							Last Name <span style={{ color: "#E31212" }}>*</span>
						</Typography>
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
						<Typography>
							Email Address <span style={{ color: "#E31212" }}>*</span>
						</Typography>
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
						<Typography>Mobile Number</Typography>
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
							<Typography>External Reference Number </Typography>
							<TextField
								name="externalRef"
								variant="outlined"
								fullWidth
								value=""
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
				</Grid>
			</div>
			<div className={classes.mobileViewUserDetail}>
				<Grid container spacing={5}>
					<Grid item xs={12}>
						<Typography>
							First Name <span style={{ color: "#E31212" }}>*</span>
						</Typography>
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
						<Typography>
							Last Name <span style={{ color: "#E31212" }}>*</span>
						</Typography>
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
						<Typography>
							Email Address <span style={{ color: "#E31212" }}>*</span>
						</Typography>
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
						<Typography>Mobile Number</Typography>
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
							<Typography>External Reference Number </Typography>
							<TextField
								name="externalRef"
								variant="outlined"
								fullWidth
								value=""
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
				</Grid>
			</div>
		</AccordionBox>
	);
};

export default UserDetail;
