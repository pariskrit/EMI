import React, { useEffect, useState } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import EMICheckbox from "components/Elements/EMICheckbox";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { CircularProgress, Grid } from "@material-ui/core";
import { useParams } from "react-router";
import { patchApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import TextAreaInputField from "components/Elements/TextAreaInputField";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";

const useStyles = makeStyles((theme) => ({
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
}));
function ServiceOptions({ details, setError, loading }) {
	const classes = useStyles();
	const { appId } = useParams();
	const [checkLists, setCheckLists] = useState({});

	const onServiceUserConfirmationChange = async (e) => {
		const { showServiceUserConfirmation } = checkLists;
		setCheckLists({
			...checkLists,
			showServiceUserConfirmation: !showServiceUserConfirmation,
		});
		const result = await patchApplicationDetail(appId, [
			{
				op: "replace",
				path: "showServiceUserConfirmation",
				value: !showServiceUserConfirmation,
			},
		]);

		if (!result.status) {
			setError(result.data.detail);
		}
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

		if (!result.status) {
			setError(result.data.detail);
		}
	};

	useEffect(() => {
		if (Object.keys(details).length > 0) {
			const {
				raisingDefectCopiesTaskName,

				userConfirmationMessage,
			} = details;

			setCheckLists({
				raisingDefectCopiesTaskName,
				userConfirmationMessage,
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
							disabled={!checkLists.showServiceUserConfirmation}
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
										/>
									}
									label={
										<Typography className={classes.inputText}>
											Enable confirm user screen
										</Typography>
									}
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
