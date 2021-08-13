import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Accordion,
	AccordionActions,
	AccordionDetails,
	AccordionSummary,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";
import CurveButton from "../../../components/CurveButton";
import ArrowIcon from "../../../assets/icons/arrowIcon.svg";
import ColourConstants from "../../../helpers/colourConstants";
import AddAppDialog from "./AddAppDialog";
import ClientAppRow from "./ClientAppRow";
import API from "../../../helpers/api";
import { BASE_API_PATH } from "../../../helpers/constants";
import { handleSort } from "../../../helpers/utils";
import DeleteDialog from "../../../components/DeleteDialog";
import ChangeDialog from "./ChangeDialog";
import ErrorDialog from "../../../components/ErrorDialog";

const useStyles = makeStyles((theme) => ({
	appContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
	appAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "99%",
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
	appName: {
		color: "#307AD6",
		textDecoration: "underline",
	},
	actionButton: { padding: "0px 13px 12px 6px" },
}));

const ClientApplication = () => {
	const classes = useStyles();
	const [modal, setModal] = useState({
		addModal: false,
		deleteModal: false,
		changeModal: false,
		errorModal: false,
	});
	const [appStatus, setStatus] = useState(false);
	const [appId, setAppId] = useState(null);
	const [data, setData] = useState([]);

	const fetchApplications = async () => {
		try {
			let result = await API.get(
				`${BASE_API_PATH}clientApplications?clientid=8`
			);
			if (result.status === 200) {
				result = result.data;
				handleSort(result, setData, "name", "asc");
			}
		} catch (err) {}
	};

	useEffect(() => {
		fetchApplications();
	}, []);

	const handleCreateData = async (applicationId) => {
		try {
			let result = await API.post(`${BASE_API_PATH}ClientApplications`, {
				applicationId,
				clientID: 8,
				isActive: true,
			});
			if (result.status === 201 || result.status === 200) {
				result = result.data;
				setData([]);
				await fetchApplications();
				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {
			console.log(err.response);
			setModal((th) => ({ ...th, errorModal: true }));
		}
	};

	const handleDeleteApp = (id) => {
		setAppId(id);
		setModal((th) => ({ ...th, deleteModal: true }));
	};

	const handleRemoveData = (id) => {
		const filteredData = [...data].filter((x) => x.id !== id);
		setData(filteredData);
	};

	// Setting data to be sent to api
	const handleChangeApp = (id) => {
		setAppId(id);
		setModal((th) => ({ ...th, changeModal: true }));
		// Find the data to get toggled
		const getStatus = [...data].find((x) => x.id === id);

		// Reverse the isActive status
		setStatus(!getStatus.isActive);
	};

	// Change in particular data of state after successful patching
	const getChangedValue = (id, stat) => {
		const main = [...data].map((x) =>
			x.id === id ? { ...x, isActive: stat } : x
		);
		setData(main);
	};

	const { addModal, deleteModal, changeModal, errorModal } = modal;

	return (
		<div className={classes.appContainer}>
			<AddAppDialog
				open={addModal}
				handleClose={() => setModal((th) => ({ ...th, addModal: false }))}
				createHandler={handleCreateData}
			/>
			<DeleteDialog
				entityName="Application"
				open={deleteModal}
				closeHandler={() => setModal((th) => ({ ...th, deleteModal: false }))}
				deleteEndpoint={`${BASE_API_PATH}ClientApplications`}
				deleteID={appId}
				handleRemoveData={handleRemoveData}
			/>
			<ChangeDialog
				open={changeModal}
				closeHandler={() => setModal((th) => ({ ...th, changeModal: false }))}
				changeId={appId}
				status={appStatus}
				getChangedValue={getChangedValue}
			/>
			<ErrorDialog
				open={errorModal}
				handleClose={() => setModal((th) => ({ ...th, errorModal: false }))}
			/>
			<Accordion className={classes.appAccordion}>
				<AccordionSummary
					expandIcon={
						<img
							alt="Expand icon"
							src={ArrowIcon}
							className={classes.expandIcon}
						/>
					}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<div>
						<Typography className={classes.sectionHeading}>
							Application ({data.length})
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<Table>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Sites(Qty)</TableCell>
								<TableCell>Status</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row) => (
								<ClientAppRow
									key={row.id}
									row={row}
									classes={classes}
									onDeleteApp={() => handleDeleteApp(row.id)}
									onChangeApp={() => handleChangeApp(row.id)}
								/>
							))}
						</TableBody>
					</Table>
				</AccordionDetails>
				<AccordionActions className={classes.actionButton}>
					<CurveButton
						onClick={() => setModal((th) => ({ ...th, addModal: true }))}
					>
						Add Application
					</CurveButton>
				</AccordionActions>
			</Accordion>
		</div>
	);
};

export default ClientApplication;
