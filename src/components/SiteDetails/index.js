import { Grid, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmChangeDialog from "components/ConfirmChangeDialog";
import Dropdown from "components/Dropdown";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";

const options = [
	{ label: "Total Users", value: 0 },
	{ label: "Concurrent Users", value: 1 },
	{ label: "Per Job per Role", value: 2 },
	{ label: "Site-Based Licencing", value: 3 },
];

const useStyles = makeStyles((theme) => ({
	required: {
		color: "red",
	},
	siteContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
}));

const SiteDetails = ({ siteId, setError }) => {
	const classes = useStyles();
	const [siteDetails, setSiteDetails] = useState({ oldData: {}, newData: {} });
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [newInput, setNewInput] = useState({});
	const [isUpdating, setIsUpdating] = useState(false);

	const openConfirmChangeDialog = (e) => {
		console.log(newInput.value, siteDetails.oldData[newInput.label]);
		if (newInput.value === siteDetails.oldData[newInput.label]) {
			return;
		}

		setOpenConfirmDialog(true);
	};

	const closeConfirmChangeDialog = () => {
		setNewInput({});
		setOpenConfirmDialog(false);
	};

	const onInputChange = (e) => {
		setNewInput({ label: e.target.name, value: e.target.value });
		setSiteDetails({
			...siteDetails,
			newData: { ...siteDetails.newData, [e.target.name]: e.target.value },
		});
	};

	const setSelectedInputValue = (e) => {
		setNewInput({ label: e.target.name, value: e.target.value });
	};

	const onConfirmChange = async () => {
		setIsUpdating(true);
		try {
			const response = await API.patch(`${BASE_API_PATH}sites/${siteId}`, [
				{ op: "replace", path: newInput.label, value: newInput.value },
			]);
			setIsUpdating(false);
			setOpenConfirmDialog(false);

			if (response.status === 404 || response.status === 400) {
				throw new Error(response);
			}
		} catch (error) {
			// if (
			// 	error.response.data.errors !== undefined &&
			// 	error.response.data.detail === undefined
			// ) {
			// 	console.log(error.response.data.errors.name);
			// } else if (
			// 	error.response.data.errors !== undefined &&
			// 	error.response.data.detail !== undefined
			// ) {
			// 	console.log(error.response.data.detail.name);
			// } else {
			// 	console.log("Something went wrong!");
			// }
			setIsUpdating(false);
			setOpenConfirmDialog(false);
			setError("Something went wrong!");
		}
	};

	const fetchSiteDetails = async () => {
		try {
			const result = await API.get(`${BASE_API_PATH}sites/${siteId}`);
			console.log(result);
			setSiteDetails({ oldData: result.data, newData: result.data });
			setNewInput(result.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchSiteDetails();
	}, []);

	const { newData } = siteDetails;

	return (
		<>
			<ConfirmChangeDialog
				open={openConfirmDialog}
				isUpdating={isUpdating}
				closeHandler={closeConfirmChangeDialog}
				handleChangeConfirm={onConfirmChange}
			/>
			<Grid container spacing={2}>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Site name<span className={classes.required}>*</span>
						</Typography>
						<TextField
							name="name"
							fullWidth
							variant="outlined"
							value={newData?.name || ""}
							onChange={onInputChange}
							onBlur={openConfirmChangeDialog}
							onFocus={setSelectedInputValue}
						/>
					</div>
				</Grid>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Region<span className={classes.required}>*</span>
						</Typography>
						<Dropdown
							options={[
								{ label: "Nepal", value: 0 },
								{ label: "India", value: 2 },
							]}
							selectedValue={{ label: "Nepal", value: 0 }}
							label=""
							required={true}
							width="100%"
						/>
					</div>
				</Grid>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Company Name<span className={classes.required}>*</span>
						</Typography>
						<TextField
							name="companyName"
							fullWidth
							variant="outlined"
							value={newData?.company || ""}
							onBlur={openConfirmChangeDialog}
						/>
					</div>
				</Grid>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Address<span className={classes.required}>*</span>
						</Typography>
						<TextField
							name="address"
							fullWidth
							variant="outlined"
							value={newData?.address || ""}
							onBlur={openConfirmChangeDialog}
						/>
					</div>
				</Grid>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Business Number<span className={classes.required}>*</span>
						</Typography>
						<TextField
							name="address"
							fullWidth
							variant="outlined"
							value={newData?.businessNumber || ""}
							onBlur={openConfirmChangeDialog}
						/>
					</div>
				</Grid>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Licence Type<span className={classes.required}>*</span>
						</Typography>
						<Dropdown
							options={options}
							selectedValue={{ label: "Total Users", value: 0 }}
							label=""
							required={true}
							width="100%"
						/>
					</div>
				</Grid>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Total Licence Count<span className={classes.required}>*</span>
						</Typography>
						<TextField
							name="address"
							fullWidth
							type="number"
							variant="outlined"
							value={newData?.licenses || ""}
							onBlur={openConfirmChangeDialog}
						/>
					</div>
				</Grid>
			</Grid>
		</>
	);
};

const mapStateToProps = ({ commonData: { error } }) => ({ error });

const mapDispatchToProps = (dispatch) => ({
	setError: (message) => dispatch(showError(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteDetails);
