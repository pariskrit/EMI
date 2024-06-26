import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import {
	generateErrorState,
	getLocalStorageData,
	handleValidateObj,
} from "helpers/utils";
import AddDialogStyle from "styles/application/AddDialogStyle";
import * as yup from "yup";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	description: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { name: "", description: "" };
const defaultError = { name: null, description: null };

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

const AddAssetDialog = ({ open, handleClose, createHandler }) => {
	const { classes, cx } = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [loading, setLoading] = useState(false);
	const { customCaptions } = getLocalStorageData("me");
	const dispatch = useDispatch();

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
				const newData = await createHandler(input);
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
			setLoading(false);
			closeOverride();
			dispatch(showError(`Failed to add ${customCaptions?.asset}.`));
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
					{
						<ADD.HeaderText>
							Add {customCaptions?.asset ?? "Asset"}
						</ADD.HeaderText>
					}
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
						Add {customCaptions?.asset ?? "Asset"}
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<div>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								{customCaptions?.asset ?? "Asset"}
								<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								fullWidth
								onChange={(e) => setInput({ ...input, name: e.target.value })}
								onKeyDown={handleEnterPress}
								variant="outlined"
							/>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ADD.NameLabel>
								Description<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.description === null ? false : true}
								helperText={
									errors.description === null ? null : errors.description
								}
								fullWidth
								onChange={(e) =>
									setInput({ ...input, description: e.target.value })
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
