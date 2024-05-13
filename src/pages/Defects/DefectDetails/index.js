import { CircularProgress, Grid } from "@mui/material";
import NavDetails from "components/Elements/NavDetails";
import React, { useCallback, useEffect, useState } from "react";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import RestoreIcon from "@mui/icons-material/Restore";
import { appPath, defectsPath } from "helpers/routePaths";
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
import AccessWrapper from "components/Modules/AccessWrapper";
import { HistoryCaptions, NoReadOnly } from "helpers/constants";
import { READONLY_ACCESS } from "constants/AccessTypes/AccessTypes";
import { makeStyles } from "tss-react/mui";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { useDispatch, useSelector } from "react-redux";
import { defectsPage } from "services/History/models";
import { setHistoryDrawerState } from "redux/common/actions";

const AT = ActionButtonStyle();
const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
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
}));

function DefectsDetails() {
	const { classes, cx } = useStyles();
	const { id } = useParams();
	const importButton = {
		"&.MuiButton-root": {
			backgroundColor: "#ED8738",
		},
	};
	const { customCaptions, siteAppID, application, position } =
		getLocalStorageData("me");
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

	const readOnly = position?.defectAccess === READONLY_ACCESS;
	const dispatch = useDispatch();
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);
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
			<HistoryBar
				id={id}
				showhistorybar={isHistoryDrawerOpen}
				dispatch={dispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					defectsPage(id, pageNumber, pageSize)
				}
				origin={HistoryCaptions.defects}
			/>
			<div className={"topContainerCustomCaptions"}>
				<NavDetails
					status={true}
					lastSaved={null}
					staticCrumbs={[
						{
							id: 1,
							name: customCaptions?.defectPlural || "Defects",
							url: `${appPath}${defectsPath}`,
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
					<AccessWrapper
						access={position?.defectAccess}
						accessList={NoReadOnly}
					>
						<div className={classes.buttons}>
							<AT.GeneralButton
								sx={importButton}
								onClick={handleToggleChangeStatus}
								className={classes.importButton}
							>
								Change Status
							</AT.GeneralButton>
						</div>
					</AccessWrapper>
					<div
						className="restore"
						onClick={() => dispatch(setHistoryDrawerState(true))}
					>
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
						isReadOnly={readOnly}
					/>
				</Grid>
				<Grid item xs={12} lg={6}>
					<Grid item xs={12}>
						<DefectImages
							defectId={id}
							captions={customCaptions}
							isReadOnly={readOnly}
						/>
					</Grid>

					<Grid item xs={12} style={{ marginTop: "16px" }}>
						<Notes defectId={id} isReadOnly={readOnly} />
					</Grid>
				</Grid>
				<Grid item xs={12} lg={6}>
					{details?.audioURL && (
						<Grid item xs={12} style={{ marginBottom: "16px" }}>
							<Audio
								src={details?.audioURL}
								defectId={id}
								isReadOnly={readOnly}
							/>
						</Grid>
					)}
					{application?.showDefectParts && (
						<Grid item xs={12}>
							<Parts
								captions={customCaptions}
								defectId={id}
								isReadOnly={readOnly}
							/>
						</Grid>
					)}
				</Grid>
			</Grid>
		</div>
	);
}

export default DefectsDetails;
