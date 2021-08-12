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
	const [addModal, setAddModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
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
		} catch (err) {}
	};

	const handleDeleteApp = (id) => {
		setAppId(id);
		setDeleteModal(true);
	};

	const handleRemoveData = (id) => {
		const filteredData = [...data].filter((x) => x.id !== id);
		setData(filteredData);
	};

	return (
		<div className={classes.appContainer}>
			<AddAppDialog
				open={addModal}
				handleClose={() => setAddModal(false)}
				createHandler={handleCreateData}
			/>
			<DeleteDialog
				entityName="Application"
				open={deleteModal}
				closeHandler={() => setDeleteModal(false)}
				deleteEndpoint={`${BASE_API_PATH}ClientApplications`}
				deleteID={appId}
				handleRemoveData={handleRemoveData}
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
								/>
							))}
						</TableBody>
					</Table>
				</AccordionDetails>
				<AccordionActions className={classes.actionButton}>
					<CurveButton onClick={() => setAddModal(true)}>
						Add Application
					</CurveButton>
				</AccordionActions>
			</Accordion>
		</div>
	);
};

export default ClientApplication;
