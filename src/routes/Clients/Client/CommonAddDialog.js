import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "../../../styles/application/AddDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";

// Init styled components
const ADD = AddDialogStyle();

const useStyles = makeStyles({
	dialogContent: {
		width: 500,
	},
	createButton: {
		width: "auto",
	},
});

const CommonAddDialog = ({
	open,
	closeHandler,
	createHandler,
	label,
	input,
	setInput,
}) => {
	// Init hooks
	const classes = useStyles();

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			createHandler(e);
		}
	};

	useEffect(() => {
		return () => setInput("");
	}, [open]);

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeHandler}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{/* {isUpdating ? <LinearProgress /> : null} */}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Add {label}</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton onClick={closeHandler} variant="contained">
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton
							onClick={createHandler}
							variant="contained"
							className={classes.createButton}
						>
							Create {label}
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					<ADD.InputContainer>
						<ADD.NameInput
							error={false}
							required
							label={`${label} name`}
							value={input}
							onKeyDown={handleEnterPress}
							onChange={(e) => {
								setInput(e.target.value);
							}}
						/>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CommonAddDialog;
