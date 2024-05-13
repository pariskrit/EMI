import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { CircularProgress, Grid, Typography } from "@mui/material";
import Notes from "./Notes";
import Defects from "./Defects";
import Header from "./Header";
import {
	getCompletedService,
	getIncompleteService,
	getServiceNotes,
} from "services/services/serviceDetails/detail";
import { getServiceDefects } from "services/services/serviceDefects/defects";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import ServiceSession from "components/Modules/ServiceSessions";
import { formatAMPM } from "helpers/utils";
import { changeDate } from "helpers/date";
import { isoDateWithoutTimeZone } from "helpers/utils";
import ServiceStages from "components/Modules/ServiceSessions/ServiceStages";

const useStyles = makeStyles()((theme) => ({
	reportContainer: {
		marginTop: 25,
	},
	stageheader: {
		fontWeight: 800,
		fontSize: 20,
		marginBottom: "10px",
	},
	printResponsive: {
		marginTop: 25,
		paddingLeft: 5,
	},
}));

const ServiceReport = ({ state, serviceId, customCaptions, isPrint }) => {
	const redxDispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const { classes, cx } = useStyles();
	const [notes, setNotes] = useState([]);
	const [completedService, setCompletedService] = useState([]);
	const [IncompletedService, SetInCompletedService] = useState([]);
	const [defects, setDefects] = useState([]);

	useEffect(() => {
		const fetchReport = async () => {
			try {
				const [notes, defects, completedService, incompleteservice] =
					await Promise.all([
						getServiceNotes(serviceId),
						getServiceDefects(serviceId),
						getCompletedService(serviceId),
						getIncompleteService(serviceId),
					]);
				if (notes.status) {
					setNotes(notes.data);
					setDefects(defects.data);
					setCompletedService(completedService.data);
					SetInCompletedService(incompleteservice.data);
				} else {
					redxDispatch(
						showError(notes?.data?.detail || "Could not show service report")
					);
				}
			} catch (error) {
				redxDispatch(
					showError(error?.data?.detail || "Could not show service report")
				);
			}
			setLoading(false);
		};
		fetchReport();
	}, [serviceId, redxDispatch]);
	function setQuestionResponse(question) {
		switch (question.type) {
			case "S":
				return question?.valueString || "";

			case "L":
				return question?.valueString || "";

			case "N":
				return question?.valueNumeric?.toString() ?? "";

			case "D":
				return question?.valueDate ? changeDate(question?.valueDate) : "";

			case "T":
				return question?.valueData ? formatAMPM(question?.valueDate) : "";

			case "O":
				return question?.options ? commaSeperateValues(question?.options) : "";

			case "C":
				return question?.options ? commaSeperateValues(question?.options) : "";
			// case "C":
			case "B":
				return question?.valueBoolean
					? question?.checkboxCaption || ""
					: question?.options
					? commaSeperateValues(question?.options)
					: "";

			default:
				return question?.valueBoolean || "";
		}
	}

	function commaSeperateValues(options) {
		let values = options?.map((op) => op?.name);
		return values.join(", ");
	}

	function formatQuestion(questions, name) {
		return questions?.map((q) => {
			return {
				...q,
				date: q.date ? isoDateWithoutTimeZone(q.date + "Z") : "",
				response: setQuestionResponse(q),
				displayName: name,
			};
		});
	}

	const groupByZone = (Zonedata) => {
		let zoneGroupedData = Zonedata.reduce((group, current) => {
			const { zoneName } = current;
			if (zoneName) {
				group[zoneName] = group[zoneName] ?? [];
				group[zoneName].push(current);
			} else {
				group["empty"] = group["empty"] ?? [];
				group["empty"].push(current);
			}
			return group;
		}, {});

		return Object.keys(zoneGroupedData).map((key) => {
			let zoneObject = {};
			return {
				...zoneObject,
				zonename: key === "empty" ? null : key,
				zoneData: zoneGroupedData[key],
			};
		});
	};

	const groupByStage = (data) => {
		let stageGroupedData = data.reduce((group, current) => {
			const { stageName } = current;
			if (stageName) {
				group[stageName] = group[stageName] ?? [];
				group[stageName].push(current);
			}
			return group;
		}, {});

		return Object.keys(stageGroupedData).map((key) => {
			let stageObject = {};
			return {
				...stageObject,
				stagename: key,
				stageData: groupByZone(stageGroupedData[key]),
			};
		});
	};

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<div
			className={isPrint ? classes.printResponsive : classes.reportContainer}
		>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Header
						state={state?.serviceDetail}
						customCaptions={customCaptions}
					/>
				</Grid>
				<Grid item xs={12}>
					<Notes data={notes} isPrint={isPrint} />
				</Grid>
				<Grid item xs={12}>
					<ServiceSession
						completedService={completedService}
						roleName={state?.serviceDetail?.role}
						customCaptions={customCaptions}
						formatQuestion={formatQuestion}
						groupByStage={groupByStage}
						isPrint={isPrint}
					/>
				</Grid>
				{IncompletedService.length > 0 && (
					<Grid item xs={12}>
						<Typography className={classes.stageheader}>
							{`Incomplete ${customCaptions.taskPlural}`}
						</Typography>
						<ServiceStages
							tasks={groupByStage(IncompletedService)}
							customCaptions={customCaptions}
							formatQuestion={formatQuestion}
						/>
					</Grid>
				)}
				<Grid item xs={12}>
					<Defects
						data={defects}
						columns={[
							"number",
							"taskName",
							"stageName",
							"zoneName",
							"defectTypeName",
							"riskRatingName",
							"createdUserName",
							"details",
						]}
						customCaptions={customCaptions}
						headers={[
							{ id: 1, name: "Number" },
							{
								id: 2,
								name: customCaptions?.task,
							},
							{
								id: 3,
								name: customCaptions?.stage,
							},
							{
								id: 4,
								name: customCaptions?.zone,
							},
							{
								id: 5,
								name: customCaptions?.defectType,
							},
							{
								id: 8,
								name: customCaptions?.riskRating,
							},
							{
								id: 6,
								name: customCaptions?.user,
							},
							{
								id: 7,
								name: `${customCaptions.defect} Details`,
							},
						]}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default ServiceReport;
