import React, { useState, useEffect, useCallback } from "react";
import API from "helpers/api";
import ContentStyle from "styles/application/ContentStyle";
import CircularProgress from "@mui/material/CircularProgress";
import NavDetails from "components/Elements/NavDetails";
import ActionButtons from "./ActionButtons";
import NavButtons from "components/Elements/NavButtons";
import DetailsPanel from "components/Elements/DetailsPanel";
import DeleteDialog from "components/Elements/DeleteDialog";
import DefectRiskRatingsTable from "./DefectRiskRatingsTable";
import DefaultDialog from "components/Elements/DefaultDialog";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import Grid from "@mui/material/Grid";
import { getLocalStorageData, handleSort } from "helpers/utils";
import { useSelector } from "react-redux";
// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import { appPath, applicationListPath } from "helpers/routePaths";
import TabTitle from "components/Elements/TabTitle";
import { setHistoryDrawerState, showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import { RESELLER_ID } from "constants/UserConstants/indes";
import RestoreIcon from "@mui/icons-material/Restore";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { getApplicationDefectRiskRatings } from "services/History/application";
// Init styled components
const AC = ContentStyle();

const DefectRiskRatingsContent = ({ navigation, id, setIs404, state }) => {
	// Init state
	const [applicationName, setApplicationName] = useState("");
	const [defaultData, setDefaultData] = useState(null);
	const [data, setData] = useState([]);
	const [haveData, setHaveData] = useState(false);
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [dataChanged, setDataChanged] = useState(false);
	const [openDefaultDialog, setOpenDefaultDialog] = useState(false);
	const [confirmDefault, setConfirmDefault] = useState([null, null]);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editData, setEditData] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchedData, setSearchedData] = useState([]);
	const dispatch = useDispatch();
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);

	const handleGetData = useCallback(async () => {
		// Attempting to get data
		try {
			// Getting data from API
			let result = await API.get(
				`/api/ApplicationDefectRiskRatings?applicationId=${id}`
			);

			// if success, adding data to state
			if (result.status === 200) {
				// Updating state
				result.data.forEach((d, index) => {
					d.isDefault = false;

					result.data[index] = d;
				});

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
			dispatch(showError("Failed to fetch defect risk ratings"));
			return false;
		}
	}, [id, setIs404]);

	const handleAddDialogOpen = () => {
		setOpenAddDialog(true);
	};

	const handleAddDialogClose = () => {
		setOpenAddDialog(false);
	};

	const handleSetDefault = (defaultID) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === defaultID);

		if (index >= 0) {
			newData[index].isDefault = true;
		}

		// Updating state
		setData(newData);
	};

	const handleEditDialogClose = () => {
		setOpenEditDialog(false);
	};

	const handleEditDialogOpen = (id) => {
		let index = data.findIndex((el) => el.id === id);

		if (index >= 0) {
			setEditData(data[index]);
			setOpenEditDialog(true);
		}
	};

	const handleDefaultDialogOpen = (id, name) => {
		setConfirmDefault([id, name]);
		setOpenDefaultDialog(true);
	};

	const handleDefaultDialogClose = () => {
		setOpenDefaultDialog(false);
	};

	const handleDefaultUpdate = async () => {
		// Attempting to update default
		try {
			// Patching change to API
			const result = await API.patch(`/api/Applications/${id}`, [
				{
					op: "replace",
					path: "defaultSafetyCriticalDefectRiskRatingID",
					value: confirmDefault[0],
				},
			]);

			// If success, updating default in state
			if (result.status === 200) {
				// Updating state
				handleSetDefault(confirmDefault[0]);

				// Updating default state
				setDefaultData(confirmDefault[0]);

				return true;
			} else {
				dispatch(showError("Failed to update defect risk rating"));
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			dispatch(showError("Failed to update defect risk rating"));
			return false;
		}
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
			// Pushing current data to results arr if containes search
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
			.then((data) => {
				if (data) {
					// Defaulting to asc name for sort
					setHaveData(true);
				} else {
					throw new Error("Unable to get data");
				}
			})
			.catch((err) =>
				dispatch(showError("Failed to fetch defect risk ratings."))
			);
	}, [handleGetData]);

	// Fetch side effect to get application details
	useEffect(() => {
		const getApplicationData = async () => {
			// Attempting to get data
			try {
				// Getting data from API
				let result = await API.get(`/api/Applications/${id}/defaults`);

				// if success, adding data to state
				if (result.status === 200) {
					// Setting application name
					setApplicationName(result.data.name);

					// Setting default
					setDefaultData(result.data.defaultSafetyCriticalDefectRiskRatingID);
				} else {
					// If error, throwing to catch
					throw new Error(result);
				}
			} catch (err) {
				// TODO: real error handling
				dispatch(showError("Failed to fetch application details"));
				return false;
			}
		};

		// Getting application and updating state
		getApplicationData();

		// eslint-disable-next-line
	}, []);

	// Fetch side effect to update default
	useEffect(() => {
		// Updating default item if not null
		if (defaultData !== null) {
			handleSetDefault(defaultData);
		}
		// eslint-disable-next-line
	}, [defaultData]);

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
			<TabTitle title={`${applicationName} Defect Risk Ratings`} />
			{/* START DIALOGS */}
			<HistoryBar
				id={id}
				showhistorybar={isHistoryDrawerOpen}
				dispatch={dispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					getApplicationDefectRiskRatings(id, pageNumber, pageSize)
				}
			/>
			<AddDialog
				open={openAddDialog}
				closeHandler={handleAddDialogClose}
				applicationID={id}
				handleAddData={handleAddData}
			/>
			<EditDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				data={editData}
				handleEditData={handleEditData}
			/>
			<DefaultDialog
				open={openDefaultDialog}
				closeHandler={handleDefaultDialogClose}
				data={confirmDefault}
				entity="Safety Critical Risk Rating"
				handleDefaultUpdate={handleDefaultUpdate}
			/>
			<DeleteDialog
				entityName="Defect Risk Rating"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint="/api/ApplicationDefectRiskRatings"
				deleteID={deleteID}
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
				/>{" "}
				<div className="application-history-nav">
					{haveData && !isReseller ? (
						<div>
							<ActionButtons addOpen={handleAddDialogOpen} />
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
						current="Defect Definitions"
					/>

					<div className="detailsContainer">
						<DetailsPanel
							header={"Defect Risk Ratings"}
							dataCount={haveData ? data.length : 0}
							description="Create and manage Defect Risk Ratings"
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
													label="Search Defect Risk Ratings"
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
												label="Search Defect Risk Ratings"
											/>
										</Grid>
									</Grid>
								</AC.SearchInner>
							</AC.SearchContainerMobile>
						</div>
					</div>

					<DefectRiskRatingsTable
						data={data}
						setData={setData}
						handleSort={handleSort}
						defaultID={defaultData}
						searchQuery={searchQuery}
						openDefaultDialog={handleDefaultDialogOpen}
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

export default DefectRiskRatingsContent;
