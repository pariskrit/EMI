import React, { useContext, useEffect, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import TextEditor from "components/Elements/TextEditor";
import { Grid } from "@mui/material";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { workbookFields } from "helpers/constants";
import { patchModelTask } from "services/models/modelDetails/modelTasks";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { ModelContext } from "contexts/ModelDetailContext";
import { removeParaTagFromString } from "helpers/stringParser";
// Init styled components
const ADD = AddDialogStyle();

const useStyles = makeStyles()((theme) => ({
	WorkBookContainer: {
		margin: 20,
		display: "flex",
		gap: "20px",
	},
	inputContainer: {
		marginBottom: 20,
	},
}));

const WorkBook = ({ taskInfo, access, setTaskInfo }) => {
	const { classes } = useStyles();
	const dispatch = useDispatch();
	const editorRef = useRef();
	const [localTaskInfo, setLocalTaskInfo] = useState({});
	const [isUpdating, setIsUpdating] = useState({});
	const [state] = useContext(ModelContext);

	const saveData = async (fieldName, textEditorContent) => {
		try {
			const response = await patchModelTask(taskInfo.id, [
				{ op: "replace", path: fieldName, value: textEditorContent },
			]);
			if (response.status) {
				setTaskInfo((prev) => ({
					...prev,
					[fieldName]: textEditorContent,
					...(editorRef?.current?.fieldName
						? {
								[editorRef?.current?.fieldName]: removeParaTagFromString(
									editorRef?.current?.content
								),
						  }
						: {}),
				}));
				setLocalTaskInfo((prev) => ({
					...prev,

					...(editorRef?.current?.fieldName
						? {
								[editorRef?.current?.fieldName]: removeParaTagFromString(
									editorRef?.current?.content
								),
						  }
						: {}),
				}));

				//setTaskInfo(localTaskInfo)
			} else {
				setLocalTaskInfo(taskInfo);
				dispatch(
					showError(response?.data?.detail || "Could not update " + fieldName)
				);
			}
		} catch (error) {
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
	// disbale field to edit when model in Read only mode
	const readOnly = access === "R";

	useEffect(() => {
		setLocalTaskInfo(taskInfo);
		let isPublished = state?.modelDetail?.isPublished || readOnly;
		const handleBlur = () => {
			if (editorRef.current && !isPublished) {
				const { fieldName, content } = editorRef.current;
				const textEditorContent = removeParaTagFromString(content);
				if (taskInfo[fieldName] !== textEditorContent) {
					saveData(fieldName, textEditorContent);
				}
			}
		};
		window.addEventListener("blur", handleBlur);
		return () => {
			handleBlur();
			window.removeEventListener("blur", handleBlur);
		};
	}, [state, readOnly]);

	const { customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	// update field on blur event
	const handleBlurEditor = async (_, source, editor, fieldName) => {
		setLocalTaskInfo((prev) => ({
			...prev,
			[fieldName]: editor?.getHTML(),
		}));
		if (readOnly || state?.modelDetail?.isPublished) return;

		const textEditorContent = removeParaTagFromString(editor?.getHTML());
		if (taskInfo[fieldName] === textEditorContent) return;

		if (source === "silent") return;

		// disable editor while updating the data
		setIsUpdating((prev) => ({ ...prev, [fieldName]: true }));

		saveData(fieldName, textEditorContent);
	};

	const handleChange = (editor, fieldName, source) => {
		if (source === "user")
			editorRef.current = {
				fieldName,
				content: editor?.getHTML(),
				[fieldName]: editor.getHTML(),
			};
	};

	return (
		<div className={classes.WorkBookContainer}>
			<Grid container spacing={2}>
				<Grid item lg={6} md={6} xs={12}>
					{workbookFields(customCaptions).map((field, i) => {
						if (i % 2 === 0)
							return (
								<Grid item lg={12} md={12} xs={12} key={field.id}>
									<div className={classes.inputContainer}>
										<ADD.NameLabel>{field.label}</ADD.NameLabel>
										<TextEditor
											id={field.id}
											readOnly={
												readOnly ||
												isUpdating?.[field.name] ||
												state?.modelDetail?.isPublished
											}
											value={removeParaTagFromString(localTaskInfo[field.name])}
											name={field.name}
											onChange={(content, delta, source, editor) =>
												handleChange(editor, field.name, source)
											}
											onBlur={(range, source, editor) => {
												handleBlurEditor(range, source, editor, field.name);
											}}
										/>
									</div>
								</Grid>
							);
						return null;
					})}
				</Grid>

				<Grid item lg={6} md={6} xs={12}>
					{workbookFields(customCaptions).map((field, i) => {
						if (i % 2 !== 0)
							return (
								<Grid item lg={12} md={12} xs={12} key={field.id}>
									<div className={classes.inputContainer}>
										<ADD.NameLabel>{field.label}</ADD.NameLabel>
										<TextEditor
											id={field.id}
											readOnly={
												readOnly ||
												isUpdating?.[field.name] ||
												state?.modelDetail?.isPublished
											}
											value={removeParaTagFromString(localTaskInfo[field.name])}
											onChange={(content, delta, source, editor) =>
												handleChange(editor, field.name, source)
											}
											name={field.name}
											onBlur={(range, source, editor) =>
												handleBlurEditor(range, source, editor, field.name)
											}
										/>
									</div>
								</Grid>
							);
						return null;
					})}
				</Grid>
			</Grid>
		</div>
	);
};

export default WorkBook;
