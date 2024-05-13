import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	LinearProgress,
} from "@mui/material";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import * as yup from "yup";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import {
	addModelVersionArrangements,
	editModelVersionArrangements,
} from "services/models/modelDetails/modelIntervals";

const ADD = AddDialogStyle();

// Yup validation schema
const schema = (title) =>
	yup.object({
		name: yup
			.string(`${title} name must be string`)
			.max(50, "The field Name must be a string with a maximum length of 50")
			.required(`${title} name is required`),
	});

const AddModelArrangements = ({
	open,
	handleClose,
	modelId,
	getError,
	title,
	editData,
	fetchModelArrangement,
	dispatchCount = () => {},
	isEdit = false,
}) => {
	const [loading, setLoading] = useState(false);
	const [input, setInput] = useState({
		name: "",
	});

	const [errors, setErrors] = useState({
		name: null,
	});

	useEffect(() => {
		if (isEdit && editData) {
			setInput({
				name: editData?.name,
			});
		}
	}, [editData, isEdit]);

	const handleCreateProcess = async () => {
		setLoading(true);

		const { name } = input;

		const data = {
			ModelVersionID: +modelId,
			Name: name,
		};

		try {
			const localChecker = await handleValidateObj(schema(title), {
				name,
			});
			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				if (!isEdit) {
					let result = await addModelVersionArrangements(data);
					if (result.status) {
						await fetchModelArrangement();
						closeOverride();
					} else {
						if (result.data?.detail) getError(result.data.detail);
						else {
							getError(`${title} could not be added`);
						}
					}
				} else {
					let result = await editModelVersionArrangements(editData?.id, [
						{
							op: "replace",
							path: "name",
							value: name,
						},
					]);
					if (result.status) {
						await fetchModelArrangement();
						dispatchCount(result?.data);
						closeOverride();
					} else {
						getError(result?.data?.detail || `${title} could not be updated`);
					}
				}
			} else {
				// show validation errors
				const newError = generateErrorState(localChecker);
				setErrors({ ...errors, ...newError });
			}
		} catch (e) {
			getError(`Something went wrong`);
			return;
		}
		setLoading(false);
	};
	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleCreateProcess();
		}
	};

	const closeOverride = () => {
		handleClose();
		setErrors({
			name: null,
		});
		!isEdit && setInput({ name: "" });
	};

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="medium-application-dailog"
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle>
					<ADD.HeaderText>
						{isEdit ? "Edit" : "Add"} {title}
					</ADD.HeaderText>
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
						>
							{isEdit ? "Close" : `Add ${title}`}
						</ADD.ConfirmButton>
					</div>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<Divider />
			<DialogContent>
				<>
					<div>
						<ADD.NameLabel>
							Name<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ErrorInputFieldWrapper
							errorMessage={errors?.name === null ? null : errors?.name}
						>
							<ADD.NameInput
								error={errors.name === null ? false : true}
								variant="outlined"
								size="medium"
								value={input.name}
								autoFocus
								onKeyDown={handleEnterPress}
								onChange={(e) => {
									setInput({ ...input, name: e.target.value, asset: {} });
								}}
							/>
						</ErrorInputFieldWrapper>
					</div>
				</>
			</DialogContent>
		</Dialog>
	);
};
export default AddModelArrangements;
