import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";
import ContentStyle from "../../../styles/application/ContentStyle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Navcrumbs from "../../../components/Navcrumbs";
import ActionButtons from "./ActionButtons";
import SaveHistory from "../../../components/SaveHistory";
import NavButtons from "../../../components/NavButtons";
import DetailsPanel from "../../../components/DetailsPanel";
import DeleteDialog from "../../../components/DeleteDialog";
import Grid from "@material-ui/core/Grid";
import PositionsTable from "./PositionsTable";
import AddPositionDialog from "./AddDialog";
import EditPositionDialog from "./EditDialog";
import { handleSort } from "../../../helpers/utils";

// Icon Import
import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";

// Init styled components
const AC = ContentStyle();

const PositionsContent = ({ navigation, id, setIs404, state }) => {
	// Init state
	const [applicationName, setApplicationName] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [data, setData] = useState([]);
	const [haveData, setHaveData] = useState(false);
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [dataChanged, setDataChanged] = useState(false);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editData, setEditData] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [searchedData, setSearchedData] = useState([]);

	// Handlers
	const handleGetData = useCallback(async () => {
		// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
		// to caching), which should technically prevent unrequired backend calls
		// Attempting to get model types data
		try {
			// Getting data from API
			let result = await API.get(
				`/api/ApplicationPositions?applicationId=${id}`
			);

			// if success, adding data to state
			if (result.status === 200) {
				handleSort(result.data, setData, "name", "asc");

				return true;
			} // Handling 404
			else if (result.status === 404) {
				setIs404(true);
				return;
			} else {
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			console.log(err);
			return false;
		}
	}, [id, setIs404]);

	const handleAddData = (d) => {
		const newData = [...data];

		newData.push(d);

		setData(newData);

		setDataChanged(true);
	};

	const handleEditData = (d) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		// Updating state
		setData(newData);

		setDataChanged(true);
	};

	const handleRemoveData = (id) => {
		const newData = [...data].filter(function (item) {
			return item.id !== id;
		});

		// Updating state
		setData(newData);

		setDataChanged(true);
	};

	const handleAddDialogOpen = () => {
		setOpenAddDialog(true);
	};

	const handleAddDialogClose = () => {
		setOpenAddDialog(false);
	};

	const handleEditDialogOpen = (id) => {
		let index = data.findIndex((el) => el.id === id);

		if (index >= 0) {
			setEditData(data[index]);
			setOpenEditDialog(true);
		}
	};

	const handleEditDialogClose = () => {
		setOpenEditDialog(false);
	};

	const handleDeleteDialogOpen = (id) => {
		setDeleteID(id);

		setOpenDeleteDialog(true);
	};

	const handleDeleteDialogClose = () => {
		setOpenDeleteDialog(false);
	};

	const handleSearch = () => {
		// Clearning state and returning if empty
		if (searchQuery === "") {
			setSearchedData([]);
			return;
		} else {
			let results = [];

			// Checking status changes
			for (let i = 0; i < data.length; i++) {
				// Pushing current status to results arr if containes search
				if (data[i].name.toLowerCase().includes(searchQuery.toLowerCase())) {
					results.push(data[i]);
				}
			}

			// Updating state
			setSearchedData(results);
			return;
		}
	};

	// Fetch Side effect to get data
	useEffect(() => {
		// Getting data and updating state
		handleGetData()
			.then(() => {
				// Rendering data
				setHaveData(true);
			})
			.catch((err) => console.log(err));
	}, [handleGetData]);

	// Fetch side effect to get application details
	useEffect(() => {
		const getApplicationData = async () => {
			// Attempting to get data
			try {
				// Getting data from API
				let applicationData = await API.get(`/api/Applications/${id}/defaults`);

				// if success, adding data to reducer
				if (applicationData.status === 200) {
					// Setting application name
					setApplicationName(applicationData.data.name);
				} else {
					// If error, throwing to catch
					throw new Error(applicationData);
				}
			} catch (err) {
				// TODO: real error handling
				console.log(err);
				return false;
			}
		};

		// Getting application and updating state
		if (state === undefined) {
			getApplicationData()
				.then(() => {
					console.log("application name updated");
				})
				.catch((err) => console.log(err));
		} else {
			setApplicationName(state.applicationName);
		}
		// eslint-disable-next-line
	}, []);

	// Resorting after add
	useEffect(() => {
		if (dataChanged) {
			handleSort(data, setData, currentTableSort[0], currentTableSort[1]);

			if (searchQuery !== "") {
				handleSearch();
			}

			setDataChanged(false);
		}
		// eslint-disable-next-line
	}, [dataChanged]);

	// Search sorting side effect
	useEffect(() => {
		// Performing search
		handleSearch();
		// eslint-disable-next-line
	}, [searchQuery]);

	return (
		<div className="container">
			{/* START DIALOGS */}
			<AddPositionDialog
				open={openAddDialog}
				closeHandler={handleAddDialogClose}
				applicationID={id}
				handleAddData={handleAddData}
			/>
			<EditPositionDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				handleEditData={handleEditData}
				data={editData}
			/>
			<DeleteDialog
				entityName="Position"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint="/api/ApplicationPositions"
				deleteID={deleteID}
				handleRemoveData={handleRemoveData}
			/>
			{/* END DIALOGS */}
			<div className="topContainerCustomCaptions">
				<Navcrumbs
					crumbs={[
						// TODO: below application name needs to be updated to reflect applicationName
						// from fetched data
						"Application",
						state !== undefined ? state.applicationName : applicationName,
					]}
				/>

				{haveData ? (
					<div>
						<ActionButtons handleAddDialogOpen={handleAddDialogOpen} />
					</div>
				) : null}
			</div>

			{haveData ? (
				<>
					<SaveHistory />

					<NavButtons
						navigation={navigation}
						applicationName={
							state !== undefined ? state.applicationName : applicationName
						}
						current="User Definitions"
					/>

					<div className="detailsContainer">
						<DetailsPanel
							header={"Positions"}
							dataCount={haveData ? data.length : 0}
							description="Create and manage Positions"
						/>

						<div className="desktopSearchCustomCaptions">
							<AC.SearchContainer>
								<AC.SearchInner>
									<Grid container spacing={1} alignItems="flex-end">
										<div style={{ display: "flex", alignItems: "center" }}>
											<Grid item>
												<SearchIcon
													style={{ marginTop: "20px", marginRight: "5px" }}
												/>
											</Grid>
											<Grid item>
												<AC.SearchInput
													value={searchQuery}
													onChange={(e) => {
														setSearchQuery(e.target.value);
													}}
													label="Search Positions"
												/>
											</Grid>
										</div>
									</Grid>
								</AC.SearchInner>
							</AC.SearchContainer>
						</div>

						<div className="mobileSearchCustomCaptions">
							<AC.SearchContainerMobile>
								<AC.SearchInner>
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
												label="Search Positions"
											/>
										</Grid>
									</Grid>
								</AC.SearchInner>
							</AC.SearchContainerMobile>
						</div>
					</div>

					<PositionsTable
						data={data}
						setData={setData}
						handleSort={handleSort}
						searchQuery={searchQuery}
						handleEditDialogOpen={handleEditDialogOpen}
						handleDeleteDialogOpen={handleDeleteDialogOpen}
						currentTableSort={currentTableSort}
						setCurrentTableSort={setCurrentTableSort}
						searchedData={searchedData}
						setSearchedData={setSearchedData}
					/>
				</>
			) : (
				<AC.SpinnerContainer>
					<CircularProgress />
				</AC.SpinnerContainer>
			)}
		</div>
	);
};

export default PositionsContent;
