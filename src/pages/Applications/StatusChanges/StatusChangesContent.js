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
import AddStatusChangeDialog from "./AddDialog";
import EditStatusChangeDialog from "./EditDialog";
import { getLocalStorageData, handleSort } from "helpers/utils";
import { setHistoryDrawerState, showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import SingleHeadTable from "components/Modules/SingleHeadTable";
import { appPath, applicationListPath } from "helpers/routePaths";
import TabTitle from "components/Elements/TabTitle";
import { RESELLER_ID } from "constants/UserConstants/indes";
import RestoreIcon from "@mui/icons-material/Restore";
import { useSelector } from "react-redux";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { getApplicationChangeStatusReason } from "services/History/application";

// Init styled components
const AC = ContentStyle();

const StatusChangesContent = ({ navigation, id, setIs404, state }) => {
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
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [searchedData, setSearchedData] = useState([]);

	const dispatch = useDispatch();
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);

	// Handlers
	const handleGetData = useCallback(async () => {
		// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
		// to caching), which should technically prevent unrequired backend calls
		// Attempting to get data
		try {
			// Getting data from API
			let result = await API.get(
				`/api/ApplicationChangeStatusReasons?applicationId=${id}`
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
			dispatch(showError("Failed to fetch status changes."));
			return false;
		}
	}, [id, setIs404]);

	const handleAddData = (d) => {
		const newData = [...data];

		newData.push(d);

		setData(newData);

		setDataChanged(true);
	};

	const handleEditChange = (d) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

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
		} else {
			let results = [];

			// Checking data
			for (let i = 0; i < data.length; i++) {
				// Pushing current data to results arr if contains search
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
			.catch((err) => dispatch(showError("Failed to fetch status changes.")));
	}, [handleGetData]);

	// Fetch side effect to get application details
	useEffect(() => {
		const getApplicationData = async () => {
			// Attempting to get application data
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
			<TabTitle title={`${applicationName} Status Change Reasons`} />
			{/* Start dialogs */}
			<HistoryBar
				id={id}
				showhistorybar={isHistoryDrawerOpen}
				dispatch={dispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					getApplicationChangeStatusReason(id, pageNumber, pageSize)
				}
			/>
			<AddStatusChangeDialog
				open={openAddDialog}
				closeHandler={handleAddDialogClose}
				applicationID={id}
				handleAddData={handleAddData}
			/>
			<EditStatusChangeDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				data={editData}
				handleEditData={handleEditChange}
			/>
			<DeleteDialog
				entityName="Status Change"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint="/api/ApplicationChangeStatusReasons"
				deleteID={deleteID}
				handleRemoveData={handleRemoveData}
			/>
			{/* End dialogs */}
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
						applicationName={
							state !== undefined ? state?.applicationName : applicationName
						}
						current="Reason Definitions"
					/>

					<div className="detailsContainer">
						<DetailsPanel
							header={"Status Changes"}
							dataCount={haveData ? data.length : 0}
							description="Create and manage status changes"
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
													label="Search status changes"
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
												label="Search status changes"
											/>
										</Grid>
									</Grid>
								</AC.SearchInner>
							</AC.SearchContainerMobile>
						</div>
					</div>

					<SingleHeadTable
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
						isReadOnly={isReseller}
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

export default StatusChangesContent;
