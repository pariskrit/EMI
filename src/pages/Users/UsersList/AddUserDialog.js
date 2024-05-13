import * as yup from "yup";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { appPath, usersPath } from "helpers/routePaths";
import { makeStyles } from "tss-react/mui";

import {
	addClientUsers,
	addClientUserSiteApps,
	addUserToList,
} from "services/users/usersList";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj, isChrome } from "helpers/utils";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getSiteDepartments } from "services/clients/sites/siteDepartments";
import { getPositions } from "services/clients/sites/siteApplications/userPositions";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import { SuperAdminType } from "constants/UserConstants/indes";
import roles from "helpers/roles";

const schema = (isSiteUser, role) =>
	yup.object({
		firstName: yup
			.string("This field must be a string")
			.required("This field is required"),
		lastName: yup
			.string("This field must be a string")
			.required("This field is required"),
		email: yup
			.string("This field must be a string")
			.required("This field is required")
			.email("Invalid email format"),
		department: yup.object({
			name: yup.string("This field is required").when("role", {
				is: () => role === roles.siteUser || isSiteUser,
				then:()=> yup.string("Must be string").required("This field is required"),
			}),
		}),
		position: yup.object({
			name: yup.string("This field is required").when("role", {
				is: () => role === roles.siteUser || isSiteUser,
				then:()=> yup.string("Must be string").required("This field is required"),
			}),
		}),
		AdminType: yup.object({
			id: yup.number().required(),
			role: yup.string().required(),
		}),
		externalReference: yup.string().nullable(),
	});

const ADD = AddDialogStyle();
const defaultData = {
	firstName: "",
	lastName: "",
	email: "",
	AdminType: SuperAdminType.find((d) => d.id === 2),
	externalReference: "",
	position: {},
	department: {},
};
const defaultError = {
	firstName: null,
	lastName: null,
	email: null,
	department: null,
	position: null,
	externalReference: null,
};

const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	createButton: {
		[media]: {
			width: "auto",
		},
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
		marginBottom: "10px",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	inputText: {
		fontSize: 14,
	},
	inputContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		marginBottom: 20,
	},
}));

const AddAssetDialog = ({
	open,
	handleClose,
	handleAddData,
	setSearchQuery,
	getError,
	role,
	siteID,
	siteAppID,
	isSiteUser,
	customCaptions,
	adminType,
}) => {
	let navigate = useNavigate();

	const { classes, cx } = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [loading, setLoading] = useState(false);
	const { id } = (JSON.parse(sessionStorage.getItem("clientAdminMode")) ||
		JSON.parse(localStorage.getItem("clientAdminMode"))) ?? { id: null };
	const isSuperAdmin = role === roles.superAdmin;
	const isClientAdmin = role === roles.clientAdmin && !isSiteUser;
	const isSiteAppUser = role === roles.siteUser || isSiteUser;

	const [modelFocus, setModelFocus] = useState(true);
	const dispatch = useDispatch();

	const closeOverride = () => {
		handleClose();
		setInput(defaultData);
		setErrors(defaultError);
	};

	const handleCreateData = async () => {
		setLoading(true);
		try {
			const localChecker = await handleValidateObj(
				schema(isSiteUser, role),
				input
			);
			if (!localChecker.some((el) => el.valid === false)) {
				// 		// Remove search
				// setSearchQuery("");

				let data = {
						firstName: input.firstName,
						lastName: input.lastName,
						email: input.email,
					},
					result = null;

				if (isSiteAppUser) {
					data = {
						...data,
						siteAppID,
						departmentID: input.department.id,
						positionID: input.position.id,
						externalReference: input.externalReference,
					};
					result = await addClientUserSiteApps(data);
				}

				if (isClientAdmin) {
					data = {
						...data,
						externalReference: input?.externalReference,
						clientID: id,
					};

					result = await addClientUsers(data);
				}
				if (isSuperAdmin)
					result = await addUserToList({
						...data,
						AdminType: input.AdminType.id,
					});

				if (result.status) {
					//Adding new user
					handleAddData(data);

					handleRedirect(result.data);
				} else {
					getError(result.data?.detail || result?.data || "Cannot add user");
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
			}
			setLoading(false);
		} catch (err) {
			dispatch(showError("Cannot add user."));
			setLoading(false);
			closeOverride();
		}
	};
	const handleRedirect = (id) => {
		navigate(`${appPath}${usersPath}/${id}`);
	};

	const fetchSiteDepartments = async () => await getSiteDepartments(siteID);

	const fetchPositions = async () => await getPositions(siteAppID);

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (!loading) {
			if (e.keyCode === 13) {
				handleCreateData();
			}
		}
	};

	return (
		<Dialog
			fullWidth={true}
			maxWidth="md"
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="application-dailog"
			disableEnforceFocus={isChrome() ? modelFocus : false}
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{
						<ADD.HeaderText>
							Add New {customCaptions?.user ?? "User"}
						</ADD.HeaderText>
					}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton
						onClick={closeOverride}
						variant="contained"
						onFocus={(e) => {
							setModelFocus(true);
						}}
					>
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={handleCreateData}
						variant="contained"
						className={classes.createButton}
						disabled={loading}
					>
						Add {customCaptions?.user ?? "User"}
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<div>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								First Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.firstName === null ? null : errors.firstName
								}
							>
								<ADD.NameInput
									error={errors.firstName === null ? false : true}
									fullWidth
									onChange={(e) =>
										setInput({ ...input, firstName: e.target.value })
									}
									onKeyDown={handleEnterPress}
									variant="outlined"
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ADD.NameLabel>
								Last Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={errors.lastName === null ? null : errors.lastName}
							>
								<ADD.NameInput
									error={errors.lastName === null ? false : true}
									fullWidth
									onChange={(e) =>
										setInput({ ...input, lastName: e.target.value })
									}
									onKeyDown={handleEnterPress}
									variant="outlined"
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								Email Address<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={errors.email === null ? null : errors.email}
							>
								{isSiteAppUser ? (
									<ADD.NameInput
										error={errors.email === null ? false : true}
										fullWidth
										onChange={(e) =>
											setInput({ ...input, email: e.target.value })
										}
										onKeyDown={handleEnterPress}
										variant="outlined"
									/>
								) : (
									<ADD.NameInput
										error={errors.email === null ? false : true}
										fullWidth
										onChange={(e) =>
											setInput({ ...input, email: e.target.value })
										}
										onKeyDown={handleEnterPress}
										variant="outlined"
										onBlur={() => {
											setModelFocus(false);
										}}
									/>
								)}
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							{isSiteAppUser ? (
								<>
									<ErrorInputFieldWrapper
										errorMessage={
											errors?.department === null ? null : errors?.department
										}
									>
										<DyanamicDropdown
											label={customCaptions?.department ?? "Department"}
											dataHeader={[
												{
													id: 1,
													name: `${customCaptions?.department ?? "Department"}`,
												},
												{
													id: 2,
													name: `${customCaptions?.location ?? "Location"}`,
												},
											]}
											showHeader
											onChange={(val) =>
												setInput((input) => ({ ...input, department: val }))
											}
											selectedValue={input.department}
											columns={[
												{ name: "name", id: 1 },
												{ name: "description", id: 2 },
											]}
											selectdValueToshow="name"
											required={true}
											isError={errors?.department ? true : false}
											fetchData={fetchSiteDepartments}
											width="100%"
										/>
									</ErrorInputFieldWrapper>
								</>
							) : null}
							{isClientAdmin ? (
								<>
									<ADD.NameLabel>
										{customCaptions?.userReference ?? "Reference"}
									</ADD.NameLabel>

									<ADD.NameInput
										fullWidth
										onChange={(e) =>
											setInput({ ...input, externalReference: e.target.value })
										}
										onKeyDown={handleEnterPress}
										variant="outlined"
									/>
								</>
							) : null}

							{isSuperAdmin && (
								<>
									<DyanamicDropdown
										label={"Type"}
										showHeader
										dataSource={SuperAdminType}
										onChange={(val) =>
											setInput((input) => ({ ...input, AdminType: val }))
										}
										columns={[{ name: "role" }]}
										selectedValue={input.AdminType}
										selectdValueToshow="role"
										required={true}
										width="100%"
									/>
								</>
							)}
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					{isSiteAppUser ? (
						<>
							<ADD.InputContainer>
								<ADD.LeftInputContainer>
									{isSiteAppUser ? (
										<ErrorInputFieldWrapper
											errorMessage={
												errors?.position === null ? null : errors?.position
											}
										>
											<DyanamicDropdown
												label={customCaptions?.position ?? "Position"}
												dataHeader={[{ id: 1, name: "Name" }]}
												showHeader
												onChange={(val) =>
													setInput((input) => ({ ...input, position: val }))
												}
												selectedValue={input.position}
												columns={[{ name: "name", id: 1 }]}
												selectdValueToshow="name"
												required={true}
												isError={errors?.position ? true : false}
												fetchData={fetchPositions}
												width="100%"
											/>
										</ErrorInputFieldWrapper>
									) : null}
								</ADD.LeftInputContainer>
								<ADD.RightInputContainer>
									<ADD.NameLabel>{customCaptions?.userReference}</ADD.NameLabel>

									<ADD.NameInput
										fullWidth
										onChange={(e) =>
											setInput({ ...input, externalReference: e.target.value })
										}
										onKeyDown={handleEnterPress}
										variant="outlined"
										onBlur={() => {
											setModelFocus(false);
										}}
									/>
								</ADD.RightInputContainer>
							</ADD.InputContainer>
						</>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddAssetDialog;
