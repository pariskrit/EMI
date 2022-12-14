import { CircularProgress, Grid, makeStyles } from "@material-ui/core";
import NavDetails from "components/Elements/NavDetails";
import React, { useCallback, useEffect, useState } from "react";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import RestoreIcon from "@material-ui/icons/Restore";
import { defectsPath } from "helpers/routePaths";
import Notes from "./Notes";
import { useParams } from "react-router-dom";
import { getDefectDetail } from "services/defects/details";
import DefectImages from "./Images";
import { getLocalStorageData } from "helpers/utils";
import ChangeStatusPopup from "./ChangeStatusPopup";
import ColourConstants from "helpers/colourConstants";
import Details from "./details";
import Audio from "./Audio";
import Parts from "./Parts";
import TabTitle from "components/Elements/TabTitle";

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

function DefectsDetails() {
	const classes = useStyles();
	const { id } = useParams();
	const { customCaptions, siteAppID, application } = getLocalStorageData("me");
	const [showChangeStatus, setShowChangeStatus] = useState(false);
	const [details, setDetails] = useState({});
	const [loading, setLoading] = useState(true);

	const handleToggleChangeStatus = () => setShowChangeStatus((prev) => !prev);

	const fetchDefect = useCallback(async () => {
		const response = await getDefectDetail(id);

		if (response.status) setDetails(response.data);

		setLoading(false);
	}, [id]);

	useEffect(() => {
		fetchDefect(id);
	}, [fetchDefect, id]);

	if (loading) return <CircularProgress />;

	return (
		<div className="container">
			<TabTitle
				title={`${customCaptions.defect} ${details?.number} | ${application.name}`}
			/>
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
							name: customCaptions?.defectPlural || "Defects",
							url: defectsPath,
						},
						{
							id: 2,
							name: details.number,
						},
					]}
					hideLastLogin
					state={{
						modelStatusName: details?.defectStatusName,
						statusColor:
							details.defectStatusType === "C"
								? ColourConstants.green
								: ColourConstants.red,
					}}
					hideVersion={true}
					showCreatedByAt
					time={details.createdDateTime}
					userName={details.createdUserName}
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
						captions={customCaptions}
						defectId={id}
						fetchDefect={fetchDefect}
					/>
				</Grid>
				<Grid item xs={12} lg={6}>
					<Grid item xs={12}>
						<DefectImages defectId={id} captions={customCaptions} />
					</Grid>

					<Grid item xs={12} style={{ marginTop: "16px" }}>
						<Notes defectId={id} />
					</Grid>
				</Grid>
				<Grid item xs={12} lg={6}>
					{details?.audioURL && (
						<Grid item xs={12} style={{ marginBottom: "16px" }}>
							<Audio src={details?.audioURL} defectId={id} />
						</Grid>
					)}
					{application?.showDefectParts && (
						<Grid item xs={12}>
							<Parts captions={customCaptions} defectId={id} />
						</Grid>
					)}
				</Grid>
			</Grid>
		</div>
	);
}

export default DefectsDetails;
