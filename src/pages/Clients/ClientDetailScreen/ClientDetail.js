import React, { useEffect, useState } from "react";
import {
	Grid,
	InputAdornment,
	TextField,
	Typography,
	CircularProgress,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";
import UserRoles from "helpers/roles";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import ColourConstants from "helpers/colourConstants";
import { changeDate } from "helpers/date";
import AccordionBox from "components/Layouts/AccordionBox";
import { clientOptions, shareModelsOptions } from "helpers/constants";
import { updateClientDetails } from "services/clients/clientDetailScreen";
import Dropdown from "components/Elements/Dropdown";

// const debounce = (func, delay) => {
// 	let timer;
// 	return function () {
// 		let self = this;
// 		let args = arguments;
// 		clearTimeout(timer);
// 		timer = setTimeout(() => {
// 			func.apply(self, args);
// 		}, delay);
// 	};
// };

const useStyles = makeStyles()((theme) => ({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
	detailAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "100%",
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
	},
	inputText: {
		fontSize: 14,
	},
}));

const ClientDetail = ({
	clientId,
	clientData,
	getError,
	loading,
	role,
	adminType,
}) => {
	const { classes, cx } = useStyles();
	const [clientDetail, setClientDetail] = useState({});
	const [changedState, setChange] = useState({});
	// This state is used to check current state data with pervious

	useEffect(() => {
		const licenseType = clientOptions.find(
			(x) => x.value === (clientData?.licenseType ?? clientData[0]?.licenseType)
		);

		const shareModelType = shareModelsOptions.find(
			(x) => x.value === (clientData?.shareModels ?? clientData[0]?.shareModels)
		);
		const data = {
			name: clientData?.name ?? clientData[0]?.name,
			licenseType,
			licenses: clientData?.licenses ?? clientData[0]?.licenses,
			registeredBy: clientData?.registeredBy ?? clientData[0]?.registeredBy,
			registeredDate:
				clientData?.registeredDate ?? clientData[0]?.registeredDate,
			shareModels: shareModelType,
		};
		setClientDetail(data);
		setChange(data);
	}, [clientData]);

	const changeClientDetails = async (path, value) => {
		try {
			const result = await updateClientDetails(clientId, [
				{ op: "replace", path, value },
			]);
			if (result.status) {
				setChange(result.data);
				return true;
			} else {
				throw new Error(result);
			}
		} catch (err) {
			if (err?.response?.data?.detail) {
				getError(err.response.data.detail);
			}
			if (err?.response?.data?.errors?.name) {
				getError(err.response.data.errors.name[0]);
			}
			return err;
		}
	};

	// const debounceDropDown = useCallback(
	// 	debounce((name, val) => {
	// 		// Check previous data with current data and then patch
	// 		if (changedState[`${name}`] !== val) changeClientDetails(name, val);
	// 	}, 1000),
	// 	[changedState]
	// );

	const handleInputChange = (name, value) => {
		setClientDetail((detail) => ({
			...detail,
			[name]: value,
		}));
	};

	// handling license type dropdown input change and call update api function
	const handleShareModelChange = (path, value) => {
		setClientDetail((detail) => ({
			...detail,
			[path]: value,
		}));

		const { value: modelShareValue } = value;
		handleApiCall("shareModels", modelShareValue);
	};

	// OnBlur Company Name and Liscenses count
	const handleApiCall = (name, value) => {
		if (changedState[`${name}`] !== value) changeClientDetails(name, value);
	};

	return (
		<AccordionBox
			title="Company Details"
			noExpand={true}
			accordionClass="companyDetail"
		>
			{loading ? (
				<CircularProgress />
			) : (
				<Grid container spacing={5} className="companyDetailGrid">
					<Grid item sm={12}>
						<Typography className={classes.labelText}>
							Company Name<span style={{ color: "#E31212" }}>*</span>
						</Typography>
						<TextField
							sx={{
								"& .MuiInputBase-input.Mui-disabled": {
									WebkitTextFillColor: "#000000",
								},
							}}
							name="name"
							variant="outlined"
							fullWidth
							InputProps={{
								classes: {
									input: classes.inputText,
								},
							}}
							onChange={(e) => handleInputChange("name", e.target.value)}
							onBlur={(e) => handleApiCall("name", e.target.value)}
							value={clientDetail.name || ""}
						/>
					</Grid>

					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Registered By<span style={{ color: "#E31212" }}>*</span>
						</Typography>
						<TextField
							sx={{
								"& .MuiInputBase-input.Mui-disabled": {
									WebkitTextFillColor: "#000000",
								},
							}}
							value={clientDetail.registeredBy || ""}
							variant="outlined"
							fullWidth
							InputProps={{
								classes: {
									input: classes.inputText,
								},
								readOnly: true,
							}}
						/>
					</Grid>
					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Registration Date<span style={{ color: "#E31212" }}>*</span>
						</Typography>
						<TextField
							sx={{
								"& .MuiInputBase-input.Mui-disabled": {
									WebkitTextFillColor: "#000000",
								},
							}}
							id="date"
							variant="outlined"
							fullWidth
							type="date-local"
							value={changeDate(clientDetail.registeredDate)}
							InputProps={{
								classes: {
									input: classes.inputText,
								},
								readOnly: true,
								startAdornment: (
									<InputAdornment style={{ marginRight: 10 }}>
										<CalendarTodayOutlinedIcon
											style={{ fontSize: 19, marginTop: "-3px" }}
										/>
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment>
										<img
											alt="Expand icon"
											src={ArrowIcon}
											className={classes.expandIcon}
										/>
									</InputAdornment>
								),
							}}
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>

					<Grid item xs={6}>
						<Typography className={classes.labelText}>
							Model Sharing<span style={{ color: "#E31212" }}>*</span>
						</Typography>
						<Dropdown
							options={shareModelsOptions}
							selectedValue={clientDetail.shareModels}
							onChange={(value) => {
								handleShareModelChange("shareModels", value);
							}}
							label=""
							required={true}
							disabled={role !== UserRoles.superAdmin}
							width="100%"
						/>
					</Grid>
				</Grid>
			)}
		</AccordionBox>
	);
};

export default ClientDetail;
