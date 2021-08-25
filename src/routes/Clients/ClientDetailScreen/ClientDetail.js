import React, { useEffect, useState } from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Grid,
	InputAdornment,
	TextField,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import Dropdown from "components/Dropdown";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import API from "helpers/api";
import { changeDate } from "helpers/date";

const options = [
	{ label: "Total Users", value: 0 },
	{ label: "Concurrent Users", value: 1 },
	{ label: "Per Job", value: 2 },
	{ label: "Site-Based Licencing", value: 3 },
];

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

const useStyles = makeStyles((theme) => ({
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

const ClientDetail = ({ clientId, clientData, getError }) => {
	const classes = useStyles();
	const [clientDetail, setClientDetail] = useState({});
	const [changedState, setChange] = useState({});
	// This state is used to check current state data with pervious

	useEffect(() => {
		const licenseType = options.find((x) => x.value === clientData.licenseType);
		const data = {
			name: clientData.name,
			licenseType,
			licenses: clientData.licenses,
			registeredBy: clientData.registeredBy,
			registeredDate: clientData.registeredDate,
		};
		setClientDetail(data);
		setChange(data);
	}, [clientData]);

	const changeClientDetails = async (path, value) => {
		try {
			const result = await API.patch(`${BASE_API_PATH}Clients/${clientId}`, [
				{ op: "replace", path, value },
			]);
			if (result?.status === 200) {
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
		if (name === "licenseType") {
			if (value?.label !== clientDetail?.licenseType?.label) {
				changeClientDetails("licenseType", value.value);
			}
		}
		setClientDetail((detail) => ({
			...detail,
			[name]: value,
		}));
	};

	// OnBlur Company Name and Liscenses count
	const handleApiCall = (name, value) => {
		if (changedState[`${name}`] !== value) changeClientDetails(name, value);
	};

	const disabledLicenses = () => {
		if (clientDetail?.licenseType?.label === "Total Users") {
			return false;
		}
		if (clientDetail?.licenseType?.label === "Concurrent Users") {
			return false;
		}
		return true;
	};

	return (
		<>
			<Accordion className={classes.detailAccordion} expanded={true}>
				<AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
					<div>
						<Typography className={classes.sectionHeading}>
							Company Details
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<Grid container spacing={5}>
						<Grid item sm={12}>
							<Typography className={classes.labelText}>
								Company Name<span style={{ color: "#E31212" }}>*</span>
							</Typography>
							<TextField
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
								value={clientDetail.name}
							/>
						</Grid>
						<Grid item sm={6}>
							<Typography className={classes.labelText}>
								Licence Type<span style={{ color: "#E31212" }}>*</span>
							</Typography>
							<Dropdown
								options={options}
								selectedValue={clientDetail.licenseType}
								onChange={(value) => handleInputChange("licenseType", value)}
								label=""
								required={true}
								width="100%"
							/>
						</Grid>
						<Grid item sm={6}>
							<Typography className={classes.labelText}>
								Total Licence Count<span style={{ color: "#E31212" }}>*</span>
							</Typography>
							<TextField
								name="licenses"
								disabled={disabledLicenses()}
								type="number"
								variant="outlined"
								fullWidth
								InputProps={{
									classes: {
										input: classes.inputText,
									},
								}}
								value={clientDetail.licenses || ""} // String to integer using '+'
								onChange={(e) => handleInputChange("licenses", +e.target.value)}
								onBlur={(e) => handleApiCall("licenses", +e.target.value)}
							/>
						</Grid>
						<Grid item sm={6}>
							<Typography className={classes.labelText}>
								Registered By<span style={{ color: "#E31212" }}>*</span>
							</Typography>
							<TextField
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
					</Grid>
				</AccordionDetails>
			</Accordion>
		</>
	);
};

export default ClientDetail;
