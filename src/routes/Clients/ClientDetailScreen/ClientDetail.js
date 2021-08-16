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
import React, { useEffect, useState } from "react";
import ErrorDialog from "components/ErrorDialog";

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

const detail = {
	name: "",
	licenseType: { label: "", value: "" },
	licenses: 0,
	registeredBy: "",
	registeredDate: "11/11/2019",
};

const ClientDetail = ({ clientId, options, clientData }) => {
	const classes = useStyles();
	const [clientDetail, setClientDetail] = useState(detail);
	const [error, setError] = useState({ message: "", status: false });

	useEffect(() => {
		setClientDetail(clientData);
	}, [clientData]);

	const changeClientDetails = async (path, value) => {
		try {
			const result = await API.patch(`${BASE_API_PATH}Clients/${clientId}`, [
				{ op: "replace", path, value },
			]);
			if (result.status === 200) {
				return true;
			} else {
				throw new Error(result);
			}
		} catch (err) {
			//console.log(err);
			if (err.response.data.detail) {
				setError({ status: true, message: err.response.data.detail });
			}
			if (err.response.data.errors.name) {
				setError({ status: true, message: err.response.data.errors.name[0] });
			}
			return err;
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setClientDetail((detail) => ({
			...detail,
			[name]: value,
		}));
	};

	const handleLicenceType = (value) => {
		changeClientDetails("licenseType", value.value);
		setClientDetail((th) => ({
			...th,
			licenseType: value,
		}));
	};

	const disabledLicenses = () => {
		if (clientDetail.licenseType.label === "Total Users") {
			return false;
		}
		if (clientDetail.licenseType.label === "Concurrent Users") {
			return false;
		}
		return true;
	};

	return (
		<>
			<ErrorDialog
				open={error.status}
				handleClose={() => setError((e) => ({ message: "", status: false }))}
				message={error.message}
			/>
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
								onChange={handleInputChange}
								value={clientDetail.name}
								onBlur={(e) =>
									changeClientDetails(e.target.name, e.target.value)
								}
							/>
						</Grid>
						<Grid item sm={6}>
							<Typography className={classes.labelText}>
								Licence Type<span style={{ color: "#E31212" }}>*</span>
							</Typography>
							<Dropdown
								options={options}
								selectedValue={clientDetail.licenseType}
								onChange={(value) => handleLicenceType(value)}
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
								value={clientDetail.licenses || ""}
								onChange={handleInputChange}
								onBlur={(e) =>
									changeClientDetails(e.target.name, e.target.value)
								}
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
