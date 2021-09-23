import DefaultDialog from "components/Elements/DefaultDialog";
import DeleteDialog from "components/Elements/DeleteDialog";
import DetailsPanel from "components/Elements/DetailsPanel";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import SearchField from "components/Elements/SearchField/SearchField";
import CommonBody from "components/Modules/CommonBody";
import { SiteContext } from "contexts/SiteApplicationContext";
import { useSearch } from "hooks/useSearch";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import { getOperatingModes } from "services/clients/sites/siteApplications/operatingModes";
import {
	getSiteApplicationDetail,
	patchApplicationDetail,
} from "services/clients/sites/siteApplications/siteApplicationDetails";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import OperatingModesTable from "./OperatingModesTable";

function OperatingModes({ appId, setError }) {
	const [dataToEdit, setDataToEdit] = useState({});
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDefaultDialog, setOpenDefaultDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [{ showAdd }, dispatch] = useContext(SiteContext);
	const [confirmDefault, setConfirmDefault] = useState([]);
	const {
		allData,
		searchQuery,
		searchedData,
		handleSearch,
		setAllData,
		setSearchData,
	} = useSearch();
	const [defaultId, setDefaultId] = useState(null);
	const [haveData, setHaveData] = useState(false);

	const addData = (newData) => setAllData([...allData, newData]);

	const onOpenDeleteDialog = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const onOpenEditDialog = (id) => {
		let index = allData.findIndex((el) => el.id === id);

		setDataToEdit(allData[index]);
		setOpenEditDialog(true);
	};

	const onOpenDefaultDialog = (id, name) => {
		setConfirmDefault([id, name]);
		setOpenDefaultDialog(true);
	};

	const closeAddModal = () => dispatch({ type: "ADD_TOGGLE" });

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const closeEditDialog = () => setOpenEditDialog(false);

	const closeDefaultDialog = () => setOpenDefaultDialog(false);

	const handleRemoveData = (id) =>
		setAllData([...allData.filter((d) => d.id !== id)]);

	const handleEditData = (editedData) => {
		const newList = [...allData];
		const index = newList.findIndex((data) => data.id === editedData.id);
		newList.splice(index, 1, editedData);
		setAllData(newList);
	};

	const handleDefaultUpdate = async () => {
		const result = await patchApplicationDetail(appId, [
			{
				op: "replace",
				path: "defaultOperatingModeID",
				value: confirmDefault[0],
			},
		]);

		if (result.status) {
			// Updating default state
			setDefaultId(confirmDefault[0]);
		} else {
			setError(result.data.detail);
		}
	};

	const fetchOperatingModesLists = async () => {
		const result = await getOperatingModes(appId);
		const res = await getSiteApplicationDetail(appId);
		setDefaultId(res.data.defaultOperatingModeID);
		setAllData(result.data);
		setHaveData(true);
	};

	useEffect(() => {
		fetchOperatingModesLists();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<CommonBody {...{ haveData }}>
			<DefaultDialog
				open={openDefaultDialog}
				closeHandler={closeDefaultDialog}
				data={confirmDefault}
				entity="Operating Mode"
				handleDefaultUpdate={handleDefaultUpdate}
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
				data={allData}
				defaultID={defaultId}
				openDefaultDialog={onOpenDefaultDialog}
				handleEditDialogOpen={onOpenEditDialog}
				handleDeleteDialogOpen={onOpenDeleteDialog}
				searchedData={searchedData}
				searchQuery={searchQuery}
				setSearchedData={setSearchData}
				setCurrentTableSort={setCurrentTableSort}
			/>
		</CommonBody>
	);
}

const mapDispatchToProps = (dispatch) => ({
	setError: (message) => dispatch(showError(message)),
});

export default connect(null, mapDispatchToProps)(OperatingModes);
