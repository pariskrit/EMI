import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ChangeStatusPopup from "./changeStatusPopUp";
import ColourConstants from "helpers/colourConstants";
import { CircularProgress, Grid } from "@material-ui/core";
import DetailTile from "./DetailTile";
import ServiceInformation from "./ServiceInformationTile";
import Notes from "./NotesTile";
import {
	getServiceNotes,
	getServicePeopleList,
} from "services/services/serviceDetails/detail";
import PeopleTile from "./PeopleTile";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import StatusChangePopup from "../../ServiceLists/StatusChangePopup";

const useStyles = makeStyles((theme) => ({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},

	logoContentParent: {
		width: "100%",
	},
	uploaderContainer: {
		marginTop: "2%",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},
	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
	inputContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	documentError: {
		color: "#E21313",
		margin: "8px 0",
	},
}));

function ServiceDetail({
	state,
	dispatch,
	customCaptions,
	siteAppID,
	serviceId,
}) {
	const classes = useStyles();
	const redxDispatch = useDispatch();

	const [notes, setNotes] = useState([]);
	const [peoples, setPeoples] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openChnageStatusPopup, setOpenChnageStatusPopup] = useState(false);

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const [notes, people] = await Promise.all([
					getServiceNotes(serviceId),
					getServicePeopleList(serviceId),
				]);
				if (notes.status) {
					setNotes(notes.data);
					setPeoples(people.data);
				} else {
					redxDispatch(
						showError(notes?.data?.detail || "Could not show service detail")
					);
				}
			} catch (error) {
				redxDispatch(
					showError(error?.data?.detail || "Could not show service detail")
				);
			}
			setLoading(false);
		};
		fetchDetails();
	}, [serviceId, redxDispatch]);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<>
			<ChangeStatusPopup
				open={state.showChangeStatus}
				onClose={() =>
					dispatch({ type: "TOGGLE_CHANGE_STATUS", payload: false })
				}
				status={state}
			/>
			<StatusChangePopup
				open={openChnageStatusPopup}
				onClose={() => setOpenChnageStatusPopup(false)}
				serviceId={{ id: serviceId, changeTostatus: "R" }}
				siteAppID={siteAppID}
				title="Change Status to Reset"
				fetchData={() => dispatch({ type: "SET_SERVICE_STATUS", payload: "T" })}
				setDataForFetchingService={() => {}}
			/>

			<div className={classes.detailContainer}>
				<Grid container spacing={2}>
					<Grid item lg={6} md={6} xs={12}>
						<DetailTile
							classes={classes}
							detail={state?.serviceDetail}
							customCaptions={customCaptions}
							siteAppID={siteAppID}
							serviceId={serviceId}
							dispatch={dispatch}
							state={state.serviceDetail}
							isReadOnly={state?.serviceDetail?.status !== "S"}
						/>
					</Grid>
					<Grid item lg={6} md={6} xs={12}>
						<ServiceInformation
							classes={classes}
							detail={state?.serviceDetail}
							customCaptions={customCaptions}
							siteAppID={siteAppID}
							serviceId={serviceId}
							dispatch={dispatch}
							state={state.serviceDetail}
							setOpenChnageStatusPopup={setOpenChnageStatusPopup}
						/>
						<PeopleTile data={peoples} classes={classes} />
						<Notes serviceId={serviceId} data={notes} />
					</Grid>
				</Grid>
			</div>
		</>
	);
}

export default ServiceDetail;
