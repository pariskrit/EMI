import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, LinearProgress } from "@mui/material";
import * as yup from "yup";
import { makeStyles } from "tss-react/mui";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import {
	updateImage,
	uploadTaskImage,
} from "services/models/modelDetails/modelTasks/images";
import ImageUpload from "components/Elements/ImageUpload";
import ColourConstants from "helpers/colourConstants";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const schema = yup.object({
	description: yup
		.string("String is required")
		.required("This field is required"),
	image: yup
		.mixed()
		.nullable()
		.test("fileType", "Unsupported File Format", (value) =>
			SUPPORTED_FORMATS.includes(value.type)
		),
	imageName: yup.string(),
	imageURL: yup.string().required("Please Drop Image"),
});

const ADD = AddDialogStyle();

const useStyles = makeStyles()((theme) => ({
	imageEdit: { width: "60%", margin: "auto" },
	image: { width: "100%" },
}));

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
	const { classes, cx } = useStyles();
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
		formData.append("description", input.description);
		try {
			let res = await uploadTaskImage(taskId, formData);
			if (res.status) {
				handleComplete(res.data);
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
	};

	const handleEdit = async () => {
		// If the input is same as of selected editData (imageDetail)
		if (input.description === imageDetail.description) closeOverride();

		setLoading(true);
		try {
			const patchData = [
				{ op: "replace", path: "description", value: input.description },
			];
			let result = await updateImage(imageDetail.id, patchData);
			if (result.status) {
				handleComplete(input.description);
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
		setLoading(false);
		handleClose();
	};

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth="md"
			fullWidth
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					<ADD.HeaderText>
						{imageDetail ? "Edit" : "Add"} {title}
					</ADD.HeaderText>
				</DialogTitle>

				<ADD.ButtonContainer>
					<ADD.CancelButton
						onClick={closeOverride}
						variant="contained"
						sx={{
							"&.MuiButton-root:hover": {
								backgroundColor: ColourConstants.deleteDialogHover,
								color: "#ffffff",
							},
						}}
					>
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						variant="contained"
						onClick={handleSave}
						sx={{
							"&.MuiButton-root:hover": {
								backgroundColor: ColourConstants.deleteDialogHover,
								color: "#ffffff",
							},
						}}
					>
						{imageDetail ? "Close" : "Add " + title}
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<ADD.DialogContent>
				<ADD.InputContainer>
					<ADD.LeftInputContainer className={classes.imageEdit}>
						<ADD.NameLabel>
							Image<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ImageUpload
							imageName={input.image?.name || ""}
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
							isReadOnly={imageDetail ? true : false}
						/>
						<p style={{ color: "red" }}>
							{errors.imageURL === null ? null : errors.imageURL}
							{errors.image === null ? null : errors.image}
						</p>
					</ADD.LeftInputContainer>

					<ADD.RightInputContainer>
						<ADD.NameLabel>
							Description<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ADD.NameInput
							error={errors.description === null ? false : true}
							helperText={
								errors.description === null ? null : errors.description
							}
							variant="outlined"
							size="medium"
							value={input.description}
							autoFocus
							onKeyDown={handleEnterPress}
							onChange={(e) => {
								setInput({ ...input, description: e.target.value });
							}}
							fullWidth
						/>
					</ADD.RightInputContainer>
				</ADD.InputContainer>
			</ADD.DialogContent>
		</Dialog>
	);
};

export default AddEditModel;
