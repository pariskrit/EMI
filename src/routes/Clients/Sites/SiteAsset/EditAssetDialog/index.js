import {
	Dialog,
	DialogTitle,
	LinearProgress,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";
import CurveButton from "components/CurveButton";
import ColourConstants from "helpers/colourConstants";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import React, { useEffect, useState } from "react";
import { editSiteAsset } from "services/clients/sites/siteAssets";
import { getSiteAssetReferences } from "services/clients/sites/siteAssets/references";
import EditDialogStyle from "styles/application/EditDialogStyle";
import * as yup from "yup";
import FunctionalLocations from "./FunctionalLocations";
import NewFunctionalLocations from "./NewFunctionalLocations";
import DialogContentText from "@material-ui/core/DialogContentText";

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

const useStyles = makeStyles({
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
});

const EditAssetDialog = ({ open, closeHandler, editData, handleEditData }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [isAddNew, setIsAddNew] = useState(false);
	const [functionalLocations, setFunctionalLocations] = useState([]);

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
				console.log(err);
				setLoading(false);
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
		// Removing new subcat input
		setIsAddNew(false);
	};

	const handleUpdateData = async (d) => {
		try {
			let result = await editSiteAsset(editData.id, [
				{ op: "replace", path: "name", value: d.name },
				{ op: "replace", path: "description", value: d.description },
			]);
			if (result) {
				handleEditData({
					id: editData.id,
					name: input.name,
					description: input.description,
					references: editData.references,
				});

				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {
			if (
				err.response.data.detail !== null ||
				err.response.data.detail !== undefined
			) {
				setErrors({
					name: err.response.data.detail,
					description: err.response.data.detail,
				});
			} else {
				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}

			return { success: false };
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
					closeOverride();
				} else {
					setLoading(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setLoading(false);
			}
		} catch (err) {
			console.log(err.response);
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
		const newData = [dd, ...functionalLocations];
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
		<div>
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
						<ET.HeaderText>Edit Asset</ET.HeaderText>
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
				<ET.DialogContent>
					<div>
						<ET.InputContainer>
							<ET.LeftInputContainer>
								<div className={classes.inputContainer}>
									<ET.NameLabel>
										Name<ET.RequiredStar>*</ET.RequiredStar>
									</ET.NameLabel>
									<TextField
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
							Functional Locations ({functionalLocations.length})
						</div>

						<Typography className={classes.infoText}>
							Add additional References
						</Typography>
					</div>
					{isAddNew ? (
						<NewFunctionalLocations
							editData={editData}
							setLoading={setLoading}
							handleAddFunctional={handleAddFunctional}
							setIsAddNew={setIsAddNew}
						/>
					) : null}

					{functionalLocations.map((x, index) => (
						<FunctionalLocations
							setLoading={setLoading}
							sub={x}
							key={`${x.name}${index}`}
							handleRemoveFuncLoc={handleRemoveFuncLoc}
							handleUpdateFuncLoc={handleUpdateFuncLoc}
						/>
					))}

					<CurveButton variant="contained" onClick={handleAddNewClick}>
						Add new
					</CurveButton>
				</ET.DialogContent>
			</Dialog>
		</div>
	);
};

export default EditAssetDialog;
