import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField } from "@material-ui/core";
import AccordionBox from "components/Layouts/AccordionBox";
import { makeStyles } from "@material-ui/core/styles";
import Dropdown from "components/Elements/Dropdown";
import { siteApplicationOptions } from "helpers/constants";
import { useParams } from "react-router";
import { Facebook } from "react-spinners-css";
import { patchApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";

const useStyles = makeStyles((theme) => ({
	siteContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
}));

function License({ details }) {
	const classes = useStyles();
	const [input, setInput] = useState({});
	const [isUpdating, setIsUpdating] = useState(false);
	const { appId } = useParams();

	const onInputChange = (e) =>
		setInput({ ...input, [e.target.name]: e.target.value });

	const onDropDownInputChange = async (value) => {
		setInput({ ...input, licenseType: value.value });
		try {
			const result = await patchApplicationDetail(appId, [
				{
					op: "replace",
					path: "licenseType",
					value: value.value,
				},
			]);
			console.log(result);
		} catch (error) {
			console.log(error);
		}
	};

	const updateInput = async () => {
		if (details.licenses === input.licenses) {
			return;
		}
		setIsUpdating(true);
		try {
			const result = await patchApplicationDetail(appId, [
				{
					op: "replace",
					path: "licenses",
					value: input.licenses,
				},
			]);
			console.log(result);
		} catch (error) {
			console.log(error);
		} finally {
			setIsUpdating(false);
		}
	};

	const onEnterKeyPress = (e) => {
		if (e.key === "Enter") {
			updateInput();
		}
	};

	useEffect(() => {
		if (Object.keys(details).length > 0) {
			setInput(details);
		}
	}, [details]);
	return (
		<AccordionBox title="License">
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">Licence Type</Typography>
						<Dropdown
							options={siteApplicationOptions}
							label=""
							width="auto"
							selectedValue={siteApplicationOptions[input?.licenseType]}
							onChange={onDropDownInputChange}
						/>
					</div>
				</Grid>
				<Grid item xs={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">Total Licence Count</Typography>
						<TextField
							name="licenses"
							value={input?.licenses ?? 0}
							InputProps={{
								endAdornment: isUpdating ? (
									<Facebook size={20} color="#A79EB4" />
								) : null,
							}}
							fullWidth
							type="number"
							variant="outlined"
							onChange={onInputChange}
							onBlur={updateInput}
							onKeyDown={onEnterKeyPress}
							disabled={input.licenseType === 2}
						/>
					</div>
				</Grid>
			</Grid>
		</AccordionBox>
	);
}

export default License;
