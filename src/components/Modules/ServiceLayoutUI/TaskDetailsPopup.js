import {
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getSingleModelTask } from "services/models/modelDetails/modelTasks";
import AddDialogStyle from "styles/application/AddDialogStyle";
import TaskDetails from "../ModelTaskTable/ModelTaskExpand/Details";
import "./style.css";

const ADD = AddDialogStyle();

function TaskDetailsPopup({ isOpen, onClose, rowId }) {
	const [isFetching, setIsFetching] = useState(false);
	const [task, setTask] = useState({});
	const dispatch = useDispatch();

	const fetchTaskDetail = useCallback(async () => {
		setIsFetching(true);
		const response = await getSingleModelTask(rowId);
		if (response.status) {
			setTask(response.data[0]);
		} else {
			dispatch(showError(response?.data?.title || "something went wrong"));
		}
		setIsFetching(false);
	}, [rowId, dispatch]);

	useEffect(() => {
		if (isOpen) {
			fetchTaskDetail();
		}

		if (!isOpen) {
			setIsFetching(false);
		}
	}, [isOpen, fetchTaskDetail]);
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="application-dailog"
			fullWidth
			maxWidth="md"
		>
			<ADD.ActionContainer>
				<DialogTitle id="add-dialog-title">
					<ADD.HeaderText>Task Details</ADD.HeaderText>
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={onClose} variant="contained">
						Cancel
					</ADD.CancelButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>

			<DialogContent className="detailContent">
				{isFetching ? <CircularProgress /> : <TaskDetails taskInfo={task} />}
			</DialogContent>
		</Dialog>
	);
}

export default TaskDetailsPopup;
