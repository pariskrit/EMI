import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@material-ui/core";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import AttachmentUpload from "./AttachmentUpload.js";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be string")
		.required("This field is required")
		.max(100, "must be less than or equal to 100 characters"),
	file: yup.mixed().test("fileType", "File size limited to 6 MB", (value) => {
		return value.size < 6 * 1024 * 1024 || typeof value === "string";
	}),

	link: yup.string("This field must be string"),
});

const useStyles = makeStyles({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	createButton: {
		width: "auto",
	},
	inputText: {
		fontSize: 14,
	},
	inputInfo: {
		marginLeft: "7px",
	},
});

// Default state schemas
const defaultErrorSchema = {
	name: null,
	file: null,
	link: null,
};
const defaultStateSchema = {
	name: "",
	file: null,
	link: "",
};

function AddOrEditAttachment({
	open,
	closeHandler,
	data,
	title,
	createProcessHandler,
	fetchData,
}) {
	// Init hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	useEffect(() => {
		if (data) {
			setInput(data);
		}
	}, [data]);

	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);

		closeHandler();
	};

	const handleCreateProcess = async () => {
		// Rendering spinner
		setIsUpdating(true);

		// Clearing errors before attempted create
		setErrors(defaultErrorSchema);

		// cleaned Input

		try {
			const localChecker = await handleValidateObj(schema, input);
			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await createProcessHandler(input);
				if (newData.status) {
					await fetchData();
					setIsUpdating(false);
					closeOverride();
				} else {
					setIsUpdating(false);
					dispatch(
						showError(newData?.data?.detail || "Could not add new attachment")
					);
				}
			} else {
				// show validation errors
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here
			console.log(err);
			setIsUpdating(false);
			setErrors({ ...errors, ...err?.response?.data?.errors });
			dispatch(
				showError(err?.response?.data?.title || "Could not add new attachment")
			);
		}
	};

	const handleKeydownPress = (e) => {
		if (e.keyCode === 13) {
			handleCreateProcess();
		}
	};

	const handleDropDocument = (e) => {
		if (input.link !== "") return;
		setInput({
			...input,
			file: e[0],
		});
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="application-dailog"
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>{title}</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<div className="modalButton">
							<ADD.CancelButton onClick={closeOverride} variant="contained">
								Cancel
							</ADD.CancelButton>
						</div>
						<div className="modalButton">
							<ADD.ConfirmButton
								onClick={handleCreateProcess}
								variant="contained"
								className={classes.createButton}
								disabled={isUpdating}
							>
								{title}
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					<ADD.FullWidthContainer>
						<ADD.NameLabel>
							Name<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ADD.NameInput
							error={errors.name === null ? false : true}
							helperText={errors.name === null ? null : errors.name}
							value={input.name}
							onChange={(e) => {
								setInput({ ...input, name: e.target.value });
							}}
							onKeyDown={handleKeydownPress}
							variant="outlined"
							fullWidth
						/>
					</ADD.FullWidthContainer>

					<ADD.FullWidthContainer>
						<ADD.NameLabel>
							Document
							{input.link !== "" && (
								<ADD.RequiredStar>
									{" "}
									<span className={classes.inputInfo}>
										Please remove link to add document
									</span>
								</ADD.RequiredStar>
							)}
						</ADD.NameLabel>
						<ErrorInputFieldWrapper
							errorMessage={errors.file === null ? null : errors.file}
						>
							<AttachmentUpload
								onDrop={handleDropDocument}
								disabled={input.link !== ""}
								file={input.file}
								removeImage={() => setInput({ ...input, file: null })}
							/>
						</ErrorInputFieldWrapper>
					</ADD.FullWidthContainer>
					<ADD.FullWidthContainer>
						<ADD.NameLabel>
							Link
							{input.file !== null && (
								<ADD.RequiredStar>
									{" "}
									<span className={classes.inputInfo}>
										Please remove document to add link
									</span>
								</ADD.RequiredStar>
							)}
						</ADD.NameLabel>
						<ADD.NameInput
							error={errors.link === null ? false : true}
							helperText={errors.link === null ? null : errors.link}
							value={input.link}
							onChange={(e) => {
								setInput({ ...input, link: e.target.value });
							}}
							onKeyDown={handleKeydownPress}
							variant="outlined"
							fullWidth
							disabled={input.file !== null}
						/>
					</ADD.FullWidthContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddOrEditAttachment;
