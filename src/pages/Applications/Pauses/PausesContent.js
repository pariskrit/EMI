import React, { useState, useEffect, useCallback } from "react";
import API from "helpers/api";
import ContentStyle from "styles/application/ContentStyle";
import CircularProgress from "@mui/material/CircularProgress";
import NavDetails from "components/Elements/NavDetails";
import ActionButtons from "./ActionButtons";
import NavButtons from "components/Elements/NavButtons";
import DetailsPanel from "components/Elements/DetailsPanel";
import DeleteDialog from "components/Elements/DeleteDialog";
import Grid from "@mui/material/Grid";
import AddPauseDialog from "./AddDialog/AddDialog";
import EditPauseDialog from "./EditDialog/EditDialog";
import { getLocalStorageData, handleSort } from "helpers/utils";
import RestoreIcon from "@mui/icons-material/Restore";

// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import PausesTable from "./PausesTable";
import { appPath, applicationListPath } from "helpers/routePaths";
import TabTitle from "components/Elements/TabTitle";
import { setHistoryDrawerState, showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import { RESELLER_ID } from "constants/UserConstants/indes";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { useSelector } from "react-redux";
import { getApplicationPauseReason } from "services/History/application";

// Init styled components
const AC = ContentStyle();

const PausesContent = ({ navigation, id, setIs404, state }) => {
	// Init state
	const [applicationName, setApplicationName] = useState("");
	const [data, setData] = useState([]);
	const [haveData, setHaveData] = useState(false);
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [dataChanged, setDataChanged] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editData, setEditData] = useState(null);
	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [searchedData, setSearchedData] = useState([]);
	const dispatch = useDispatch();
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);

	const handleAddSubcat = (parentId, id, name) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === parentId);

		newData[index].pauseSubcategories.push({
			applicationPauseID: parentId,
			id: id,
			name: name,
		});

		newData[index].pauseSubcategories.sort((a, b) =>
			a["name"].toString().localeCompare(b["name"].toString())
		);

		// Updating state
		setData(newData);
	};

	const handleUpdateSubcat = (parentId, subcatID, newName) => {
		const newData = [...data];

		let pauseIndex = newData.findIndex((el) => el.id === parentId);
		let subcatIndex = newData[pauseIndex].pauseSubcategories.findIndex(
			(el) => el.id === subcatID
		);

		newData[pauseIndex].pauseSubcategories[subcatIndex] = {
			applicationPauseID: parentId,
			id: subcatID,
			name: newName,
		};

		newData[pauseIndex].pauseSubcategories.sort((a, b) =>
			a["name"].toString().localeCompare(b["name"].toString())
		);

		// Updating state
		setData(newData);
	};

	const handleRemoveSubcat = (sub) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === sub.applicationPauseID);

		newData[index].pauseSubcategories = newData[
			index
		].pauseSubcategories.filter((item) => {
			return item.id !== sub.id;
		});

		newData[index].pauseSubcategories.sort((a, b) =>
			a["name"].toString().localeCompare(b["name"].toString())
		);

		// Updating state
		setData(newData);
	};

	const handleGetData = useCallback(async () => {
		// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
		// to caching), which should technically prevent unrequired backend calls
		// Attempting to get pause data
		try {
			// Getting data from API
			let result = await API.get(`/api/ApplicationPauses?applicationId=${id}`);

			// if success, adding data to reducer
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
			dispatch(showError("Failed to fetch pause reasons."));
			return false;
		}
	}, [id, setIs404]);

	const handleAddDialogOpen = () => {
		setOpenAddDialog(true);
	};

	const handleAddDialogClose = () => {
		setOpenAddDialog(false);
	};

	const handleEditDialogOpen = (id) => {
		setOpenEditDialog(true);

		data.forEach((d) => {
			if (d.id === id) {
				const dataWithSortedSubcats = d;

				// Sorting subcats before setting
				dataWithSortedSubcats.pauseSubcategories.sort((a, b) => {
					// Setting names to upper
					const nameA = a.name.toUpperCase();
					const nameB = b.name.toUpperCase();

					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}

					// If equal, 0
					return 0;
				});

				// Setting edit data
				setEditData(dataWithSortedSubcats);
			}
		});
	};

	const handleEditDialogClose = () => {
		setOpenEditDialog(false);
	};

	const handleDeleteDialogOpen = (id) => {
		setDeleteID(id);
		setOpenDeleteDialog(true);
	};

	const handleDeleteDialogClose = () => {
		setDeleteID(null);
		setOpenDeleteDialog(false);
	};

	// Handlers
	const handleAddData = (item) => {
		const newData = [...data];

		newData.push(item);

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
		// Getting statuses and updating state
		handleGetData()
			.then((data) => {
				// Default sort asc name
				if (data !== false) {
					// Rendering data
					setHaveData(true);
				} else {
					throw new Error("Failed to fetch pause reasons.");
				}
			})
			.catch((err) => dispatch(showError("Failed to fetch pause reasons.")));
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
				dispatch(showError("Failed to fetch application details."));
				return false;
			}
		};

		// Getting application and updating state
		if (state === null) {
			getApplicationData();
		} else {
			setApplicationName(state?.applicationName);
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

	const { adminType } = getLocalStorageData("me");

	const isReseller = adminType === RESELLER_ID;

	return (
		<div className="container">
			<TabTitle title={`${applicationName} Pause Reasons`} />
			{/* START DIALOGS */}
			<HistoryBar
				id={id}
				showhistorybar={isHistoryDrawerOpen}
				dispatch={dispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					getApplicationPauseReason(id, pageNumber, pageSize)
				}
			/>
			<AddPauseDialog
				open={openAddDialog}
				closeHandler={handleAddDialogClose}
				applicationID={id}
				handleAddData={handleAddData}
			/>
			<EditPauseDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				editData={editData}
				handleRemoveSubcat={handleRemoveSubcat}
				handleAddSubcat={handleAddSubcat}
				handleEditData={handleEditData}
				handleUpdateSubcatStateName={handleUpdateSubcat}
			/>
			<DeleteDialog
				entityName="Pause"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteID={deleteID}
				deleteEndpoint="/api/ApplicationPauses"
				handleRemoveData={handleRemoveData}
			/>
			{/* END DIALOGS */}

			<div className="topContainerCustomCaptions">
				<NavDetails
					staticCrumbs={[
						{ id: 1, name: "Applications", url: appPath + applicationListPath },
						{
							id: 2,
							name: state !== null ? state?.applicationName : applicationName,
						},
					]}
				/>
				<div className="application-history-nav">
					{haveData && !isReseller ? (
						<div>
							<ActionButtons handleAddDialogOpen={handleAddDialogOpen} />
						</div>
					) : null}

					<div
						className="restore"
						onClick={() => dispatch(setHistoryDrawerState(true))}
					>
						<RestoreIcon />
					</div>
				</div>
			</div>

			{haveData ? (
				<>
					<NavButtons
						navigation={navigation}
						// TODO: below application name needs to be updated to reflect applicationName
						// from fetched data
						applicationName={
							state !== undefined ? state?.applicationName : applicationName
						}
						current="Reason Definitions"
					/>

					<div className="detailsContainer">
						<DetailsPanel
							header={"Pause Reasons"}
							dataCount={haveData ? data.length : 0}
							description="Create and manage Pause Reasons"
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
													variant="standard"
													value={searchQuery}
													onChange={(e) => {
														setSearchQuery(e.target.value);
													}}
													label="Search Pauses"
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
												variant="standard"
												value={searchQuery}
												onChange={(e) => {
													setSearchQuery(e.target.value);
												}}
												label="Search Pauses"
											/>
										</Grid>
									</Grid>
								</AC.SearchInner>
							</AC.SearchContainerMobile>
						</div>
					</div>

					<PausesTable
						data={data}
						setData={setData}
						handleSort={handleSort}
						searchQuery={searchQuery}
						currentTableSort={currentTableSort}
						setCurrentTableSort={setCurrentTableSort}
						searchedData={searchedData}
						setSearchedData={setSearchedData}
						handleEditDialogOpen={handleEditDialogOpen}
						handleDeleteDialogOpen={handleDeleteDialogOpen}
						isReseller={isReseller}
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

export default PausesContent;
