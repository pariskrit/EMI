import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
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
	cancelButton: {
		width: "90px",
	},
});

const CommonAddDialog = ({
	open,
	closeHandler,
	createHandler,
	label,
	input,
	setInput,
	reference,
}) => {
	// Init hooks
	const classes = useStyles();
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState({ isError: false });
	const [isDisabled, setIsDisabled] = useState(false);

	const handleNameInputChange = (e) => {
		if (Error.isError) {
			//if error present remove error message
			setError({ isError: false });
		}
		setInput(e.target.value);
	};

	const onAddRegion = async (e) => {
		// checking if the input field is empty
		const isInputEmpty = input === "";

		if (isInputEmpty) {
			//if input is empty show error
			setError({ name: "Name is required", isError: true });
		} else {
			setIsDisabled(true);
			setIsUpdating(true);
			const result = await createHandler(e);
			if (result.success) {
				closeHandler();
			} else {
				if (result.errors) {
					setError({ ...result.errors, isError: true });
					setIsUpdating(false);
					setIsDisabled(false);
				}
			}
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			onAddRegion(e);
		}
	};

	useEffect(() => {
		return () => {
			setInput("");
			setError({});
			setIsDisabled(false);
			setIsUpdating(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeHandler}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{
							<ADD.HeaderText>
								Add {label} {reference && `(${reference})`}
							</ADD.HeaderText>
						}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton
							onClick={closeHandler}
							variant="contained"
							className={classes.cancelButton}
						>
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton
							onClick={onAddRegion}
							variant="contained"
							className={classes.createButton}
							disabled={isDisabled}
						>
							Create {label}
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					<ADD.InputContainer>
						<ADD.NameInput
							error={error.isError}
							helperText={error.isError ? error.name : null}
							required
							label={`${label} name`}
							value={input}
							onKeyDown={handleEnterPress}
							onChange={handleNameInputChange}
						/>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CommonAddDialog;
