import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, Grid } from "@material-ui/core";
import Notes from "./Notes";
import Defects from "./Defects";
import Header from "./Header";
import {
	getCompletedService,
	getServiceNotes,
} from "services/services/serviceDetails/detail";
import { getServiceDefects } from "services/services/serviceDefects/defects";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import ServiceSession from "components/Modules/ServiceSessions";

const useStyles = makeStyles({
	reportContainer: {
		marginTop: 25,
	},
});

const ServiceReport = ({ state, serviceId, customCaptions }) => {
	const redxDispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const classes = useStyles();
	const [notes, setNotes] = useState([]);
	const [completedService, setCompletedService] = useState([]);
	const [defects, setDefects] = useState([]);

	useEffect(() => {
		const fetchReport = async () => {
			try {
				const [notes, defects, completedService] = await Promise.all([
					getServiceNotes(serviceId),
					getServiceDefects(serviceId),
					getCompletedService(serviceId),
				]);
				if (notes.status) {
					setNotes(notes.data);
					setDefects(defects.data);
					setCompletedService(completedService.data);
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

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<div className={classes.reportContainer}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Header state={state.serviceDetail} customCaptions={customCaptions} />
				</Grid>
				<Grid item xs={12}>
					<Notes data={notes} />
				</Grid>
				<Grid item xs={12}>
					<ServiceSession
						completedService={completedService}
						roleName={state.serviceDetail.role}
						customCaptions={customCaptions}
					/>
				</Grid>
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
