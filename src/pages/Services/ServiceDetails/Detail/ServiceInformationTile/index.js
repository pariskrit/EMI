import React from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import { Grid, Typography } from "@material-ui/core";
import { serviceStatus } from "constants/serviceDetails";
import ProgressBar from "components/Elements/ProgressBar";
import CurveButton from "components/Elements/CurveButton";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import Icon from "components/Elements/Icon";

const useStyles = makeStyles((theme) => ({
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
		marginBottom: "15px",
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
}));

function ServiceInformation({ classes, detail, customCaptions }) {
	const classess = useStyles();

	return (
		<AccordionBox title={"Service Information"}>
			<div className={classes.inputContainer}>
				<Grid container spacing={5}>
					<Grid item lg={5} md={6} xs={12}>
						<Typography
							className={clsx(classess.labelText, classess.customLabelTxt)}
						>
							Status:{" "}
							<span style={{ display: "inline-flex", gap: 3 }}>
								<span>
									<Icon
										name={serviceStatus[detail?.status]}
										fontSize={"18px"}
									/>
								</span>
								<span className={classess.smallTxt}>
									{serviceStatus[detail?.status]}
								</span>
							</span>
						</Typography>
						<Typography className={classess.labelText}>
							Percentage Completed:{" "}
							<span className={classess.greenTxt}>
								{detail?.percentageComplete}%
							</span>
							<ProgressBar value={detail?.percentageComplete} />
						</Typography>
						<Typography className={classess.labelText}>
							Percentage Time Over/Under:{" "}
							<span className={classess.greenTxt}>
								{detail?.percentageOverTime
									? detail?.percentageOverTime + "%"
									: ""}
							</span>
						</Typography>
						<Typography className={classess.labelText}>
							Time (Mins) Over/Under:{" "}
							<span className={classess.greenTxt}>
								{detail?.minutesOverTime}
							</span>
						</Typography>
						<Typography className={classess.labelText}>
							Remaining Minutes:{" "}
							<span className={classess.greenTxt}>
								{detail?.estimatedMinutes}
							</span>
						</Typography>
					</Grid>
					<Grid item lg={6} md={6} xs={12}>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "start",
								justifyContent: "center",
								gap: 10,
							}}
						>
							<Typography
								className={classess.labelText}
								style={{ marginBottom: 5 }}
							>
								Service Report:{" "}
								<span className={classess.smallTxt}>
									{" "}
									For full summary please download the service report below.
								</span>
							</Typography>
							<CurveButton onClick={() => {}}>
								Download Service Report
							</CurveButton>
						</div>
					</Grid>
				</Grid>
			</div>
		</AccordionBox>
	);
}

export default ServiceInformation;
