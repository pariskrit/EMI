import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Grid,
	InputAdornment,
	TextField,
	Typography,
} from "@material-ui/core";
import ColourConstants from "../../helpers/colourConstants";
import ArrowIcon from "../../assets/icons/arrowIcon.svg";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
		width: "99%",
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
const CompanyDetails = () => {
	const classes = useStyles();
	const [companyDetails, setCompanyDetails] = useState({
		company_name: "",
		licence_type: { label: "Total Users", value: 0 },
		total_liscense: null,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCompanyDetails((detail) => ({
			...detail,
			[name]: value,
		}));
	};

	return (
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
					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Company Name<span style={{ color: "red" }}>*</span>
						</Typography>
						<TextField
							name="company_name"
							variant="outlined"
							fullWidth
							InputProps={{
								classes: {
									input: classes.inputText,
								},
							}}
							onChange={handleInputChange}
							value={companyDetails.company_name}
						/>
					</Grid>
					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Licence Type<span style={{ color: "red" }}>*</span>
						</Typography>

						<Autocomplete
							id="combo-box-demo"
							onChange={(e, value) =>
								setCompanyDetails((th) => ({ ...th, licence_type: value }))
							}
							options={[
								{ label: "Total Users", value: 0 },
								{ label: "Concurrent Users", value: 1 },
								{ label: "Per Job", value: 2 },
								{ label: "Site-Based Licencing", value: 3 },
							]}
							getOptionLabel={(option) => option.label}
							getOptionSelected={(option, value) =>
								option.label === value.label
							}
							value={companyDetails.licence_type}
							renderInput={(params) => (
								<TextField
									name="licence_type"
									{...params}
									fullWidth
									variant="outlined"
									InputProps={{
										...params.InputProps,
										classes: {
											input: classes.inputText,
										},
										endAdornment: (
											<InputAdornment style={{ marginRight: -50 }}>
												<img
													alt="Expand icon"
													src={ArrowIcon}
													className={classes.expandIcon}
												/>
											</InputAdornment>
										),
									}}
								/>
							)}
						/>
					</Grid>
					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Total Liscense Count<span style={{ color: "red" }}>*</span>
						</Typography>
						<TextField
							disabled={
								companyDetails.licence_type.label !== "Site-Based Licencing"
							}
							type="number"
							variant="outlined"
							fullWidth
							InputProps={{
								classes: {
									input: classes.inputText,
								},
							}}
						/>
					</Grid>
					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Registration Date<span style={{ color: "red" }}>*</span>
						</Typography>
						<TextField
							id="date"
							variant="outlined"
							fullWidth
							type="date"
							defaultValue="2017-05-24"
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

					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Registered By<span style={{ color: "red" }}>*</span>
						</Typography>
						<TextField
							value="Russel Harland"
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
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
};

export default CompanyDetails;
