import React, { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/Layouts/AccordionBox";
import ApplicationTable from "components/Modules/ApplicationTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import { handleSort } from "helpers/utils";
import {
	addClientApplications,
	getClientApplications,
} from "services/clients/clientDetailScreen";
import AddAppDialog from "./AddAppDialog";
import "./application.css";
import ChangeDialog from "./ChangeDialog";

const useStyles = makeStyles((theme) => ({
	appContainer: {
		marginTop: 15,
		display: "flex",
		justifyContent: "flex-end",
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
		width: "100%",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
		width: "100%",
	},
	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
		verticalAlign: "middle",
	},
	appName: {
		color: "#307AD6",
		textDecoration: "underline",
		wordBreak: "break-word",
	},
	actionButton: { padding: "0px 13px 12px 6px" },
}));

const ClientApplication = ({ clientId, getError }) => {
	const classes = useStyles();
	const [modal, setModal] = useState({
		addModal: false,
		deleteModal: false,
		changeModal: false,
	});
	const [appStatus, setStatus] = useState(false);
	const [appId, setAppId] = useState(null);
	const [data, setData] = useState([]);
	const cancelFetch = useRef(false);
	const [isLoading, setIsLoading] = useState(true);

	const fetchApplications = async () => {
		try {
			let result = await getClientApplications(clientId);

			if (cancelFetch.current) {
				return;
			}
			if (result.status) {
				result = result.data;
				handleSort(result, setData, "name", "asc");
			}
			setIsLoading(false);
		} catch (err) {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchApplications();
		return () => {
			cancelFetch.current = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCreateData = async (applicationId) => {
		try {
			let result = await addClientApplications({
				applicationId,
				clientID: clientId,
				isActive: true,
			});
			if (result.status) {
				result = result.data;
				setData([]);
				await fetchApplications();
				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {
			console.log(err.response);
			getError("Error Creating Application");
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

	const { addModal, deleteModal, changeModal } = modal;

	return (
		<div className={classes.appContainer}>
			<AddAppDialog
				open={addModal}
				handleClose={() => setModal((th) => ({ ...th, addModal: false }))}
				createHandler={handleCreateData}
				clientId={clientId}
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

			<AccordionBox
				title={`Application (${data.length})`}
				isActionsPresent={true}
				buttonName="Add Application"
				buttonAction={() => setModal((th) => ({ ...th, addModal: true }))}
				accordianDetailsCss="table-container"
			>
				{isLoading ? (
					<CircularProgress />
				) : (
					<ApplicationTable
						data={data}
						onDeleteApp={handleDeleteApp}
						onChangeApp={handleChangeApp}
					/>
				)}
			</AccordionBox>
		</div>
	);
};

export default ClientApplication;
