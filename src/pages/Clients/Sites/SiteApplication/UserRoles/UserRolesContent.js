import React, { useState, useCallback, useEffect } from "react";
import { useSearch } from "hooks/useSearch";
import AddDialog from "./AddDialog";
import CommonBody from "components/Modules/CommonBody";
import { handleSort } from "helpers/utils";

import DetailsPanel from "components/Elements/DetailsPanel";
import SearchField from "components/Elements/SearchField/SearchField";
import { getRoles } from "services/clients/sites/siteApplications/userRoles";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import EditDialog from "./EditDialog";
import DeleteDialog from "components/Elements/DeleteDialog";

const UserRolesContent = ({ id, setIs404, getError, state, dispatch }) => {
	const [haveData, setHaveData] = useState(false);
	const [loading, setLoading] = useState(false);
	const [editData, setEditData] = useState({});
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [dataChanged, setDataChanged] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const {
		allData,
		setAllData,
		handleSearch,
		searchedData,
		searchQuery,
		setSearchData,
	} = useSearch();

	const handleGetData = useCallback(async () => {
		setLoading(true);
		try {
			//Getting data from API
			let result = await getRoles(id);

			//if success, add data to state
			if (result.status) {
				setAllData(result.data);
				handleSort(result.data, setAllData, "name", "asc");
				setLoading(false);
				return true;
			} else if (result.status === 404) {
				setIs404(true);
				return;
			} else {
				//If error, throw to catch
				throw new Error(result);
			}
		} catch (err) {
			//Error Handling
			console.log(err);
			return false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, setIs404]);

	useEffect(() => {
		handleGetData()
			.then(() => {
				// Rendering data
				setHaveData(true);
			})
			.catch((err) => console.log(err));
	}, [handleGetData]);

	const handleAddData = (item) => {
		const newData = [...allData];
		newData.push(item);
		setAllData(newData);
		setDataChanged(true);
	};

	//Delete
	const handleDeleteDialogOpen = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const handleRemoveData = (id) =>
		setAllData([...allData.filter((d) => d.id !== id)]);

	//Edit

	const handleEditData = (d) => {
		const newData = [...allData];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		// Updating state
		setAllData(newData);

		setDataChanged(true);
	};

	const handleEditDialogOpen = (id) => {
		let index = allData.findIndex((el) => el.id === id);

		if (index >= 0) {
			setEditData(allData[index]);
			setOpenEditDialog(true);
		}
	};

	const handleEditDialogClose = () => {
		setOpenEditDialog(false);
	};

	useEffect(() => {
		if (dataChanged) {
			handleSort(allData, setAllData, "name", "asc");

			setDataChanged(false);
		}
		// eslint-disable-next-line
	}, [dataChanged]);

	//Rendering content, otherwise, 404 error
	const mainData = searchQuery.length === 0 ? allData : searchedData;

	return (
		<div className="container">
			<AddDialog
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "ADD_TOGGLE" })}
				applicationID={id}
				handleAddData={handleAddData}
				getError={getError}
			/>

			<DeleteDialog
				entityName="Role"
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteId}
				deleteEndpoint="/api/roles"
				handleRemoveData={handleRemoveData}
			/>

			<EditDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				data={editData}
				handleEditData={handleEditData}
				getError={getError}
			/>

			<CommonBody {...{ haveData }}>
				<>
					<div className="detailsContainer">
						<DetailsPanel
							header="Roles"
							dataCount={haveData ? allData.length : 0}
							description="Create and manage Roles"
						/>

						<SearchField
							searchQuery={searchQuery}
							setSearchQuery={handleSearch}
							header="Roles"
						/>
						<MobileSearchField
							searchQuery={searchQuery}
							setSearchQuery={handleSearch}
							header="Roles"
						/>
					</div>

					<CommonApplicationTable
						data={mainData}
						setData={setAllData}
						setSearch={setSearchData}
						searchQuery={searchQuery}
						columns={["name", "canRegisterDefects"]}
						headers={["Name", "Can Raise Defects"]}
						isLoading={loading}
						menuData={[
							{
								name: "Edit",
								handler: handleEditDialogOpen,
								isDelete: false,
							},
							{
								name: "Delete",
								handler: handleDeleteDialogOpen,
								isDelete: true,
							},
						]}
					/>
				</>
			</CommonBody>
		</div>
	);
};

export default UserRolesContent;
