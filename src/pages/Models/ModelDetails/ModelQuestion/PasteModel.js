import React, { useState } from "react";
import { Dialog, DialogTitle, LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { pasteModelQuestions } from "services/models/modelDetails/modelQuestions";

const AT = AddDialogStyle();

const useStyles = makeStyles({
	paper: { minWidth: "40%" },
});

const PasteModel = ({
	open,
	handleClose,
	modelId,
	questionId,
	title,
	handlePasteComplete,
}) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);

	const handlePaste = async () => {
		setLoading(true);
		try {
			let result = await pasteModelQuestions(modelId, {
				modelVersionQuestionID: questionId,
			});
			setLoading(false);
			if (result.status) {
				handlePasteComplete(result.data);
				handleClose();
			} else {
			}
		} catch (e) {
			return;
		}
	};

	return (
		<Dialog
			classes={{ paper: classes.paper }}
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			{loading ? <LinearProgress /> : null}
			<AT.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					<AT.HeaderText>Paste {title}</AT.HeaderText>
				</DialogTitle>

				<AT.ButtonContainer>
					<AT.CancelButton onClick={handleClose} variant="contained">
						Cancel
					</AT.CancelButton>
					<AT.ConfirmButton variant="contained" onClick={handlePaste}>
						Save
					</AT.ConfirmButton>
				</AT.ButtonContainer>
			</AT.ActionContainer>
		</Dialog>
	);
};
export default PasteModel;
