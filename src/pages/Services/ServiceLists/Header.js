import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { withStyles } from "@mui/styles";
import { Tooltip } from "@mui/material";
import NavDetails from "components/Elements/NavDetails";
import Icon from "components/Elements/Icon";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import { serviceGraph } from "helpers/routePaths";
import { useNavigate } from "react-router-dom";
import AccessWrapper from "components/Modules/AccessWrapper";
import { NoReadOnly, statusTypeClassification } from "helpers/constants";
import CircularProgress from "@mui/material/CircularProgress";
import PrintIcon from "assets/printer.svg";
import {
	fileDownload,
	getFileNameFromContentDispositonHeader,
} from "helpers/utils";
import { getServiceListReport } from "services/reports/reports";
import { findWindows } from "windows-iana";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

const AT = ActionButtonStyle();

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

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
	importButton: { background: "#ED8738" },
}));

const importButton = {
	"&.MuiButton-root": {
		backgroundColor: "#ED8738",
	},
};
function Header({
	setOpenAddService,
	setImportCSV,
	setOpenMultipleChnageStatusPopup,
	dataLength,
	MultipleChangeStatusDisabled,
	customCaptions,
	selectedServices,
	statusType,
	department,
	searchFilter,
	statusId,
	fromDate,
	toDate,
}) {
	// Init hooks
	const { classes } = useStyles();
	const navigate = useNavigate();
	const reduxDispatch = useDispatch();

	const [isDownloading, setIsDownloading] = useState(false);

	const { position } = sessionStorage.getItem("me")
		? JSON.parse(sessionStorage.getItem("me"))
		: {};
	const time = findWindows(Intl.DateTimeFormat().resolvedOptions().timeZone);

	const payload = {
		statusType:
			statusId === 2 || statusId === 1
				? statusTypeClassification[statusId]
				: "",
		department: department?.id,
		searchFilter,
		statusId: statusId === 2 || statusId === 1 ? "" : statusId,
		fromDate,
		toDate,
		timeZone: time?.[0]?.toString(),
	};

	const downloadReportHandler = async () => {
		try {
			setIsDownloading(true);

			const response = await getServiceListReport(payload);
			if (response?.status) {
				const fileName = getFileNameFromContentDispositonHeader(response);
				fileDownload(response, fileName);
				setIsDownloading(false);
			} else {
				const res = JSON.parse(await response?.data.text());
				reduxDispatch(
					showError(
						res?.detail || res.errors?.message || "Failed to download report."
					)
				);
			}
		} catch (err) {
			setIsDownloading(false);
			reduxDispatch(showError("Failed to download report."));
		}
	};

	return (
		<div className={"topContainerCustomCaptions"}>
			<NavDetails
				status={false}
				lastSaved={""}
				staticCrumbs={[
					{
						id: 1,
						name: `${customCaptions.servicePlural} (${dataLength})`,
						url: "",
					},
				]}
				hideLastLogin
				hideLastSave
				hideVersion={true}
			/>
			<div className={classes.wrapper}>
				<div className={classes.buttons}>
					<AccessWrapper
						access={position?.serviceAccess}
						accessList={NoReadOnly}
					>
						{MultipleChangeStatusDisabled && selectedServices.length > 0 ? (
							<HtmlTooltip
								title={`The status of your selected ${customCaptions.servicePlural} can not be changed as they are not the same status`}
							>
								<div>
									<AT.GeneralButton
										sx={importButton}
										onClick={() => setOpenMultipleChnageStatusPopup(true)}
										disabled={MultipleChangeStatusDisabled}
									>
										Change Status
									</AT.GeneralButton>
								</div>
							</HtmlTooltip>
						) : (
							<AT.GeneralButton
								sx={importButton}
								onClick={() => setOpenMultipleChnageStatusPopup(true)}
								disabled={MultipleChangeStatusDisabled}
							>
								Change Status
							</AT.GeneralButton>
						)}
					</AccessWrapper>

					<AccessWrapper
						access={position?.serviceAccess}
						accessList={NoReadOnly}
					>
						<AT.GeneralButton
							sx={importButton}
							className={classes.importButton}
							onClick={() => setImportCSV(true)}
						>
							Import from CSV
						</AT.GeneralButton>
					</AccessWrapper>

					<AT.GeneralButton onClick={() => navigate(serviceGraph)}>
						View Chart
					</AT.GeneralButton>

					<AccessWrapper
						access={position?.serviceAccess}
						accessList={NoReadOnly}
					>
						<AT.GeneralButton onClick={() => setOpenAddService(true)}>
							Add New
						</AT.GeneralButton>
					</AccessWrapper>
					{isDownloading ? (
						<CircularProgress />
					) : (
						<img
							alt="Print"
							src={PrintIcon}
							style={{ marginRight: "10px", width: "30px", height: "40px" }}
							className={classes.printIcon}
							onClick={downloadReportHandler}
						/>
					)}
				</div>
				{/* <div className="restore">
					<Icon className={classes.restore} name="Restore" />
				</div> */}
			</div>
		</div>
	);
}

export default Header;
