import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import React from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";

import { useState } from "react";
import { useEffect } from "react";

const ADD = AddDialogStyle();

const useStyles = makeStyles()((theme) => ({
	dialogContainer: {
		width: "370px",
	},
	dialogContainerMore: {
		width: "570px",
	},
	dialogContainerExtraMore: {
		width: "800px",
	},
	dialogContent: {
		display: "flex",
		flexDirection: "column",
	},
	inputText: {
		color: "#000000de",
	},
}));

function NoteContentPopup({ open, onClose, note }) {
	const { classes, cx } = useStyles();
	const [noteSize, setNoteSize] = useState({
		small: false,
		medium: false,
		large: false,
	});
	let totalLength = note?.length;

	useEffect(() => {
		if (totalLength < 50) setNoteSize({ small: true });
		else if (totalLength <= 500) setNoteSize({ medium: true });
		else if (totalLength > 500) setNoteSize({ large: true });
	}, [open, totalLength]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="content-dialog"
		>
			<div
				className={cx({
					[classes.dialogContainer]: noteSize.small,
					[classes.dialogContainerMore]: noteSize.medium,
					[classes.dialogContainerExtraMore]: noteSize.large,
				})}
			>
				<div style={{ display: "flex" }}>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Note</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.ConfirmButton
							onClick={onClose}
							variant="contained"
							style={{ width: "105px" }}
						>
							Close
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</div>
				<DialogContent className={classes.dialogContent}>
					<TextField
						sx={{
							"& .MuiInputBase-input.Mui-disabled": {
								WebkitTextFillColor: "#000000",
							},
						}}
						value={note}
						variant="outlined"
						fullWidth
						multiline
						InputProps={{
							classes: {
								input: classes.inputText,
							},
						}}
						disabled
					/>
				</DialogContent>
			</div>
		</Dialog>
	);
}

export default NoteContentPopup;
