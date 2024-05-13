import { CircularProgress, Grid } from "@mui/material";
import NavDetails from "components/Elements/NavDetails";
import React, { useCallback, useEffect, useState } from "react";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import RestoreIcon from "@mui/icons-material/Restore";
import { appPath, feedbackPath } from "helpers/routePaths";
import Notes from "./Notes";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import DefectImages from "./Images";
import { getLocalStorageData } from "helpers/utils";
import ChangeStatusPopup from "./ChangeStatusPopup";
import ColourConstants from "helpers/colourConstants";
import Details from "./details";
import AccessWrapper from "components/Modules/AccessWrapper";
import { getFeedbackDetails } from "services/feedback/feedbackdetails";
import TabTitle from "components/Elements/TabTitle";
import { HistoryCaptions, NoReadOnly } from "helpers/constants";
import { READONLY_ACCESS } from "constants/AccessTypes/AccessTypes";
import { makeStyles } from "tss-react/mui";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { useDispatch, useSelector } from "react-redux";
import { feedBackPage } from "services/History/models";
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

function FeedbackDetails() {
	const { classes, cx } = useStyles();
	const { id } = useParams();
	const { customCaptions, siteAppID, siteID, application } =
		getLocalStorageData("me");
	//to  check url
	const navigate = useNavigate();
	const { search, pathname } = useLocation();

	const query = new URLSearchParams(search);
	const siteAppIdFromUrl = parseInt(query.get("siteAppId"));
	const isSameSiteAppId = siteAppIdFromUrl === siteAppID;
	useEffect(() => {
		if (siteAppIdFromUrl && isSameSiteAppId) {
			fetchDefect();
			return;
		}
		if (siteAppIdFromUrl && !isSameSiteAppId) {
			navigate(`/login?redirectUrl=${pathname}${search}`, {
				state: { from: search },
			});
		}
	}, [siteAppIdFromUrl, id, isSameSiteAppId]);

	const [showChangeStatus, setShowChangeStatus] = useState(false);
	const [details, setDetails] = useState({});
	const [loading, setLoading] = useState(true);

	const { position } = sessionStorage.getItem("me")
		? JSON.parse(sessionStorage.getItem("me"))
		: {};

	const handleToggleChangeStatus = () => setShowChangeStatus((prev) => !prev);

	const fetchDefect = useCallback(async () => {
		const response = await getFeedbackDetails(id);

		if (response.status) setDetails(response.data);

		setLoading(false);
	}, [id]);

	useEffect(() => {
		if (!siteAppIdFromUrl) {
			fetchDefect(id);
		}
	}, [fetchDefect, id, siteAppIdFromUrl]);

	const readOnly = position?.feedbackAccess === READONLY_ACCESS;
	const importButton = { backgroundColor: "#ED8738" };
	const dispatch = useDispatch();
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);
	if (loading) return <CircularProgress />;

	return (
		<div className="container">
			<TabTitle
				title={`${customCaptions.feedback} ${details.number} | ${application.name}`}
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
					feedBackPage(id, pageNumber, pageSize)
				}
				origin={HistoryCaptions.feedback}
			/>
			<div className={"topContainerCustomCaptions"}>
				<NavDetails
					status={true}
					lastSaved={null}
					staticCrumbs={[
						{
							id: 1,
							name: customCaptions?.feedback || "Feedback",
							url: appPath + feedbackPath,
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
					showCreatedByAt
					time={details.createdDateTime}
					userName={details.createdUserName}
				/>
				<div className={classes.wrapper}>
					<AccessWrapper
						access={position?.feedbackAccess}
						accessList={NoReadOnly}
					>
						<div className={classes.buttons}>
							<AT.GeneralButton
								style={importButton}
								onClick={handleToggleChangeStatus}
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
						siteId={siteID}
						captions={customCaptions}
						feedbackId={id}
						isReadOnly={readOnly}
					/>
				</Grid>
				<Grid item xs={12} lg={6}>
					<DefectImages
						feedbackId={id}
						captions={customCaptions}
						isReadOnly={readOnly}
					/>
				</Grid>
				<Grid item xs={12} lg={6}>
					<Notes feedbackId={id} isReadOnly={readOnly} />
				</Grid>
			</Grid>
		</div>
	);
}

export default FeedbackDetails;
