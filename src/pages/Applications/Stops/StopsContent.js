import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import DetailsPanel from "components/Elements/DetailsPanel";
import Navcrumbs from "components/Elements/Navcrumbs";
import SaveHistory from "components/Elements/SaveHistory";
import DeleteDialog from "components/Elements/DeleteDialog";
import NavButtons from "components/Elements/NavButtons";
import API from "helpers/api";
import { handleSort } from "helpers/utils";
import React, { useCallback, useEffect, useState } from "react";
import ContentStyle from "styles/application/ContentStyle";
import ActionButtons from "./ActionButtons";
import AddStopDialog from "./AddDialog";
import EditStopDialog from "./EditDialog";

// Init styled components
const AC = ContentStyle();

const StopsContent = ({ navigation, id, setIs404, state }) => {
	// Init state
	const [applicationName, setApplicationName] = useState("");
	const [data, setData] = useState([]);
	const [haveData, setHaveData] = useState(false);
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [dataChanged, setDataChanged] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editData, setEditData] = useState({});
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [searchedData, setSearchedData] = useState([]);

	// Handlers
	const handleGetData = useCallback(async () => {
		// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
		// to caching), which should technically prevent unrequired backend calls
		// Attempting to get data
		try {
			// Getting data from API
			let result = await API.get(
				`/api/ApplicationStopReasons?applicationId=${id}`
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
		}

		let results = [];

		// Checking data
		for (let i = 0; i < data.length; i++) {
			// Pushing current status to results arr if containes search
			if (data[i].name.toLowerCase().includes(searchQuery.toLowerCase())) {
				results.push(data[i]);
			}
		}
		// Updating state
		setSearchedData(results);
		return;
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
			// Attempting to get model status data
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
			{/* Start of dialogs */}
			<AddStopDialog
				open={openAddDialog}
				closeHandler={handleAddDialogClose}
				applicationID={id}
				handleAddData={handleAddData}
			/>
			<EditStopDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				data={editData}
				handleEditData={handleEditData}
			/>
			<DeleteDialog
				entityName="Stop Reason"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint="/api/ApplicationStopReasons"
				deleteID={deleteID}
				handleRemoveData={handleRemoveData}
			/>
			{/* End dialogs */}
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

			{/* Spinner should start here */}
			{haveData ? (
				<>
					<SaveHistory />

					<NavButtons
						navigation={navigation}
						applicationName={
							state !== undefined ? state.applicationName : applicationName
						}
						current="Reason Definitions"
					/>

					<div className="detailsContainer">
						<DetailsPanel
							header={"Stop Reasons"}
							dataCount={haveData ? data.length : 0}
							description="Create and manage Stop Reasons"
						/>

						<div className="desktopSearchCustomCaptions">
							<AC.SearchContainer>
								<AC.SearchInner>
									<Grid container spacing={1} alignItems="flex-end">
										<div className="flex">
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
													label="Search Stops"
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
												label="Search Stops"
											/>
										</Grid>
									</Grid>
								</AC.SearchInner>
							</AC.SearchContainerMobile>
						</div>
					</div>

					{/* <SingleHeadTable
						data={data}
						setData={setData}
						searchQuery={searchQuery}
						handleSort={handleSort}
						handleEditDialogOpen={handleEditDialogOpen}
						handleDeleteDialogOpen={handleDeleteDialogOpen}
						currentTableSort={currentTableSort}
						setCurrentTableSort={setCurrentTableSort}
						searchedData={searchedData}
						setSearchedData={setSearchedData}
					/> */}
					<CommonApplicationTable
						data={data}
						columns={["name"]}
						headers={["Name"]}
						setData={setData}
						pagination={false}
						handleSort={handleSort}
						onEdit={handleEditDialogOpen}
						onDelete={(id) => handleDeleteDialogOpen(id)}
						searchedData={searchedData}
						searchQuery={searchQuery}
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

export default StopsContent;