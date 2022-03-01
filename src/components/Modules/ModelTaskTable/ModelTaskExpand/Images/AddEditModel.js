import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	LinearProgress,
	makeStyles,
} from "@material-ui/core";
import * as yup from "yup";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import {
	updateImage,
	uploadTaskImage,
} from "services/models/modelDetails/modelTasks/images";
import ImageUpload from "components/Elements/ImageUpload";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const schema = yup.object({
	description: yup.string("String is required"),
	image: yup
		.mixed()
		.test("fileType", "Unsupported File Format", (value) =>
			SUPPORTED_FORMATS.includes(value.type)
		),
	imageName: yup.string(),
	imageURL: yup.string().required("Please Drop Image"),
});

const ADD = AddDialogStyle();

const useStyles = makeStyles({
	paper: { minWidth: "90%", height: 250 },
});

const defaultInput = {
	description: "",
	image: null,
	imageName: "",
	imageURL: "",
};

const defaultError = {
	description: null,
	image: null,
	imageName: null,
	imageURL: null,
};

const AddEditModel = ({
	open,
	handleClose,
	imageDetail,
	title,
	taskId,
	handleComplete,
	errorResponse,
}) => {
	const classes = useStyles();

	const [input, setInput] = useState(defaultInput);
	const [errors, setErrors] = useState(defaultError);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (imageDetail) {
			const { description, imageURL, imageKey } = imageDetail;
			setInput({
				description: description,
				imageURL,
				imageName: imageKey,
				image: null,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageDetail]);

	const uploadImage = async () => {
		const formData = new FormData();
		formData.append("file", input.image);
		try {
			let res = await uploadTaskImage(taskId, formData);
			if (res.status) {
				handleComplete();
				closeOverride();
			} else {
				errorResponse(res);
			}
		} catch (e) {
			return;
		}
	};

	const handleAdd = async () => {
		setLoading(true);
		await uploadImage();
		setLoading(false);
	};

	const handleEdit = async () => {
		// If the input is same as of selected editData (imageDetail)
		if (input.description === imageDetail.description) return;
		setLoading(true);
		try {
			const patchData = [
				{ op: "replace", path: "description", value: input.description },
			];
			let result = await updateImage(imageDetail.id, patchData);
			setLoading(false);
			if (result.status) {
				handleComplete();
				closeOverride();
			} else {
				errorResponse(result);
			}
		} catch (e) {
			return;
		}
	};

	const handleSave = async () => {
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				if (imageDetail) {
					handleEdit();
				} else {
					handleAdd();
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
			}
		} catch (e) {
			return;
		}
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	const closeOverride = () => {
		setInput(defaultInput);
		setErrors(defaultError);
		handleClose();
	};

	return (
		<Dialog
			classes={{ paper: classes.paper }}
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					<ADD.HeaderText>
						{imageDetail ? "Edit" : "Add"} {title}
					</ADD.HeaderText>
				</DialogTitle>

				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton variant="contained" onClick={handleSave}>
						Save
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<ADD.DialogContent>
				<ADD.InputContainer>
					{imageDetail ? (
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								Description<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.description === null ? false : true}
								helperText={
									errors.description === null ? null : errors.description
								}
								variant="outlined"
								size="small"
								value={input.description}
								autoFocus
								onKeyDown={handleEnterPress}
								onChange={(e) => {
									setInput({ ...input, description: e.target.value });
								}}
							/>
						</ADD.LeftInputContainer>
					) : null}
					<ADD.RightInputContainer>
						<ADD.NameLabel>
							Image<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ImageUpload
							imageName={input.image?.name || input.imageName}
							imageUrl={input.imageURL}
							removeImage={() => {
								setInput(defaultInput);
							}}
							onDrop={(e) => {
								setInput({
									description: input.description,
									image: e[0],
									imageName: e[0].name,
									imageURL: URL.createObjectURL(e[0]),
								});
							}}
						/>
						<p style={{ color: "red" }}>
							{errors.imageURL === null ? null : errors.imageURL}
							{errors.image === null ? null : errors.image}
						</p>
					</ADD.RightInputContainer>
				</ADD.InputContainer>
			</ADD.DialogContent>
		</Dialog>
	);
};

export default AddEditModel;
