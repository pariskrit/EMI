import * as yup from "yup";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { usersPath } from "helpers/routePaths";
import { makeStyles } from "@material-ui/core/styles";
import {
	addClientUsers,
	addClientUserSiteApps,
	addUserToList,
} from "services/users/usersList";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getSiteDepartments } from "services/clients/sites/siteDepartments";
import { getPositions } from "services/clients/sites/siteApplications/userPositions";

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
				is: () => role === "SiteUser" || isSiteUser,
				then: yup.string("Must be string").required("This field is required"),
			}),
		}),
		position: yup.object({
			name: yup.string("This field is required").when("role", {
				is: () => role === "SiteUser" || isSiteUser,
				then: yup.string("Must be string").required("This field is required"),
			}),
		}),
		externalReference: yup.string().nullable(),
	});

const ADD = AddDialogStyle();
const defaultData = {
	firstName: "",
	lastName: "",
	email: "",
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

const useStyles = makeStyles({
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
});

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
}) => {
	let history = useHistory();

	const classes = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [loading, setLoading] = useState(false);
	const { id } = (JSON.parse(sessionStorage.getItem("clientAdminMode")) ||
		JSON.parse(localStorage.getItem("clientAdminMode"))) ?? { id: null };
	const isSuperAdmin = role === "SuperAdmin";
	const isClientAdmin = role === "ClientAdmin" && !isSiteUser;
	const isSiteAppUser = role === "SiteUser" || isSiteUser;

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
				if (isSuperAdmin) result = await addUserToList(data);

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
			console.log(err);
			setLoading(false);
			closeOverride();
		}
	};
	const handleRedirect = (id) => {
		history.push(`${usersPath}/${id}`);
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
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>Add New User</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={handleCreateData}
						variant="contained"
						className={classes.createButton}
						disabled={loading}
					>
						Add User
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<div>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								First name<ADD.RequiredStar>*</ADD.RequiredStar>
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
								<ADD.NameInput
									error={errors.email === null ? false : true}
									fullWidth
									onChange={(e) =>
										setInput({ ...input, email: e.target.value })
									}
									onKeyDown={handleEnterPress}
									variant="outlined"
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							{isSiteAppUser ? (
								<ErrorInputFieldWrapper
									errorMessage={
										errors?.position === null ? null : errors?.position
									}
								>
									<DyanamicDropdown
										label="Positions"
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
							{isClientAdmin ? (
								<>
									<ADD.NameLabel>External Reference</ADD.NameLabel>

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
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					{isSiteAppUser ? (
						<ADD.InputContainer>
							<ADD.LeftInputContainer>
								<ErrorInputFieldWrapper
									errorMessage={
										errors?.department === null ? null : errors?.department
									}
								>
									<DyanamicDropdown
										label="Departments"
										dataHeader={[
											{ id: 1, name: "Name" },
											{ id: 2, name: "Description" },
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
							</ADD.LeftInputContainer>
						</ADD.InputContainer>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddAssetDialog;
