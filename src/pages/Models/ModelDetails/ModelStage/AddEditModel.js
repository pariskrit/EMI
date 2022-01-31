import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	Divider,
	FormGroup,
	FormControlLabel,
	Typography,
	LinearProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as yup from "yup";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import ColourConstants from "helpers/colourConstants";
import EMICheckbox from "components/Elements/EMICheckbox";
import { useEffect } from "react";
import {
	editModelStatus,
	postModelStatus,
	uploadModelStatusImage,
} from "services/models/modelStages";
import ImageUpload from "components/Elements/ImageUpload";

const ADD = AddDialogStyle();
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

// Yup validation schema
const schema = yup.object({
	name: yup.string("This field must be a string").required("Name is required"),
	hasZones: yup.bool(),
	imageUrl: yup.string(),
	image: yup
		.mixed()
		.test("fileType", "Unsupported File Format", (value) =>
			SUPPORTED_FORMATS.includes(value.type)
		),
	imageName: yup.string(),
});

const defaultErrorSchema = { name: null, image: null };

const useStyles = makeStyles({
	// Override for paper used in dialog
	paper: { minWidth: "90%" },
	dividerStyle: {
		width: "100%",
		backgroundColor: ColourConstants.divider,
	},
	mainImage: {
		border: "1px solid",
		padding: 12,
		borderRadius: 5,
		width: "100%",
	},
	inputTextCheck: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		gap: 10,
	},
	image: { display: "flex", alignItems: "center", padding: 11, gap: 10 },

	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
		verticalAlign: "middle",
	},
});

const initialInput = {
	name: "",
	hasZones: false,
	imageUrl: "",
	image: null,
	imageName: "",
};

const AddEditModel = ({
	open,
	handleClose,
	detailData,
	getError,
	modelVersionID,
	handleAddEditComplete,
}) => {
	const classes = useStyles();
	const [input, setInput] = useState(initialInput);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (detailData) {
			const { name, imageURL, imageKey, hasZones } = detailData;
			setInput({
				...input,
				name,
				hasZones: hasZones === "Yes" ? true : false,
				imageUrl: imageURL,
				imageName: imageKey,
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
			let res = await uploadModelStatusImage(stageId, data);
			return res.data;
		} catch (e) {
			return;
		}
	};

	const handleAdd = async () => {
		let { name, hasZones } = input;
		setLoading(true);

		try {
			let res = await postModelStatus({ name, hasZones, modelVersionID });
			if (res.status) {
				const formData = new FormData();
				formData.append("file", input.image);
				let imageRes = await uploadImage(res.data, formData);
				handleAddEditComplete(imageRes);
				setLoading(false);
				closeOverride();
			} else {
				setLoading(false);

				getError(res.data.detail);
			}
		} catch (err) {
			return;
		}
	};
	const handleEdit = async () => {
		setLoading(true);

		try {
			let res = await editModelStatus(detailData.id, [
				{ op: "replace", path: "name", value: input.name },
				{ op: "replace", path: "hasZones", value: input.hasZones },
			]);
			if (res.status) {
				if (input.image) {
					const formData = new FormData();
					formData.append("file", input.image);
					let imageRes = await uploadImage(detailData.id, formData);
					handleAddEditComplete(imageRes);
					setLoading(false);
				}
				handleAddEditComplete({ ...detailData, ...res.data });
				setLoading(false);

				closeOverride();
			} else {
				setLoading(true);

				getError(res.data.detail);
			}
		} catch (err) {
			return;
		}
	};

	const handleSave = async () => {
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				if (input.imageUrl === "") {
					setErrors({ ...errors, image: "A file is required" });
				} else {
					if (detailData) {
						await handleEdit();
					} else {
						await handleAdd();
					}
				}
			} else {
				const newError = generateErrorState(localChecker);
				setErrors({ ...errors, ...newError });
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
					<ADD.HeaderText>{detailData ? "Edit" : "Add"} Stage</ADD.HeaderText>
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
				<ADD.InputContainer style={{ gap: 19 }}>
					<div className={classes.inputTextCheck}>
						<div>
							<ADD.NameLabel>
								Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								variant="outlined"
								size="small"
								value={input.name}
								autoFocus
								onKeyDown={handleEnterPress}
								onChange={(e) => {
									setInput({ ...input, name: e.target.value });
								}}
							/>
						</div>
						<div>
							<FormGroup>
								<FormControlLabel
									control={
										<EMICheckbox
											state={input.hasZones}
											changeHandler={() => {
												setInput((th) => ({ ...th, hasZones: !th.hasZones }));
											}}
										/>
									}
									label={<Typography>Has Zones</Typography>}
								/>
							</FormGroup>
						</div>
					</div>
					<div
						className={classes.mainImage}
						style={{ borderColor: errors.image === null ? null : "red" }}
					>
						<ADD.NameLabel>Image</ADD.NameLabel>
						<Divider className={classes.dividerStyle} />
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
								imageName={input?.image?.name || input?.imageName}
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
						<Divider className={classes.dividerStyle} />
					</div>
				</ADD.InputContainer>
			</ADD.DialogContent>
		</Dialog>
	);
};

export default AddEditModel;