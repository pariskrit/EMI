import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import API from "helpers/api";
import AddDialogStyle from "styles/application/AddDialogStyle";
import PauseDialogStyle from "styles/application/PauseDialogStyle";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Subcat from "./Subcat";
import NewSubcat from "./NewSubcat";
import ErrorAlert from "../ErrorAlert";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import ColourConstants from "helpers/colourConstants";
//import * as yup from "yup";
//import { handleValidateObj, generateErrorState, handleSort } from "helpers/utils";

// Init styled components
const ADD = AddDialogStyle();
const APD = PauseDialogStyle();

// Yup validation schema
/*const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
});*/

// Default state schemas
const defaultErrorSchema = { name: null, alert: null };
const defaultStateSchema = { name: "" };

const useStyles = makeStyles()((theme) => ({
	// Override for paper used in dialog
	paper: { minWidth: "90%" },
}));

const AddPauseDialog = ({
	open,
	closeHandler,
	applicationID,
	handleAddData,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [isAddNew, setIsAddNew] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [subcats, setSubcats] = useState([]);
	const dispatch = useDispatch();

	// Handlers
	const closeOverride = () => {
		// Closing dialog
		closeHandler();

		// Removing new subcat input
		setIsAddNew(false);

		// clearning state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);
		setSubcats([]);
	};
	const handleAddLocalSubcat = (newSubcatName) => {
		// Getting current subcats
		let currentSubcats = [...subcats];

		// Adding new subcat
		currentSubcats.push(newSubcatName);

		currentSubcats.sort((a, b) => a.toString().localeCompare(b.toString()));

		// Updating subcats state
		setSubcats(currentSubcats);

		return true;
	};
	const handleRemoveLocalSubcat = (index) => {
		// Getting current subcats
		let currentSubcats = [];

		// Creating new array with desired subcats
		subcats.forEach((sub, i) => {
			if (i !== index) {
				currentSubcats.push(sub);
			}
		});

		currentSubcats.sort((a, b) => a.toString().localeCompare(b.toString()));

		// Updating subcats state
		setSubcats(currentSubcats);

		return true;
	};
	const handleUpdateLocalSubcatName = (index, newName) => {
		// Getting current subcats
		let currentSubcats = [...subcats];

		// Updating subcat name
		currentSubcats.forEach((sub, i) => {
			if (i === index) {
				currentSubcats[index] = newName;
			}
		});

		currentSubcats.sort((a, b) => a.toString().localeCompare(b.toString()));

		// Updating subcats state
		setSubcats(currentSubcats);

		return true;
	};
	const handleSave = async () => {
		// Adding progress indicator
		setIsUpdating(true);

		// Clearing past errors
		setErrors(defaultErrorSchema);

		// Attempting to create
		try {
			//const localChecker = await handleValidateObj(schema, input);

			//if (!localChecker.some((el) => el.valid === false)) {
			const result = await API.post("/api/ApplicationPauses", {
				applicationId: applicationID,
				name: input.name,
				pauseSubcategories: subcats.map((name) => ({ name: name })),
			});

			// Handling success
			if (result.status === 201) {
				// Adding data to state
				handleAddData(result.data);

				// Removing loading indicator
				setIsUpdating(false);

				// Closing dialog
				closeOverride();

				return true;
			} else {
				throw new Error(result);
			}
			/*} else {
				const newErrors = generateErrorState(localChecker);

				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);

				return false;
			}*/
		} catch (err) {
			if (
				err.response.data.detail !== null ||
				err.response.data.detail !== undefined
			) {
				// Removing loading indicator
				setIsUpdating(false);

				// Setting alert error
				setErrors({
					...errors,
					...{
						alert: err.response.data.detail || "Failed to add pause reason",
					},
				});
			} else {
				// Removing loading indicator
				setIsUpdating(false);

				// TODO: Non validation error handling
				dispatch(showError("Failed to add pause reason."));
				return false;
			}
		}
	};
	const handleAddNewClick = () => {
		setIsAddNew(true);
	};
	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	return (
		<div>
			<Dialog
				classes={{ paper: classes.paper }}
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{isUpdating ? <LinearProgress /> : null}

				{/* Alert Render*/}
				{errors.alert === null ? null : (
					<ErrorAlert errorMessage={errors.alert} />
				)}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						<ADD.HeaderText>Add Pause Reason</ADD.HeaderText>
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
							Save
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<ADD.DialogContent>
					<div>
						<ADD.InputContainer>
							<APD.NameInputContainer>
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
							</APD.NameInputContainer>
						</ADD.InputContainer>

						<APD.DividerGutter />

						<ADD.InputContainer>
							<APD.SecondaryHeaderContainer>
								<ADD.HeaderText>
									Sub-categories ({subcats.length})
								</ADD.HeaderText>

								<ADD.InfoText>Add additional pause reasons</ADD.InfoText>
							</APD.SecondaryHeaderContainer>
						</ADD.InputContainer>

						{/* Field to add new subcat */}
						{isAddNew ? (
							<NewSubcat
								subcats={subcats}
								handleAddSubcat={handleAddLocalSubcat}
								setIsAddNew={setIsAddNew}
							/>
						) : null}

						{/* Map to render existing subcats */}
						{subcats === null
							? null
							: subcats.map((sub, index) => {
									return (
										<Subcat
											key={index}
											id={index}
											subcats={subcats}
											setIsUpdating={setIsUpdating}
											sub={sub}
											handleRemoveSubcat={handleRemoveLocalSubcat}
											handleUpdateSubcatStateName={handleUpdateLocalSubcatName}
										/>
									);
							  })}

						<APD.NewButtonContainer>
							<APD.NewButton variant="contained" onClick={handleAddNewClick}>
								Add new
							</APD.NewButton>
						</APD.NewButtonContainer>
					</div>
				</ADD.DialogContent>
			</Dialog>
		</div>
	);
};

export default AddPauseDialog;
