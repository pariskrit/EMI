import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import DetailsPanel from "components/Elements/DetailsPanel";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";
import { handleSort } from "helpers/utils";
import AddDialog from "./AddDialog/AddDialog";
import EditDialog from "./EditDialog/EditDialog";
import DeleteDialog from "components/Elements/DeleteDialog";
import { showError } from "redux/common/actions";
import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import { useSearch } from "hooks/useSearch";

const SiteAppPauses = ({ state, dispatch, appId, getError }) => {
	const [modal, setModal] = useState({ edit: false, delete: false });
	const [deleteId, setDeleteId] = useState(null);
	const [editData, setEditData] = useState(null);
	const [loading, setLoading] = useState(false);
	const {
		allData,
		setAllData,
		handleSearch,
		searchedData,
		searchQuery,
		setSearchData,
	} = useSearch();

	const handleAddSubcat = (parentId, id, name) => {
		const newData = [...allData];

		let index = newData.findIndex((el) => el.id === parentId);

		newData[index].pauseSubcategories.push({
			pauseID: parentId,
			id: id,
			name: name,
		});

		newData[index].pauseSubcategories.sort((a, b) =>
			a["name"].toString().localeCompare(b["name"].toString())
		);

		newData[index].totalSub = newData[index].totalSub + 1;

		// Updating state
		setAllData(newData);
	};

	const handleUpdateSubcat = (parentId, subcatID, newName) => {
		const newData = [...allData];

		let pauseIndex = newData.findIndex((el) => el.id === parentId);
		let subcatIndex = newData[pauseIndex].pauseSubcategories.findIndex(
			(el) => el.id === subcatID
		);

		newData[pauseIndex].pauseSubcategories[subcatIndex] = {
			pauseID: parentId,
			id: subcatID,
			name: newName,
		};

		newData[pauseIndex].pauseSubcategories.sort((a, b) =>
			a["name"].toString().localeCompare(b["name"].toString())
		);

		// Updating state
		setAllData(newData);
	};

	const handleRemoveSubcat = (sub) => {
		const newData = [...allData];

		let index = newData.findIndex((el) => el.id === sub.pauseID);

		newData[index].pauseSubcategories = newData[
			index
		].pauseSubcategories.filter((item) => {
			return item.id !== sub.id;
		});

		newData[index].pauseSubcategories.sort((a, b) =>
			a["name"].toString().localeCompare(b["name"].toString())
		);

		newData[index].totalSub = newData[index].totalSub - 1;

		// Updating state
		setAllData(newData);
	};

	const handleEditDialogOpen = (id) => {
		setModal((th) => ({ ...th, edit: true }));

		allData.forEach((d) => {
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

	const handleDeleteDialogOpen = (id) => {
		setDeleteId(id);
		setModal((th) => ({ ...modal, delete: true }));
	};

	const handleGetData = useCallback(async () => {
		setLoading(true);
		try {
			let result = await API.get(`${BASE_API_PATH}Pauses?siteAppId=${appId}`);
			if (result.status === 200) {
				const mainData = result.data.map((x) => ({
					...x,
					totalSub: x.pauseSubcategories.length,
				}));
				setAllData(mainData);
				handleSort(mainData, setAllData, "name", "asc");
				setLoading(false);
				return result;
			}
		} catch (err) {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appId]);

	const handleDeleteDialogClose = () => {
		setDeleteId(null);
		setModal((th) => ({ ...th, delete: false }));
	};

	const handleAddData = (item) => {
		const newData = [...allData];
		newData.push(item);
		setAllData(newData);
	};

	const handleRemoveData = (id) => {
		const newData = [...allData].filter(function (item) {
			return item.id !== id;
		});

		// Updating state
		setAllData(newData);
	};

	const handleEditData = (d) => {
		const newData = [...allData];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		// Updating state
		setAllData(newData);
	};

	useEffect(() => {
		handleGetData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<AddDialog
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "ADD_TOGGLE" })}
				applicationID={appId}
				handleAddData={handleAddData}
				getError={getError}
			/>
			<DeleteDialog
				entityName="Pause"
				open={modal.delete}
				closeHandler={handleDeleteDialogClose}
				deleteID={deleteId}
				deleteEndpoint="/api/Pauses"
				handleRemoveData={handleRemoveData}
			/>

			<EditDialog
				open={modal.edit}
				closeHandler={() => setModal((th) => ({ ...th, edit: false }))}
				editData={editData}
				handleRemoveSubcat={handleRemoveSubcat}
				handleAddSubcat={handleAddSubcat}
				handleEditData={handleEditData}
				handleUpdateSubcatStateName={handleUpdateSubcat}
				getError={getError}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Pause Reasons"}
					dataCount={allData.length}
					description="Create and manage Pause Reasons"
				/>
				<SearchField searchQuery={searchQuery} setSearchQuery={handleSearch} />
				<MobileSearchField
					searchQuery={searchQuery}
					setSearchQuery={handleSearch}
				/>
			</div>
			<CommonApplicationTable
				setData={setAllData}
				setSearch={setSearchData}
				searchedData={searchedData}
				searchQuery={searchQuery}
				data={allData}
				columns={["name", "totalSub"]}
				headers={["Name", "Number of subcategories"]}
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
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (message) => dispatch(showError(message)),
});

export default connect(null, mapDispatchToProps)(SiteAppPauses);
