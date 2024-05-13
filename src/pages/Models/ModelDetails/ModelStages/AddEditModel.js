import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	FormGroup,
	FormControlLabel,
	Typography,
	LinearProgress,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import * as yup from "yup";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import ColourConstants from "helpers/colourConstants";
import EMICheckbox from "components/Elements/EMICheckbox";
import { useEffect } from "react";
import {
	editModelStage,
	postModelStage,
	uploadModelStageImage,
} from "services/models/modelDetails/modelStages";
import ImageUpload from "components/Elements/ImageUpload";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";

const ADD = AddDialogStyle();
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.max(50, "The field Name must be a string with a maximum length of 50")
		.required("Name is required"),
	hasZones: yup.bool(),
	imageUrl: yup.string(),
	image: yup
		.mixed()
		.test("fileType", "Unsupported File Format", (value) =>
			SUPPORTED_FORMATS.includes(value.type)
		)
		.nullable(true),
	imageName: yup.string(),
	defaultSiteAssetFilter: yup.string().nullable(),
});

const defaultErrorSchema = {
	name: null,
	image: null,
	defaultSiteAssetFilter: null,
};

const useStyles = makeStyles()((theme) => ({
	// Override for paper used in dialog
	paper: { minWidth: "90%" },

	mainImage: {
		borderRadius: 5,
		width: "100%",
	},
	inputTextCheck: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
	},
	image: { display: "flex", alignItems: "center", gap: 10 },

	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
		verticalAlign: "middle",
	},
}));

const initialInput = {
	name: "",
	hasZones: false,
	imageUrl: "",
	image: null,
	imageName: "",
	defaultSiteAssetFilter: "",
};

const AddEditModel = ({
	open,
	handleClose,
	detailData,
	getError,
	modelVersionID,
	handleAddEditComplete,
	title,
	modelType,
	customCaptionsAsset,
	zonePlural,
}) => {
	const { classes, cx } = useStyles();
	const [input, setInput] = useState(initialInput);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (detailData) {
			const { name, imageURL, imageKey, hasZones, defaultSiteAssetFilter } =
				detailData;
			setInput({
				...input,
				name,
				hasZones: hasZones === "Yes" ? true : false,
				imageUrl: imageURL || "",
				imageName: imageKey || "",
				defaultSiteAssetFilter,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detailData]);

	const closeOverride = () => {
		setInput(initialInput);
		setErrors(defaultErrorSchema);
		handleClose();
	};

	const uploadImage = async (stageId, data) => {
		try {
			let res = await uploadModelStageImage(stageId, data);
			return res.data;
		} catch (e) {
			return;
		}
	};

	const handleAdd = async () => {
		let { name, hasZones, defaultSiteAssetFilter } = input;
		setLoading(true);

		try {
			let res = await postModelStage({
				name,
				hasZones,
				modelVersionID,
				defaultSiteAssetFilter: defaultSiteAssetFilter || null,
			});
			if (res.status) {
				if (input.image) {
					const formData = new FormData();
					formData.append("file", input.image);
					await uploadImage(res.data, formData);
				}
				await handleAddEditComplete();
				setLoading(false);
				closeOverride();
			} else {
				setLoading(false);

				getError(res.data.detail || "Could not add");
			}
		} catch (err) {
			return;
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = async () => {
		setLoading(true);

		try {
			let res = await editModelStage(detailData.id, [
				{ op: "replace", path: "name", value: input.name },
				{ op: "replace", path: "hasZones", value: input.hasZones },
				{
					path: "defaultSiteAssetFilter",
					op: "replace",
					value: input.defaultSiteAssetFilter || null,
				},
				...[
					input.imageName === ""
						? { path: "imageKey", op: "replace", value: null }
						: [],
				].filter((x) => JSON.stringify(x) !== "[]"),
			]);
			if (res.status) {
				if (input.image) {
					const formData = new FormData();
					formData.append("file", input.image);
					let imageRes = await uploadImage(detailData.id, formData);
					await handleAddEditComplete(imageRes);
					setLoading(false);
				} else {
					await handleAddEditComplete({ ...detailData, ...res.data });
					setLoading(false);
				}

				closeOverride();
			} else {
				setLoading(false);

				getError(res.data.detail);
			}
		} catch (err) {
			return;
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		try {
			const localChecker = await handleValidateObj(schema, {
				...input,
				defaultSiteAssetFilter: input.defaultSiteAssetFilter || null,
			});
			if (!localChecker.some((el) => el.valid === false)) {
				if (detailData) {
					await handleEdit();
				} else {
					await handleAdd();
				}
			} else {
				const newError = generateErrorState(localChecker);
				setErrors({ ...errors, ...newError });
			}
		} catch (e) {
			dispatch(showError(`Failed to ${detailData ? "edit" : "add"} ${title}.`));
			return;
		}
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleSave();
		}
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
						{detailData ? "Edit" : "Add"} {title}
					</ADD.HeaderText>
				</DialogTitle>

				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton variant="contained" onClick={handleSave}>
						{detailData ? "Close" : "Add " + title}
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<ADD.DialogContent>
				<ADD.InputContainer>
					<ADD.LeftInputContainer>
						<div className={classes.inputTextCheck}>
							<div>
								<ADD.NameLabel>
									Name<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>
								<ADD.NameInput
									error={errors.name === null ? false : true}
									helperText={errors.name === null ? null : errors.name}
									variant="outlined"
									size="medium"
									value={input.name}
									autoFocus
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setInput({ ...input, name: e.target.value });
									}}
								/>
							</div>
						</div>
					</ADD.LeftInputContainer>
					<ADD.RightInputContainer>
						<div
							className={classes.mainImage}
							style={{ borderColor: errors.image === null ? null : "red" }}
						>
							<ADD.NameLabel>Image</ADD.NameLabel>
							<div className={classes.image}>
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
											image: null,
											imageUrl: "",
											imageName: "",
										});
									}}
								/>
							</div>
							<p style={{ color: "red" }}>
								{errors.image === null ? null : errors.image}
							</p>
						</div>
					</ADD.RightInputContainer>
				</ADD.InputContainer>
				{modelType === "F" && (
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								Default {customCaptionsAsset} Filter
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
				<ADD.InputContainer>
					<FormGroup>
						<FormControlLabel
							style={{ marginLeft: 0 }}
							control={
								<EMICheckbox
									state={input.hasZones}
									changeHandler={() => {
										setInput((th) => ({ ...th, hasZones: !th.hasZones }));
									}}
								/>
							}
							label={<Typography>Has {zonePlural}</Typography>}
						/>
					</FormGroup>
				</ADD.InputContainer>
			</ADD.DialogContent>
		</Dialog>
	);
};

export default AddEditModel;
