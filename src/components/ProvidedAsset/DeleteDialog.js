import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const DeleteDialog = ({ open, closeHandler, name, handleDelete }) => {
	const handleDeleteConfirm = () => {
		handleDelete();
		closeHandler();
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeHandler}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						You are about to delete <strong>{name}</strong>. This is not
						reversable.
					</DialogContentText>
					<DialogContentText id="alert-dialog-description2">
						<strong>Do you want to proceed?</strong>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeHandler} color="primary" variant="contained">
						No
					</Button>
					<Button
						onClick={handleDeleteConfirm}
						color="secondary"
						variant="contained"
					>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default DeleteDialog;
