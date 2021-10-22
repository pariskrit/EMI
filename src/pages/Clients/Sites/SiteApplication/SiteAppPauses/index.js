import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import DetailsPanel from "components/Elements/DetailsPanel";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import { handleSort } from "helpers/utils";
import AddDialog from "./AddDialog/AddDialog";
import EditDialog from "./EditDialog/EditDialog";
import DeleteDialog from "components/Elements/DeleteDialog";
import { showError } from "redux/common/actions";
import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import { useSearch } from "hooks/useSearch";
import { getPauses } from "services/clients/sites/siteApplications/pauses";

const SiteAppPauses = ({ state, dispatch, appId, getError }) => {
	const [modal, setModal] = useState({ edit: false, delete: false });
	const [deleteId, setDeleteId] = useState(null);
	const [editData, setEditData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [is404, setIs404] = useState(false);
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
		console.log(parentId, subcatID, newName);
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
		setModal((th) => ({ ...th, delete: true }));
	};

	const handleGetData = useCallback(async () => {
		setLoading(true);
		try {
			let result = await getPauses(appId);
			if (result.status) {
				const mainData = result.data.map((x) => ({
					...x,
					totalSub: x.pauseSubcategories.length,
				}));
				setAllData(mainData);
				handleSort(mainData, setAllData, "name", "asc");
				setLoading(false);
				return result;
			} else {
				setIs404(true);
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
		newData[index] = { ...d, totalSub: d.pauseSubcategories.length };

		// Updating state
		setAllData(newData);
	};

	useEffect(() => {
		handleGetData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const {
		showAdd,
		details: { data },
		defaultCustomCaptionsData: { pauseReason, pauseReasonPlural },
	} = state;

	console.log(state.details);

	if (is404 === false) {
		return (
			<div>
				<AddDialog
					open={showAdd}
					closeHandler={() => dispatch({ type: "ADD_TOGGLE" })}
					applicationID={appId}
					handleAddData={handleAddData}
					getError={getError}
					header={data?.pauseReasonCC || pauseReason}
				/>
				<DeleteDialog
					entityName={data?.pauseReasonCC || pauseReason}
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
					header={data?.pauseReasonCC || pauseReason}
				/>
				<div className="detailsContainer">
					<DetailsPanel
						header={data?.pauseReasonPluralCC || pauseReasonPlural}
						dataCount={allData.length}
						description={`Create and manage ${
							data?.pauseReasonPluralCC || pauseReasonPlural
						}`}
					/>
					<SearchField
						searchQuery={searchQuery}
						setSearchQuery={handleSearch}
						header={data?.pauseReasonPluralCC || pauseReasonPlural}
					/>
					<MobileSearchField
						searchQuery={searchQuery}
						setSearchQuery={handleSearch}
						header={data?.pauseReasonPluralCC || pauseReasonPlural}
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
	} else {
		return <p>404: Application id {appId} does not exist.</p>;
	}
};

const mapDispatchToProps = (dispatch) => ({
	getError: (message) => dispatch(showError(message)),
});

export default connect(null, mapDispatchToProps)(SiteAppPauses);
