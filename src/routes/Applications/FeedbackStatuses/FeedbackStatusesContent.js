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
import FeedbackStatusesTable from "./FeedbackStatusesTable";
import DefaultDialog from "../../../components/DefaultDialog";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import Grid from "@material-ui/core/Grid";
import { handleSort } from "../../../helpers/utils";

// Icon Import
import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";

// Init styled components
const AC = ContentStyle();

const FeedbackStatusesContent = ({ navigation, id, setIs404, state }) => {
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

	const handleGetData = useCallback(async () => {
		// Attempting to get data
		try {
			// Getting data from API
			let result = await API.get(
				`/api/ApplicationFeedbackStatuses?applicationId=${id}`
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
			console.log(err);
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
			console.log(confirmDefault[0]);
			// Patching change to API
			const result = await API.patch(`/api/Applications/${id}`, [
				{
					op: "replace",
					path: "defaultFeedbackStatusID",
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
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			console.log(err);

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
			.catch((err) => console.log(err));
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
					setDefaultData(result.data.defaultFeedbackStatusID);
				} else {
					// If error, throwing to catch
					throw new Error(result);
				}
			} catch (err) {
				// TODO: real error handling
				console.log(err);
				return false;
			}
		};

		// Getting application and updating state
		getApplicationData()
			.then(() => {
				console.log("application name updated");
			})
			.catch((err) => console.log(err));
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

	return (
		<div className="container">
			{/* START DIALOGS */}
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
				entity="Feedback Status"
				handleDefaultUpdate={handleDefaultUpdate}
			/>
			<DeleteDialog
				entityName="Feedback Status"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint="/api/ApplicationFeedbackStatuses"
				deleteID={deleteID}
				handleRemoveData={handleRemoveData}
			/>
			{/* END DIALOGS */}

			<div className="topContainerCustomCaptions">
				<Navcrumbs
					crumbs={[
						"Application",
						state !== undefined ? state.applicationName : applicationName,
					]}
				/>
				{haveData ? (
					<div>
						<ActionButtons addOpen={handleAddDialogOpen} />
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
						current="Feedback Definitions"
					/>

					<div className="detailsContainer">
						<DetailsPanel
							header={"Feedback Statuses"}
							dataCount={haveData ? data.length : 0}
							description="Create and manage Feedback Statuses"
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
													label="Search Feedback Statuses"
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
												label="Search Feedback Statuses"
											/>
										</Grid>
									</Grid>
								</AC.SearchInner>
							</AC.SearchContainerMobile>
						</div>
					</div>

					<FeedbackStatusesTable
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

export default FeedbackStatusesContent;
