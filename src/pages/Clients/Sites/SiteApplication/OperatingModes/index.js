import React, { useContext, useEffect, useState } from "react";
import DetailsPanel from "components/Elements/DetailsPanel";
import OperatingModesTable from "./OperatingModesTable";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import { getOperatingModes } from "services/clients/sites/siteApplications/operatingModes";
import { SiteContext } from "contexts/SiteApplicationContext";
import DeleteDialog from "components/Elements/DeleteDialog";
import { useSearch } from "hooks/useSearch";
import DefaultDialog from "components/Elements/DefaultDialog";
import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";

function OperatingModes({ appId }) {
	const [data, setData] = useState([]);
	const [dataToEdit, setDataToEdit] = useState({});
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDefaultDialog, setOpenDefaultDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [{ showAdd }, dispatch] = useContext(SiteContext);
	const [confirmDefault, setConfirmDefault] = useState([]);
	const {
		searchQuery,
		searchedData,
		handleSearch,
		setAllData,
		setSearchData,
	} = useSearch();

	const fetchOperatingModesLists = async () => {
		const result = await getOperatingModes(appId);
		setData(result.data);
		setAllData(result.data);
	};

	const closeAddModal = () => dispatch({ type: "ADD_TOGGLE" });

	const addData = (newData) => setData([...data, newData]);

	const onOpenDeleteDialog = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const onOpenEditDialog = (id) => {
		let index = data.findIndex((el) => el.id === id);

		setDataToEdit(data[index]);
		setOpenEditDialog(true);
	};

	const onOpenDefaultDialog = (id, name) => {
		setConfirmDefault([id, name]);
		setOpenDefaultDialog(true);
	};

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const closeEditDialog = () => setOpenEditDialog(false);

	const closeDefaultDialog = () => setOpenDefaultDialog(false);

	const handleRemoveData = (id) =>
		setData([...data.filter((d) => d.id !== id)]);

	const handleEditData = (editedData) => {
		const newList = [...data];
		const index = newList.findIndex((data) => data.id === editedData.id);
		newList.splice(index, 1, editedData);
		setData(newList);
	};

	// const handleDefaultUpdate = async () => {
	// 	// Attempting to update default
	// 	try {
	// 		console.log(confirmDefault[0]);
	// 		// Patching change to API

	// 		const result = await API.patch(`${BASE_API_PATH}.siteapps/${id}`, [
	// 			{
	// 				op: "replace",
	// 				path: "defaultOperatingModeID",
	// 				value: confirmDefault[0],
	// 			},
	// 		]);

	// 		// If success, updating default in state
	// 		if (result.status === 200) {
	// 			// Updating state
	// 			handleSetDefault(confirmDefault[0]);

	// 			// Updating default state
	// 			setDefaultData(confirmDefault[0]);

	// 			return true;
	// 		} else {
	// 			throw new Error(result);
	// 		}
	// 	} catch (err) {
	// 		// TODO: real error handling
	// 		console.log(err);

	// 		return false;
	// 	}
	// };

	useEffect(() => {
		fetchOperatingModesLists();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<DefaultDialog
				open={openDefaultDialog}
				closeHandler={closeDefaultDialog}
				data={confirmDefault}
				entity="Operating Mode"
				// handleDefaultUpdate={handleDefaultUpdate}
			/>
			<DeleteDialog
				entityName="Operating Mode"
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteId}
				deleteEndpoint="/api/operatingmodes"
				handleRemoveData={handleRemoveData}
			/>
			<AddDialog
				open={showAdd}
				closeHandler={closeAddModal}
				applicationID={appId}
				handleAddData={addData}
			/>
			<EditDialog
				open={openEditDialog}
				closeHandler={closeEditDialog}
				data={dataToEdit}
				handleEditData={handleEditData}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Operating Modes"}
					dataCount={2}
					description="Create and manage Operating Modes"
				/>
				<SearchField searchQuery={searchQuery} setSearchQuery={handleSearch} />
				<MobileSearchField
					searchQuery={searchQuery}
					setSearchQuery={handleSearch}
				/>
			</div>

			<OperatingModesTable
				currentTableSort={currentTableSort}
				data={data}
				openDefaultDialog={onOpenDefaultDialog}
				handleEditDialogOpen={onOpenEditDialog}
				handleDeleteDialogOpen={onOpenDeleteDialog}
				searchedData={searchedData}
				searchQuery={searchQuery}
				setSearchedData={setSearchData}
				setCurrentTableSort={setCurrentTableSort}
			/>
		</>
	);
}

export default OperatingModes;
