import { CircularProgress, Grid, makeStyles } from "@material-ui/core";
import NavDetails from "components/Elements/NavDetails";
import React, { useCallback, useEffect, useState } from "react";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import RestoreIcon from "@material-ui/icons/Restore";
import { feedbackPath } from "helpers/routePaths";
import Notes from "./Notes";
import { useParams } from "react-router-dom";
import DefectImages from "./Images";
import { getLocalStorageData } from "helpers/utils";
import ChangeStatusPopup from "./ChangeStatusPopup";
import ColourConstants from "helpers/colourConstants";
import Details from "./details";
import { getFeedbackDetails } from "services/feedback/feedbackdetails";

const AT = ActionButtonStyle();
const media = "@media (max-width: 414px)";

const useStyles = makeStyles({
	restore: {
		border: "2px solid",
		borderRadius: "100%",
		height: "35px",
		width: "35px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#307ad6",
	},
	importButton: {
		background: "#ED8738",
	},
	buttons: {
		display: "flex",
		marginLeft: "auto",
		[media]: {
			marginLeft: "0px",
			flexDirection: "column",
			marginBottom: "10px",
			gap: "10px",
		},
	},
	wrapper: {
		display: "flex",
		[media]: {
			marginTop: "10px",
			justifyContent: "space-between",
			flexDirection: "column",
		},
	},
});

function FeedbackDetails() {
	const classes = useStyles();
	const { id } = useParams();
	const { customCaptions, siteAppID, siteID } = getLocalStorageData("me");
	const [showChangeStatus, setShowChangeStatus] = useState(false);
	const [details, setDetails] = useState({});
	const [loading, setLoading] = useState(true);

	const handleToggleChangeStatus = () => setShowChangeStatus((prev) => !prev);

	const fetchDefect = useCallback(async () => {
		const response = await getFeedbackDetails(id);

		if (response.status) setDetails(response.data);

		setLoading(false);
	}, [id]);

	useEffect(() => {
		fetchDefect(id);
	}, [fetchDefect, id]);

	if (loading) return <CircularProgress />;

	return (
		<div className="container">
			<ChangeStatusPopup
				open={showChangeStatus}
				onClose={handleToggleChangeStatus}
				setDetails={setDetails}
			/>
			<div className={"topContainerCustomCaptions"}>
				<NavDetails
					status={true}
					lastSaved={null}
					staticCrumbs={[
						{
							id: 1,
							name: customCaptions?.feedback || "Feedback",
							url: feedbackPath,
						},
						{
							id: 2,
							name: details.number,
						},
					]}
					hideLastLogin
					state={{
						modelStatusName: details?.statusName,
						statusColor:
							details.statusType === "C"
								? ColourConstants.green
								: ColourConstants.red,
					}}
					hideVersion={true}
				/>
				<div className={classes.wrapper}>
					<div className={classes.buttons}>
						<AT.GeneralButton
							onClick={handleToggleChangeStatus}
							className={classes.importButton}
						>
							Change Status
						</AT.GeneralButton>
					</div>
					<div className="restore">
						<RestoreIcon className={classes.restore} />
					</div>
				</div>
			</div>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Details
						details={details}
						siteAppID={siteAppID}
						siteId={siteID}
						captions={customCaptions}
						feedbackId={id}
					/>
				</Grid>
				<Grid item xs={12} lg={6}>
					<DefectImages feedbackId={id} captions={customCaptions} />
				</Grid>
				<Grid item xs={12} lg={6}>
					<Notes feedbackId={id} />
				</Grid>
			</Grid>
		</div>
	);
}

export default FeedbackDetails;
