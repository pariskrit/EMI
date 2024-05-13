import React, { useState } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import { Grid, Typography } from "@mui/material";
import { serviceStatus } from "constants/serviceDetails";
import ProgressBar from "components/Elements/ProgressBar";
import { statusOfServices } from "constants/serviceDetails";
import CircularProgress from "@mui/material/CircularProgress";
import CurveButton from "components/Elements/CurveButton";
import { makeStyles } from "tss-react/mui";

import Icon from "components/Elements/Icon";
import {
	fileDownload,
	getFileNameFromContentDispositonHeader,
	roundedToFixed,
} from "helpers/utils";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import GeneralButton from "components/Elements/GeneralButton";
import { findWindows } from "windows-iana";
import { getCompletedServiceReport } from "services/reports/reports";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

const AT = ActionButtonStyle();
const useStyles = makeStyles()((theme) => ({
	mainContainer: {
		display: "flex",
	},

	smallTxt: {
		fontFamily: "Roboto Condensed",
		fontWeight: "400",
		fontSize: "14px",
	},
	greenTxt: {
		fontFamily: "Roboto Condensed",
		fontWeight: "400",
		fontSize: "14px",
		color: "#24BA78",
	},
	inputText: {
		color: "#000000de",
	},
	custoomLabel: {
		display: "flex",
		alignItems: "center",
	},
	customLabelTxt: {
		display: "inline-flex",
		gap: 6,
	},
	resetButton: {
		backgroundColor: "#ED8738",
		marginTop: "-7px",
	},
	customGrid: {
		flexBasis: "60.67%",
		maxWidth: "60.67%",
	},
	loaderContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
}));
const labelText = {
	fontFamily: "Roboto Condensed",
	fontWeight: "bold",
	fontSize: "14px",
	marginBottom: "15px",
};

function ServiceInformation({
	classes,
	detail,
	customCaptions,
	setOpenChnageStatusPopup,
	isReadOnly,
	serviceId,
}) {
	const { classes: classess, cx } = useStyles();

	const [isLoading, setIsLoading] = useState(false);
	const reduxDispatch = useDispatch();

	const downloadServiceReport = async () => {
		setIsLoading(true);
		const time = findWindows(Intl.DateTimeFormat().resolvedOptions().timeZone);
		try {
			const response = await getCompletedServiceReport({
				serviceId,
				timeZone: time?.[0]?.toString(),
			});
			if (response?.status) {
				const fileName = getFileNameFromContentDispositonHeader(response);
				fileDownload(response, fileName);
				setIsLoading(false);
			} else {
				const res = JSON.parse(await response?.data.text());
				reduxDispatch(
					showError(
						res?.detail || res.errors?.message || "Failed to download report."
					)
				);
			}
		} catch (err) {
			setIsLoading(false);
			reduxDispatch(showError("Failed to download report."));
		}
	};

	return (
		<AccordionBox title={`${customCaptions?.service} Information`}>
			{/* <div className={classes.inputContainer}> */}
			<div style={{ display: "flex" }}>
				<Grid container spacing={5}>
					<Grid item lg={5} md={6} xs={12} className={classess.customGrid}>
						<Grid container wrap="nowrap">
							<Grid item>
								<Typography
									sx={labelText}
									className={cx(classess.labelText, classess.customLabelTxt)}
								>
									Status:
									<span style={{ display: "inline-flex", gap: 3 }}>
										<span>
											<Icon
												name={serviceStatus[detail?.status]}
												fontSize={"18px"}
											/>
										</span>
										<span
											className={classess.smallTxt}
											style={{ whiteSpace: "nowrap" }}
										>
											{statusOfServices(
												detail?.status,
												detail?.tasksSkipped,
												customCaptions
											)}
										</span>
									</span>
								</Typography>
							</Grid>

							<Grid item>
								<Typography>
									{!isReadOnly && detail?.status === "I" && (
										<span style={{ marginLeft: 30 }}>
											<AT.GeneralButton
												className={classess.resetButton}
												onClick={() => setOpenChnageStatusPopup(true)}
											>
												Reset {customCaptions?.service}
											</AT.GeneralButton>
										</span>
									)}
								</Typography>
							</Grid>
						</Grid>

						<Typography className={classess.labelText} sx={labelText}>
							Percentage Completed:
							<span
								className={classess.greenTxt}
								style={{
									color:
										detail?.percentageOverTime <= 5
											? "#23BB79"
											: detail?.percentageOverTime > 5 &&
											  detail?.percentageOverTime <= 10
											? "#ED8738"
											: "#E31212",
								}}
							>
								{roundedToFixed(detail?.percentageComplete, 0)}%
							</span>
							<ProgressBar
								value={detail?.percentageComplete}
								height={"8px"}
								isLabelVisible={false}
								width={"150%"}
								bgColour={
									detail?.percentageOverTime <= 5
										? "#23BB79"
										: detail?.percentageOverTime > 5 &&
										  detail?.percentageOverTime <= 10
										? "#ED8738"
										: "#E31212"
								}
							/>
						</Typography>
						<Typography className={classess.labelText} sx={labelText}>
							Percentage Time Over/Under:
							<span
								className={classess.greenTxt}
								style={{
									color:
										detail?.percentageOverTime <= 5
											? "#23BB79"
											: detail?.percentageOverTime > 5 &&
											  detail?.percentageOverTime <= 10
											? "#ED8738"
											: "#E31212",
								}}
							>
								{detail?.percentageOverTime
									? detail?.percentageOverTime + "%"
									: ""}
							</span>
						</Typography>
						<Typography className={classess.labelText} sx={labelText}>
							Time (Mins) Over/Under:{" "}
							<span
								className={classess.greenTxt}
								style={{
									color:
										detail?.percentageOverTime <= 5
											? "#23BB79"
											: detail?.percentageOverTime > 5 &&
											  detail?.percentageOverTime <= 10
											? "#ED8738"
											: "#E31212",
								}}
							>
								{detail?.minutesOverTime}
							</span>
						</Typography>
						<Typography className={classess.labelText} sx={labelText}>
							Remaining Minutes:{" "}
							<span style={{ fontWeight: 400 }}>
								{roundedToFixed(detail?.estimatedMinutes, 1)}
							</span>
						</Typography>
					</Grid>
				</Grid>
				<div>
					<Typography className={classess.labelText} sx={labelText}>
						Service Report:{" "}
						<span style={{ fontWeight: 400 }}>
							For a full summary please download the service report below.
						</span>
					</Typography>

					{isLoading ? (
						<div className={classess.loaderContainer}>
							<CircularProgress />
						</div>
					) : (
						<GeneralButton
							style={{
								padding: "6px 22px",
								fontSize: "12.5px",
								width: "200px",
								borderRadius: "18px",
							}}
							onClick={downloadServiceReport}
						>
							{`Download ${customCaptions?.service || "Service"} Report`}
						</GeneralButton>
					)}
				</div>
			</div>
		</AccordionBox>
	);
}

export default ServiceInformation;
