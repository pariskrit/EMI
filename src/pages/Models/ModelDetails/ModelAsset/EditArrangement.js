import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	LinearProgress,
} from "@mui/material";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { patchmodelAssest } from "services/models/modelDetails/modelAsset";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { handleSort } from "helpers/utils";
import { isChrome } from "helpers/utils";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

const ADD = AddDialogStyle();

const initialInput = {
	modelVersionArrangementID: "",
};

const EditArrangement = ({
	open,
	handleClose,
	getError,
	title,
	editData,
	fetchModelAsset,
	isEdit = false,
	arrangementDatas,
}) => {
	const [loading, setLoading] = useState(false);
	const [input, setInput] = useState(initialInput);

	const [modelFocus, setModelFocus] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		if (isEdit && editData) {
			setInput({
				modelVersionArrangementID: {
					id: editData?.modelVersionArrangementID,
					name: editData?.arrangementName,
				},
			});
		}
	}, [editData, isEdit]);

	const editArrangement = async () => {
		setLoading(true);

		const { modelVersionArrangementID } = input;

		try {
			// Attempting API call if no local validaton errors
			let result = await patchmodelAssest(editData?.id, [
				{
					op: "replace",
					path: "modelVersionArrangementID",
					value: modelVersionArrangementID?.id,
				},
			]);
			if (result.status) {
				await fetchModelAsset(false);
				closeOverride();
			} else {
				getError(result.data.detail);
			}
		} catch (e) {
			dispatch(showError(`Failed to updated ${title}.`));
		}
		setLoading(false);
	};

	const closeOverride = () => {
		handleClose();
	};

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="application-dailog"
			disableEnforceFocus={isChrome() ? modelFocus : false}
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
						<ADD.CancelButton
							onClick={closeOverride}
							variant="contained"
							onFocus={(e) => {
								setModelFocus(true);
							}}
						>
							Cancel
						</ADD.CancelButton>
					</div>
					<div className="modalButton">
						<ADD.ConfirmButton onClick={editArrangement} variant="contained">
							{isEdit ? "Close" : `Add ${title}`}
						</ADD.ConfirmButton>
					</div>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<Divider />
			<DialogContent>
				<div style={{ marginTop: "20px" }}>
					<DyanamicDropdown
						dataSource={arrangementDatas}
						isServerSide={false}
						width="100%"
						placeholder={`Select ${title}`}
						dataHeader={[{ id: 1, name: "Interval" }]}
						columns={[{ id: 1, name: "name" }]}
						selectedValue={input["modelVersionArrangementID"]}
						handleSort={handleSort}
						onChange={(val) => {
							setInput({
								...input,
								modelVersionArrangementID: val,
							});
						}}
						selectdValueToshow="name"
						label={title}
						required
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};
export default EditArrangement;
