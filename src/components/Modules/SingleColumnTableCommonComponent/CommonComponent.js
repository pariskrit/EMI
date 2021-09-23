import DeleteDialog from "components/Elements/DeleteDialog";
import DetailsPanel from "components/Elements/DetailsPanel";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import SearchField from "components/Elements/SearchField/SearchField";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import { handleSort } from "helpers/utils";
import { useSearch } from "hooks/useSearch";
import React, { useCallback, useEffect, useState } from "react";
//import ContentStyle from "styles/application/ContentStyle";
import CommonBody from "../CommonBody";
// Icon Import
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";

// Show Default
import DefaultDialog from "components/Elements/DefaultDialog";

// Init styled components
//const AC = ContentStyle();

const CommonContent = ({
	id,
	setIs404,
	getError,
	header,
	state,
	dispatch,
	apis,
	showDefault,
	pathToPatch,
}) => {
	// Init state
	const [data, setData] = useState([]);
	const [haveData, setHaveData] = useState(false);
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [dataChanged, setDataChanged] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editData, setEditData] = useState({});
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [loading, setLoading] = useState(false);
	const {
		setAllData,
		handleSearch,
		searchedData,
		searchQuery,
		setSearchData,
	} = useSearch();

	// Show Default
	const [openDefaultDialog, setOpenDefaultDialog] = useState(false);
	const [confirmDefault, setConfirmDefault] = useState([null, null]);
	const [defaultData, setDefaultData] = useState(null);

	// Handlers
	const handleGetData = useCallback(async () => {
		// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
		// to caching), which should technically prevent unrequired backend calls
		// Attempting to get data
		setLoading(true);
		try {
			// Getting data from API
			let result = await apis.getAPI(id);

			// if success, adding data to state
			if (result.status) {
				setAllData(result.data);
				handleSort(result.data, setData, "name", "asc");
				setLoading(false);
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

	useEffect(() => {
		if (dataChanged) {
			handleSort(data, setData, currentTableSort[0], currentTableSort[1]);

			setDataChanged(false);
		}
		// eslint-disable-next-line
	}, [dataChanged]);

	const mainData = searchQuery.length === 0 ? data : searchedData;

	//ShowDefault

	const handleDefaultDialogOpen = (id, name) => {
		setConfirmDefault([id, name]);
		setOpenDefaultDialog(true);
	};

	const handleDefaultDialogClose = () => {
		setOpenDefaultDialog(false);
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

	const handleDefaultUpdate = async () => {
		// Attempting to update default
		try {
			console.log(confirmDefault[0]);
			// Patching change to API
			const result = await apis.patchDefaultAPI(id, [
				{
					op: "replace",
					path: pathToPatch,
					value: confirmDefault[0],
				},
			]);

			// If success, updating default in state
			if (result.status) {
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

	// Fetch side effect to get application details
	useEffect(() => {
		const getApplicationData = async () => {
			// Attempting to get data
			try {
				// Getting data from API
				let result = await apis.getDefaultAPI(id);

				// if success, adding data to state
				if (result.status) {
					// Setting default
					setDefaultData(result.data.defaultFeedbackClassificationID);
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

	// console.log("sagar", defaultData);

	return (
		<div className="container">
			{/* Start of dialogs */}
			<AddDialog
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "ADD_TOGGLE" })}
				applicationID={id}
				handleAddData={handleAddData}
				getError={getError}
				header={header}
				postAPI={apis.postAPI}
			/>
			<EditDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				data={editData}
				handleEditData={handleEditData}
				getError={getError}
				patchAPI={apis.patchAPI}
				header={header}
			/>
			<DeleteDialog
				entityName={header}
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint={apis.deleteAPI}
				deleteID={deleteID}
				handleRemoveData={handleRemoveData}
			/>

			{showDefault && (
				<DefaultDialog
					open={openDefaultDialog}
					closeHandler={handleDefaultDialogClose}
					data={confirmDefault}
					entity={header}
					handleDefaultUpdate={handleDefaultUpdate}
				/>
			)}

			{/* Spinner should start here */}

			<CommonBody {...{ haveData }}>
				<>
					<div className="detailsContainer">
						<DetailsPanel
							header={header}
							dataCount={haveData ? data.length : 0}
							description={`Create and manage ${header}`}
						/>

						<SearchField
							searchQuery={searchQuery}
							setSearchQuery={handleSearch}
						/>
						<MobileSearchField
							searchQuery={searchQuery}
							setSearchQuery={handleSearch}
						/>
					</div>

					{!showDefault ? (
						<CommonApplicationTable
							data={mainData}
							columns={["name"]}
							headers={["Name"]}
							setData={setData}
							onEdit={handleEditDialogOpen}
							onDelete={(id) => handleDeleteDialogOpen(id)}
							setSearch={setSearchData}
							searchQuery={searchQuery}
							isLoading={loading}
						/>
					) : (
						<CommonApplicationTable
							data={mainData}
							columns={["name"]}
							headers={["Name"]}
							setData={setData}
							onEdit={handleEditDialogOpen}
							onDelete={(id) => handleDeleteDialogOpen(id)}
							setSearch={setSearchData}
							searchQuery={searchQuery}
							isLoading={loading}
							openDefaultDialog={handleDefaultDialogOpen}
							showDefault={showDefault}
							defaultID={defaultData}
						/>
					)}
				</>
			</CommonBody>
		</div>
	);
};

export default CommonContent;
