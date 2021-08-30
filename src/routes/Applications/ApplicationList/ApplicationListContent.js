import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ContentStyle from "../../../styles/application/ContentStyle";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ApplicationTable from "./ApplicationTable";
import { CircularProgress } from "@material-ui/core";
import AddApplicationDialog from "./AddApplicationDialog";
import DuplicateApplicationDialog from "./DuplicateApplicationDialog";
import API from "../../../helpers/api";
import ColourConstants from "../../../helpers/colourConstants";
import DeleteDialog from "../../../components/DeleteDialog";
import { handleSort } from "../../../helpers/utils";

// Icon Import
import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";
// Init styled components
const AC = ContentStyle();

const useStyles = makeStyles({
	listActions: {
		marginBottom: 30,
	},
	headerContainer: {
		display: "flex",
	},
	headerText: {
		fontSize: 21,
	},
	buttonContainer: {
		display: "flex",
		marginLeft: "auto",
	},
	productButton: {
		backgroundColor: ColourConstants.confirmButton,
		color: "#FFFFFF",
		fontSize: 15,
		fontFamily: "Roboto Condensed",
		width: 150,
	},
});

const ApplicationListContent = () => {
	// Init hooks
	const classes = useStyles();
	const history = useHistory();

	// Init state
	const [data, setData] = useState([]);
	const [haveData, setHaveData] = useState(false);
	const [dataCount, setDataCount] = useState(null);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
	const [selectedID, setSelectedID] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchedData, setSearchedData] = useState([]);

	// Handlers
	const fetchData = async () => {
		// Attempting to fetch applications
		try {
			// Fetching applications from backend
			let result = await API.get("/api/Applications");

			// Rendering applications if success
			if (result.status === 200) {
				// Getting buffer
				result = result.data;

				// Updating state
				result.forEach((d, index) => {
					// TODO: BELOW NEEDS TO COME FROM BACKEND WHEN ClIENTS EXISTS
					// The foreach can be removed when clients exists in response
					d.clients = Math.trunc(Math.random() * 100);

					result[index] = d;
				});

				// Setter happens in sort
				handleSort(result, setData, "name", "asc");

				setDataCount(result.length);

				return true;
			} else {
				// Throwing error if failed
				throw new Error(`Error: Status ${result.status}`);
			}
		} catch (err) {
			// TODO: Real error handling when this has been decided on
			// (are we throwing alerts or pushing to home?)
			console.log(err);
			return err;
		}
	};

	const handleAddDialogOpen = () => {
		setOpenAddDialog(true);
	};

	const handleAddDialogClose = () => {
		setOpenAddDialog(false);
	};

	const handleDuplicateDialogOpen = (id) => {
		setSelectedID(id);
		setOpenDuplicateDialog(true);
	};

	const handleDuplicateDialogClose = () => {
		setSelectedID(null);
		setOpenDuplicateDialog(false);
	};

	const handleDeleteDialogOpen = (id) => {
		setSelectedID(id);
		setOpenDeleteDialog(true);
	};

	const handleDeleteDialogClose = () => {
		setSelectedID(null);
		setOpenDeleteDialog(false);
	};

	const handleRedirect = (id) => {
		history.push(`/application/${id}`);
	};

	const handleCreateData = async (name) => {
		// Adding spinner
		setHaveData(false);

		// Remove search
		setSearchQuery("");

		// Attempting to create application
		try {
			// Sending create POST to backend
			let result = await API.post("/api/Applications", {
				name: name,
				logoURI: null,
				color: "FFFFFF",
				// Below are set to defaults
				applicationURI: "string",
				allowIndividualAssetModels: true,
				allowFacilityBasedModels: true,
				showLocations: true,
				showModel: true,
				showSerialNumberRange: true,
				showLubricants: true,
				showParts: true,
				showSafetyAlerts: true,
				showOperatingMode: true,
				showSystem: true,
				showStageOperatingStatus: true,
				showDefectParts: true,
			});

			if (result.status === 201 || result.status === 200) {
				// Getting response
				result = result.data;

				// Redirecting page
				handleRedirect(result);

				// Clearing state
				setData([]);

				// Fetching data
				await fetchData();

				setHaveData(true);

				return { success: true };
			} else {
				// Throwing response if error
				throw new Error(result);
			}
		} catch (err) {
			if (
				err.response.data.errors !== undefined &&
				err.response.data.detail === undefined
			) {
				// Removing spinner
				setHaveData(true);

				return { success: false, errors: err.response.data.errors };
			} else if (
				err.response.data.errors !== undefined &&
				err.response.data.detail !== undefined
			) {
				// Removing spinner
				setHaveData(true);

				return {
					success: false,
					errors: { name: err.response.data.detail },
				};
			} else {
				// Removing spinner
				setHaveData(true);

				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}
		}
	};

	const handleDuplicateData = async (id, input) => {
		// Adding spinner
		setHaveData(false);

		// Remove search
		setSearchQuery("");

		// Attempting to create application
		try {
			// Sending create POST to backend
			let result = await API.post(`/api/Applications/${id}/duplicate`, input);

			if (result.status === 201 || result.status === 200) {
				// Getting response
				result = result.data;

				// Redirecting page
				handleRedirect(result);

				// Clearing state
				setData([]);

				// Fetching data
				await fetchData();

				setHaveData(true);

				return { success: true };
			} else {
				// Throwing response if error
				throw new Error(result);
			}
		} catch (err) {
			if (err.response.data.errors !== undefined) {
				// Removing spinner
				setHaveData(true);

				return { success: false, errors: err.response.data.errors };
			} else {
				// Removing spinner
				setHaveData(true);

				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}
		}
	};

	const handleRemoveData = (id) => {
		const newData = [...data].filter(function (item) {
			return item.id !== id;
		});

		// Updating state
		setData(newData);
	};

	const handleSearch = () => {
		// Clearning state and returning if empty
		if (searchQuery === "") {
			setSearchedData([]);
			return;
		}

		let results = [];

		// Checking data
		for (let i = 0; i < data.length; i++) {
			// Pushing current data to results arr if containes search
			if (data[i].name.toLowerCase().includes(searchQuery.toLowerCase())) {
				results.push(data[i]);
			}
		}

		// Updating state
		setSearchedData(results);
	};

	// Fetching data on pageload
	useEffect(() => {
		fetchData()
			.then(() => {
				setHaveData(true);
			})
			.catch((err) => console.log("ERROR: ", err));
		// eslint-disable-next-line
	}, []);

	// Search sorting side effect
	useEffect(() => {
		// Performing search
		handleSearch();
		// eslint-disable-next-line
	}, [searchQuery]);

	return (
		<div className="container">
			<AddApplicationDialog
				open={openAddDialog}
				closeHandler={handleAddDialogClose}
				createHandler={handleCreateData}
			/>
			<DuplicateApplicationDialog
				open={openDuplicateDialog}
				closeHandler={handleDuplicateDialogClose}
				duplicateHandler={handleDuplicateData}
				id={selectedID}
			/>
			<DeleteDialog
				entityName="Application"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint="/api/Applications"
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
			/>
			<div>
				<div className={classes.listActions}>
					<div className={classes.headerContainer}>
						<Typography
							className={classes.headerText}
							component="h1"
							gutterBottom
						>
							{dataCount === null ? (
								<strong>{"Application List"}</strong>
							) : (
								<strong>{`Application List (${dataCount})`}</strong>
							)}
						</Typography>
						{haveData ? (
							<div className={classes.buttonContainer}>
								<Button
									variant="contained"
									className={`${classes.productButton} addNewBtn`}
									onClick={handleAddDialogOpen}
								>
									Add New
								</Button>
							</div>
						) : null}
					</div>

					{haveData ? (
						<AC.SearchContainer>
							<AC.SearchInner className="applicationSearchBtn">
								<Grid container spacing={1} alignItems="flex-end">
									<Grid item>
										<SearchIcon />
									</Grid>
									<Grid item>
										<AC.SearchInput
											value={searchQuery}
											onChange={(e) => {
												setSearchQuery(e.target.value);
											}}
											label="Search Applications"
										/>
									</Grid>
								</Grid>
							</AC.SearchInner>
						</AC.SearchContainer>
					) : null}
				</div>

				{haveData ? (
					<ApplicationTable
						data={data}
						setData={setData}
						handleSort={handleSort}
						searchQuery={searchQuery}
						handleDuplicateDialogOpen={handleDuplicateDialogOpen}
						handleDeleteDialogOpen={handleDeleteDialogOpen}
						searchedData={searchedData}
						setSearchedData={setSearchedData}
					/>
				) : (
					<CircularProgress />
				)}
			</div>
		</div>
	);
};

export default ApplicationListContent;
