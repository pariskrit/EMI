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
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { addUserToList } from "services/users/usersList";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";

const schema = yup.object({
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
	password: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { firstName: "", lastName: "", email: "", password: "" };
const defaultError = {
	firstName: null,
	lastName: null,
	email: null,
	password: null,
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
}) => {
	let history = useHistory();

	const classes = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [loading, setLoading] = useState(false);

	const closeOverride = () => {
		handleClose();
		setInput(defaultData);
		setErrors(defaultError);
	};

	const handleCreateData = async () => {
		setLoading(true);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await addUser();
				if (newData.success) {
					setLoading(false);
					closeOverride();
				} else {
					setErrors({ ...errors, ...newData.errors });
					setLoading(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
			closeOverride();
		}
	};

	const handleRedirect = (id) => {
		history.push(`${usersPath}/${id}`);
	};

	//Add
	const addUser = async () => {
		// Remove search
		setSearchQuery("");

		// Attempting to create client
		try {
			let data = {
				firstName: input.firstName,
				lastName: input.lastName,
				email: input.email,
				password: input.password,
			};

			// Sending create POST to backend
			let result = await addUserToList(data);

			if (result.status) {
				//Adding new user
				handleAddData(data);

				handleRedirect(result.data);

				return { success: true };
			} else {
				if (result.data) {
					getError(result.data);
					return { success: false };
				} else {
					return { success: false, errors: { ...result.data.errors } };
				}
			}
		} catch (err) {
			throw new Error(err.response);
		}
	};

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
							<ADD.NameInput
								error={errors.firstName === null ? false : true}
								helperText={errors.firstName === null ? null : errors.firstName}
								fullWidth
								onChange={(e) =>
									setInput({ ...input, firstName: e.target.value })
								}
								onKeyDown={handleEnterPress}
								variant="outlined"
							/>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ADD.NameLabel>
								Last Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.lastName === null ? false : true}
								helperText={errors.lastName === null ? null : errors.lastName}
								fullWidth
								onChange={(e) =>
									setInput({ ...input, lastName: e.target.value })
								}
								onKeyDown={handleEnterPress}
								variant="outlined"
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								Email Address<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.email === null ? false : true}
								helperText={errors.email === null ? null : errors.email}
								fullWidth
								onChange={(e) => setInput({ ...input, email: e.target.value })}
								onKeyDown={handleEnterPress}
								variant="outlined"
							/>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ADD.NameLabel>
								Password<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<TextField
								type="password"
								error={errors.password === null ? false : true}
								helperText={errors.password === null ? null : errors.password}
								fullWidth
								onChange={(e) =>
									setInput({ ...input, password: e.target.value })
								}
								onKeyDown={handleEnterPress}
								variant="outlined"
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddAssetDialog;
