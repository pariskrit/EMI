import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogTitle,
	LinearProgress,
	TextField,
	Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import CurveButton from "components/Elements/CurveButton";
import ColourConstants from "helpers/colourConstants";
import {
	generateErrorState,
	getLocalStorageData,
	handleValidateObj,
} from "helpers/utils";
import { editSiteAsset } from "services/clients/sites/siteAssets";
import { getSiteAssetReferences } from "services/clients/sites/siteAssets/references";
import EditDialogStyle from "styles/application/EditDialogStyle";
import * as yup from "yup";
import FunctionalLocations from "./FunctionalLocations";
import NewFunctionalLocations from "./NewFunctionalLocations";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	description: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ET = EditDialogStyle();
const defaultStateSchema = { name: "", description: "" };
const defaultErrorSchema = { name: null, description: null };

const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
	// Override for paper used in dialog
	paper: { minWidth: "90%" },
	inputContainer: {
		display: "flex",
		flexDirection: "column",
		marginBottom: 20,
		[media]: {
			width: "100%",
		},
	},
	infoText: {
		marginTop: 10,
		marginBottom: 10,
		fontFamily: "Roboto",
		color: ColourConstants.commonText,
		fontSize: 15,
	},
	header: {
		marginRight: "auto",
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: 21,
		color: ColourConstants.commonText,
	},
	headContainer: {
		width: "100%",
		display: "flex",
		marginBottom: 20,
		flexDirection: "column",
	},
}));

const EditAssetDialog = ({
	open,
	closeHandler,
	editData,
	handleEditData,
	getError,
}) => {
	const { classes, cx } = useStyles();
	const [loading, setLoading] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [isAddNew, setIsAddNew] = useState(false);
	const [functionalLocations, setFunctionalLocations] = useState([]);
	const { customCaptions } = getLocalStorageData("me");
	const dispatch = useDispatch();

	useEffect(() => {
		if (open && editData !== null) {
			setInput({ name: editData.name, description: editData.description });
		}
	}, [editData, open]);

	useEffect(() => {
		const fetchFunctionalLocations = async () => {
			setLoading(true);
			try {
				const response = await getSiteAssetReferences(editData.id);
				if (response.status) {
					setFunctionalLocations(response.data);
					setLoading(false);
				} else {
					throw new Error(response);
				}
			} catch (err) {
				setLoading(false);
				dispatch(showError(`Failed to fetch ${customCaptions?.asset}`));
			}
		};
		if (editData.id) fetchFunctionalLocations();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editData]);

	const closeOverride = () => {
		// Closing dialog
		setFunctionalLocations([]);
		closeHandler();
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);
		// Removing new subcat input
		setIsAddNew(false);
	};

	const handleUpdateData = async (d) => {
		try {
			let result = await editSiteAsset(editData.id, [
				{ op: "replace", path: "name", value: d.name },
				{ op: "replace", path: "description", value: d.description },
			]);
			if (result.status) {
				handleEditData({
					id: editData.id,
					name: input.name,
					description: input.description,
					references: editData.references,
				});

				return { success: true };
			} else {
				if (result.data.detail) {
					getError(result.data.detail);
					setInput({ name: editData.name, description: editData.description });
					return {
						success: false,
					};
				} else {
					return { success: false, errors: { ...result.data.errors } };
				}
			}
		} catch (err) {
			throw new Error(err.response);
		}
	};

	const handleSave = async () => {
		// Adding progress indicator
		setLoading(true);

		// Cleaning any existing errors
		setErrors(defaultErrorSchema);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const updatedData = await handleUpdateData({
					id: editData.id,
					name: input.name,
					description: input.description,
				});
				if (updatedData.success) {
					setLoading(false);
				} else {
					setErrors({ ...errors, ...updatedData.errors });
					setLoading(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setLoading(false);
			}
		} catch (err) {
			setLoading(false);
			closeOverride();
		}
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	const handleAddNewClick = () => {
		setIsAddNew(true);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInput((th) => ({ ...th, [name]: value }));
	};

	// Append added data
	const handleAddFunctional = (dd) => {
		const newData = [...functionalLocations, dd];
		setFunctionalLocations(newData);
	};

	// Update the state with updated data
	const handleUpdateFuncLoc = (val) => {
		const mainData = [...functionalLocations];
		const index = mainData.findIndex((x) => x.id === val.id);
		mainData[index] = val;
		setFunctionalLocations(mainData);
	};

	// Filtering the deleted item
	const handleRemoveFuncLoc = (id) => {
		const dat = [...functionalLocations].filter((x) => x.id !== id);
		setFunctionalLocations(dat);
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
			<ET.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					<ET.HeaderText>Edit {customCaptions?.asset ?? "Asset"}</ET.HeaderText>
				</DialogTitle>
				<ET.ButtonContainer>
					<ET.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ET.CancelButton>
					<ET.ConfirmButton variant="contained" onClick={handleSave}>
						Save
					</ET.ConfirmButton>
				</ET.ButtonContainer>
			</ET.ActionContainer>
			<ET.DialogContent id="parentDiv">
				<div>
					<ET.InputContainer>
						<ET.LeftInputContainer>
							<div className={classes.inputContainer}>
								<ET.NameLabel>
									{customCaptions?.asset ?? "Asset"}
									<ET.RequiredStar>*</ET.RequiredStar>
								</ET.NameLabel>
								<TextField
									sx={{
										"& .MuiInputBase-input.Mui-disabled": {
											WebkitTextFillColor: "#000000",
										},
									}}
									name="name"
									error={errors.name === null ? false : true}
									helperText={errors.name === null ? null : errors.name}
									variant="outlined"
									size="small"
									value={input.name}
									autoFocus
									onKeyDown={handleEnterPress}
									fullWidth
									onChange={handleChange}
								/>
							</div>
						</ET.LeftInputContainer>

						<ET.RightInputContainer>
							<div className={classes.inputContainer}>
								<ET.NameLabel>
									Description<ET.RequiredStar>*</ET.RequiredStar>
								</ET.NameLabel>
								<TextField
									sx={{
										"& .MuiInputBase-input.Mui-disabled": {
											WebkitTextFillColor: "#000000",
										},
									}}
									name="description"
									error={errors.description === null ? false : true}
									helperText={
										errors.description === null ? null : errors.description
									}
									variant="outlined"
									size="small"
									value={input.description}
									autoFocus
									onKeyDown={handleEnterPress}
									fullWidth
									onChange={handleChange}
								/>
							</div>
						</ET.RightInputContainer>
					</ET.InputContainer>
				</div>

				<div className={classes.headContainer}>
					<div className={classes.header}>
						{customCaptions?.assetReferencePlural ?? "Functional Locations"} (
						{functionalLocations.length})
					</div>

					<Typography className={classes.infoText}>
						Add additional References
					</Typography>
				</div>

				{functionalLocations
					.sort((a, b) => a.id - b.id)
					.map((x, index) => (
						<FunctionalLocations
							setLoading={setLoading}
							sub={x}
							key={`${x.name}${index}`}
							handleRemoveFuncLoc={handleRemoveFuncLoc}
							handleUpdateFuncLoc={handleUpdateFuncLoc}
							getError={getError}
						/>
					))}
				{isAddNew ? (
					<NewFunctionalLocations
						editData={editData}
						setLoading={setLoading}
						handleAddFunctional={handleAddFunctional}
						setIsAddNew={setIsAddNew}
						getError={getError}
					/>
				) : null}

				<CurveButton variant="contained" onClick={handleAddNewClick}>
					Add new
				</CurveButton>
			</ET.DialogContent>
		</Dialog>
	);
};

export default EditAssetDialog;
