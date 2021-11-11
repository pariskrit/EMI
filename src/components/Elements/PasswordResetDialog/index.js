import * as yup from "yup";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";

const ADD = AddDialogStyle();
const defaultData = {
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
};
const defaultError = {
	currentPassword: null,
	newPassword: null,
	confirmPassword: null,
};

const media = "@media (max-width: 414px)";

const useStyles = makeStyles({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
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

const PasswordResetDialog = ({ open, handleClose, apis, id, getError }) => {
	const classes = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [loading, setLoading] = useState(false);

	const closeOverride = () => {
		handleClose();
		setInput(defaultData);
		setErrors(defaultError);
	};

	const schema = yup.object({
		currentPassword: yup
			.string("This field must be a string")
			.required("This field is required"),
		newPassword: yup
			.string("This field must be a string")
			.required("This field is required"),
		confirmPassword: yup
			.string("This field must be a string")
			// .oneOf([yup.ref("newPassword")], "Password must be the same!")
			.test("passwords-match", "Passwords must match", function (value) {
				return input.newPassword === value;
				// console.log(input.newPassword, value);
			})
			.required("This field is required"),
	});

	const handlePasswordReset = async () => {
		setLoading(true);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await resetPassword();
				if (newData.success) {
					setLoading(false);
					closeOverride();
				} else {
					console.log("errorrr", newData);
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

	//add
	const resetPassword = async () => {
		try {
			let data = {
				oldPassword: input.currentPassword,
				newPassword: input.newPassword,
				// confirmPassword: input.confirmPassword,
			};

			// Sending create POST to backend
			let result = await apis.postPasswordResetAPI((id = "me"), data);

			if (result.status) {
				console.log("result", result);

				return { success: true };
			} else {
				if (result.data.detail) {
					getError(result.data.detail);
					// setErrors({ ...errors, currentPassword: result.data.detail });

					return {
						success: false,
						errors: { currentPassword: result.data.detail },
					};
				} else {
					return { success: false, errors: { ...result.data.errors } };
				}
			}
		} catch (err) {
			throw new Error(err);
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (!loading) {
			if (e.keyCode === 13) {
				handlePasswordReset();
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
					{<ADD.HeaderText>Password Reset</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={handlePasswordReset}
						variant="contained"
						className={classes.createButton}
						disabled={loading}
					>
						Save
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<div className={classes.inputContainer}>
					<ADD.NameLabel>
						Current Password<ADD.RequiredStar>*</ADD.RequiredStar>
					</ADD.NameLabel>
					<TextField
						error={errors.currentPassword === null ? false : true}
						helperText={
							errors.currentPassword === null ? null : errors.currentPassword
						}
						fullWidth
						onChange={(e) =>
							setInput({ ...input, currentPassword: e.target.value })
						}
						onKeyDown={handleEnterPress}
						variant="outlined"
						type="password"
					/>
				</div>
				<div className={classes.inputContainer}>
					<ADD.NameLabel>
						New Password<ADD.RequiredStar>*</ADD.RequiredStar>
					</ADD.NameLabel>
					<TextField
						error={errors.newPassword === null ? false : true}
						helperText={errors.newPassword === null ? null : errors.newPassword}
						fullWidth
						onChange={(e) =>
							setInput({ ...input, newPassword: e.target.value })
						}
						onKeyDown={handleEnterPress}
						variant="outlined"
						type="password"
					/>
				</div>
				<div className={classes.inputContainer}>
					<ADD.NameLabel>
						Confirm Password<ADD.RequiredStar>*</ADD.RequiredStar>
					</ADD.NameLabel>
					<TextField
						error={errors.confirmPassword === null ? false : true}
						helperText={
							errors.confirmPassword === null ? null : errors.confirmPassword
						}
						fullWidth
						onChange={(e) =>
							setInput({ ...input, confirmPassword: e.target.value })
						}
						onKeyDown={handleEnterPress}
						variant="outlined"
						type="password"
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PasswordResetDialog;
