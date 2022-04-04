import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextEditor from "components/Elements/TextEditor";
import { Grid } from "@material-ui/core";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { workbookFields } from "helpers/constants";
import { patchModelTask } from "services/models/modelDetails/modelTasks";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { ModelContext } from "contexts/ModelDetailContext";

// Init styled components
const ADD = AddDialogStyle();

const useStyles = makeStyles({
	WorkBookContainer: {
		margin: 20,
	},
	inputContainer: {
		marginBottom: 50,
	},
});

const WorkBook = ({ taskInfo, access }) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [localTaskInfo, setLocalTaskInfo] = useState({});
	const [isUpdating, setIsUpdating] = useState({});
	const [state] = useContext(ModelContext);

	useEffect(() => {
		if (taskInfo) setLocalTaskInfo(taskInfo);
	}, [taskInfo]);

	const { customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	// disbale field to edit when model in Read only mode
	const readOnly = access === "R";

	// update field on blur event
	const handleBlurEditor = async (_, __, editor, fieldName) => {
		if (readOnly || state?.modelDetail?.isPublished) return;

		const textEditorContent = editor.getHTML();

		if (localTaskInfo[fieldName] === textEditorContent) return;

		// disable editor while updating the data
		setIsUpdating((prev) => ({ ...prev, [fieldName]: true }));

		setLocalTaskInfo((prev) => ({ ...prev, [fieldName]: textEditorContent }));

		try {
			const response = await patchModelTask(taskInfo.id, [
				{ op: "replace", path: fieldName, value: textEditorContent },
			]);
			if (response.status) {
				taskInfo[fieldName] = textEditorContent;
			} else {
				setLocalTaskInfo(taskInfo);
				dispatch(
					showError(response?.data?.detail || "Could not update " + fieldName)
				);
			}
		} catch (error) {
			setLocalTaskInfo(taskInfo);
			dispatch(
				showError(
					error?.response?.data?.title || "Could not update " + fieldName
				)
			);
		} finally {
			// enable editor after updating the data
			setIsUpdating((prev) => ({ ...prev, [fieldName]: false }));
		}
	};

	return (
		<div className={classes.WorkBookContainer}>
			<Grid container spacing={2}>
				{workbookFields(customCaptions).map((field) => {
					return (
						<Grid item lg={6} md={6} xs={12} key={field.id}>
							<div className={classes.inputContainer}>
								<ADD.NameLabel>{field.label}</ADD.NameLabel>
								<TextEditor
									id={field.id}
									readOnly={
										readOnly ||
										isUpdating?.[field.name] ||
										state?.modelDetail?.isPublished
									}
									value={localTaskInfo[field.name]}
									name={field.name}
									onBlur={(range, source, editor) =>
										handleBlurEditor(range, source, editor, field.name)
									}
								/>
							</div>
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
};

export default WorkBook;
