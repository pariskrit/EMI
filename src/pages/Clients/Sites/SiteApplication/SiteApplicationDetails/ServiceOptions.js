import React, { useEffect, useState } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import EMICheckbox from "components/Elements/EMICheckbox";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Typography from "@mui/material/Typography";
import { CircularProgress, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import {
	getSiteApplicationDetail,
	patchApplicationDetail,
} from "services/clients/sites/siteApplications/siteApplicationDetails";
import TextAreaInputField from "components/Elements/TextAreaInputField";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";

const useStyles = makeStyles()((theme) => ({
	detailsContainer: {
		marginTop: 15,
		display: "flex",
		justifyContent: "center",
	},
	inputText: {
		fontSize: 14,
	},
	tickContainer: {
		paddingTop: "3%",
	},
	tickInputContainer: {
		width: "fit-content",
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
	},
	cardContent: {
		maxWidth: "fit-content",
	},
	tickbox_label: {
		marginLeft: "0 !important",
	},
}));

function ServiceOptions({ details, setError, loading, dispatch, isReadOnly }) {
	const { classes, cx } = useStyles();
	const { appId } = useParams();
	const [checkLists, setCheckLists] = useState({});
	const [serviceLoading, setServiceLoading] = useState(false);

	const fetchSiteApplicationDetails = async () => {
		const result = await getSiteApplicationDetail(appId);

		if (result.status) {
			dispatch({
				type: "SET_SITE_APP_DETAIL",
				payload: result,
			});

			dispatch({
				type: "TOGGLE_ISACTIVE",
				payload: result.data.isActive,
			});
		}
	};

	const onServiceUserConfirmationChange = async (e) => {
		const { showServiceUserConfirmation } = checkLists;
		setServiceLoading(true);

		const result = await patchApplicationDetail(appId, [
			{
				op: "replace",
				path: "showServiceUserConfirmation",
				value: !showServiceUserConfirmation,
			},
		]);

		if (result.status) {
			setCheckLists({
				...checkLists,
				showServiceUserConfirmation: !showServiceUserConfirmation,
			});
			await fetchSiteApplicationDetails();
		}

		if (!result.status) {
			setError(result.data.detail);
		}
		setServiceLoading(false);
	};

	const onTextAreaChange = (e) => {
		setCheckLists({ ...checkLists, userConfirmationMessage: e.target.value });
	};

	const handleConfirmationMessageUpdate = async () => {
		const { userConfirmationMessage } = checkLists;

		if (details.userConfirmationMessage === userConfirmationMessage) {
			return;
		}
		const result = await patchApplicationDetail(appId, [
			{
				op: "replace",
				path: "userConfirmationMessage",
				value: userConfirmationMessage,
			},
		]);
		if (result.status) {
			await fetchSiteApplicationDetails();
		}

		if (!result.status) {
			setError(result.data.detail);
		}
	};

	useEffect(() => {
		if (Object.keys(details).length > 0) {
			const {
				raisingDefectCopiesTaskName,
				userConfirmationMessage,
				showServiceUserConfirmation,
			} = details;

			setCheckLists({
				raisingDefectCopiesTaskName,
				userConfirmationMessage,
				showServiceUserConfirmation,
			});
		}
	}, [details]);

	if (loading) {
		return (
			<AccordionBox title="Service Options">
				<CircularProgress />
			</AccordionBox>
		);
	}

	return (
		<div className={classes.detailsContainer}>
			<AccordionBox title="User Confirmation Statement">
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography gutterBottom className={classes.labelText}>
							Message
							<span style={{ color: "#E31212" }}>*</span>
						</Typography>
						<TextAreaInputField
							value={checkLists.userConfirmationMessage ?? ""}
							minRows={3}
							onChange={onTextAreaChange}
							onBlur={handleConfirmationMessageUpdate}
							disabled={!checkLists.showServiceUserConfirmation || isReadOnly}
						/>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.tickInputContainer}>
							<FormGroup className={classes.tickboxSpacing}>
								<FormControlLabel
									control={
										<EMICheckbox
											state={checkLists.showServiceUserConfirmation ?? false}
											changeHandler={onServiceUserConfirmationChange}
											disabled={serviceLoading || isReadOnly}
										/>
									}
									label={
										<Typography className={classes.inputText}>
											Enable confirm user screen
										</Typography>
									}
									className={classes.tickbox_label}
								/>
							</FormGroup>
						</div>
					</Grid>
				</Grid>
			</AccordionBox>
		</div>
	);
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
	setError: (message) => dispatch(showError(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceOptions);
