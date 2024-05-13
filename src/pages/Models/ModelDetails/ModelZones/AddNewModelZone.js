import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	LinearProgress,
} from "@mui/material";
import * as yup from "yup";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AddDialogStyle from "styles/application/AddDialogStyle";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import ImageUpload from "components/Elements/ImageUpload";

import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { uploadZoneImage } from "services/models/modelDetails/modelZones";

// Init styled components
const ADD = AddDialogStyle();

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

// Yup validation schema
const schema = yup.object({
	Name: yup
		.string("This field must be a string")
		.max(50, "The field Name must be a string with a maximum length of 50")
		.required("Name is required"),
	image: yup
		.mixed()
		.test("fileType", "Unsupported File Format", (value) =>
			SUPPORTED_FORMATS.includes(value.type)
		)
		.nullable(),
	imageUrl: yup.string(),
	imageName: yup.string(),
	defaultSiteAssetFilter: yup.string().nullable(),
});

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: "100%",
	},
	dividerStyle: {
		margin: "10px 0",
	},
	imageContainer: {
		width: "120px",
		height: "120px",
		objectFit: "contain",
	},
	imageContainerMain: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	deleteIcon: {
		cursor: "pointer",
		fontSize: "10px",
	},
	zonedialouge: {
		width: "100%",
		maxWidth: "100%",
	},
}));

// Default state schemas
const defaultErrorSchema = {
	Name: null,
	image: null,
	defaultSiteAssetFilter: null,
};
const defaultStateSchema = {
	Name: "",
	imageUrl: "",
	image: null,
	imageName: "",
	defaultSiteAssetFilter: "",
};

function AddNewModelTask({
	open,
	closeHandler,
	data,
	title,
	createProcessHandler,
	ModelVersionID,
	zoneId,
	fetchModelZoneList,
	isEdit,
	customCaptions,
	modelType,
}) {
	// Init hooks
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	useEffect(() => {
		if (data) {
			setInput({
				...data,
				imageUrl: data.imageUrl || "",
				imageName: data.imageName || "",
			});
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
		const cleanInput = {
			...input,
			defaultSiteAssetFilter: input.defaultSiteAssetFilter || null,
		};

		try {
			const localChecker = await handleValidateObj(schema, cleanInput);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await createProcessHandler({
					Name: input.Name,
					ModelVersionID,
					imageKey: input?.imageName,
					defaultSiteAssetFilter: input?.defaultSiteAssetFilter || null,
				});
				if (newData?.status) {
					if (input?.image) {
						const formData = new FormData();
						formData.append("file", input.image);
						await uploadZoneImage(zoneId || newData.data, formData);
					}
					await fetchModelZoneList();
					setIsUpdating(false);
					closeOverride();
				} else {
					dispatch(
						showError(newData?.data?.detail || "Failed to add new zone")
					);
					setIsUpdating(false);
				}
			} else {
				// show validation errors
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here
			setIsUpdating(false);
			setErrors({ ...errors, ...err?.response?.data?.errors });
			dispatch(
				showError(err?.response?.data?.detail || "Failed to add new zone")
			);
		}
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleCreateProcess();
		}
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={cx("large-application-dailog")}
			>
				{isUpdating ? <LinearProgress /> : null}
				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{
							<ADD.HeaderText>
								{isEdit ? "Edit " + title : title}
							</ADD.HeaderText>
						}
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
								{isEdit ? "Close " : title}
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>
				<Divider className={classes.dividerStyle} />

				<DialogContent className={classes.dialogContent}>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.Name === null ? false : true}
								helperText={errors.Name === null ? null : errors.Name}
								value={input.Name}
								onChange={(e) => {
									setInput({ ...input, Name: e.target.value });
								}}
								variant="outlined"
								autoFocus
								onKeyDown={handleEnterPress}
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>Image</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={errors.image === null ? null : errors.image}
							>
								<ImageUpload
									onDrop={(e) => {
										setInput({
											...input,
											image: e[0],
											imageUrl: URL.createObjectURL(e[0]),
											imageName: e[0].name,
										});
									}}
									imageUrl={input?.imageUrl}
									imageName={input?.image?.name || ""}
									removeImage={() => {
										setInput({
											...input,
											imageUrl: "",
											imageName: "",
											image: null,
										});
									}}
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					{modelType === "F" && (
						<ADD.InputContainer>
							<ADD.LeftInputContainer>
								<ADD.NameLabel>
									Default {customCaptions?.asset} Filter
								</ADD.NameLabel>

								<ADD.NameInput
									variant="outlined"
									size="medium"
									value={input.defaultSiteAssetFilter}
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setInput({
											...input,
											defaultSiteAssetFilter: e.target.value,
										});
									}}
								/>
							</ADD.LeftInputContainer>
						</ADD.InputContainer>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewModelTask;
