import React from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import { Grid, Typography } from "@material-ui/core";
import { serviceStatus } from "constants/serviceDetails";
import ProgressBar from "components/Elements/ProgressBar";
import CurveButton from "components/Elements/CurveButton";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import Icon from "components/Elements/Icon";
import { roundedToFixed } from "helpers/utils";

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
						<Typography className={classess.labelText}>
							Percentage Time Over/Under:{" "}
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
						<Typography className={classess.labelText}>
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
						<Typography className={classess.labelText}>
							Remaining Minutes:{" "}
							<span style={{ fontWeight: 400 }}>
								{roundedToFixed(detail?.estimatedMinutes, 1)}
							</span>
						</Typography>
					</Grid>
				</Grid>
			</div>
		</AccordionBox>
	);
}

export default ServiceInformation;
