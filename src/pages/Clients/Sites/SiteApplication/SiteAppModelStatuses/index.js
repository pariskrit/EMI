import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import API from "helpers/api";
import DetailsPanel from "components/Elements/DetailsPanel";
import DeleteDialog from "components/Elements/DeleteDialog";
import DefaultDialog from "components/Elements/DefaultDialog";
import AddStatusDialog from "./AddDialog";
import EditStatusDialog from "./EditDialog";
import ModelStatusesTable from "./ModelStatusesTable";
import { showError } from "redux/common/actions";
import { getModelStatuses } from "services/clients/sites/siteApplications/modelStatuses";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import { useSearch } from "hooks/useSearch";

const SiteAppModelStatuses = ({ state, dispatch, appId, getError }) => {
	const [confirmDefault, setConfirmDefault] = useState([null, null]);
	const [defaultId, setDefaultId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState({
		edit: false,
		delete: false,
		default: false,
	});
	const [editData, setEditData] = useState({});
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
		// Attempting to get data
		try {
			// Getting data from API
			let result = await getModelStatuses(appId);
			let res = await getSiteApplicationDetail(appId);
			// if success, adding data to state
			if (result.status) {
				setLoading(false);

				setDefaultId(res?.data?.defaultModelStatusID);
				setAllData(result?.data);

				return true;
			} else {
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			setLoading(false);
			console.log(err);
			return false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appId]);

	const onEditClick = (id) => {
		let index = allData.findIndex((el) => el.id === id);

		if (index >= 0) {
			setEditData(allData[index]);
			setModal((th) => ({ ...th, edit: true }));
		}
	};

	const onDeleteClick = (id) => {
		setModal((th) => ({ ...th, delete: true }));
		setDeleteId(id);
	};

	const onDefaultClick = (id, name) => {
		setConfirmDefault([id, name]);
		setModal((th) => ({ ...th, default: true }));
	};

	const handleAddData = (item) => {
		const newData = [...allData];
		newData.push(item);
		setAllData(newData);
	};

	const handleEditData = (d) => {
		const newData = [...allData];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		// Updating state
		setAllData(newData);
	};

	const handleRemoveData = (id) => {
		const newData = [...allData].filter(function (item) {
			return item.id !== id;
		});
		// Updating state
		setAllData(newData);
	};

	const handleDefaultUpdate = async () => {
		// Attempting to update default
		try {
			// Patching change to API
			const result = await API.patch(`/api/siteapps/${appId}`, [
				{
					op: "replace",
					path: "defaultModelStatusID",
					value: confirmDefault[0],
				},
			]);

			// If success, updating default in state
			if (result.status === 200) {
				// Updating default state
				setDefaultId(confirmDefault[0]);

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

	useEffect(() => {
		handleGetData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const mainData = searchQuery.length === 0 ? allData : searchedData;

	return (
		<div>
			<AddStatusDialog
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "ADD_TOGGLE" })}
				applicationID={appId}
				handleAddData={handleAddData}
				getError={getError}
			/>
			<EditStatusDialog
				open={modal.edit}
				data={editData}
				closeHandler={() => setModal((th) => ({ ...th, edit: false }))}
				handleEditData={handleEditData}
				getError={getError}
			/>
			<DefaultDialog
				open={modal.default}
				closeHandler={() => setModal((th) => ({ ...th, default: false }))}
				data={confirmDefault}
				entity="Status"
				handleDefaultUpdate={handleDefaultUpdate}
			/>
			<DeleteDialog
				entityName="Model Status"
				open={modal.delete}
				closeHandler={() => {
					setDeleteId(null);
					setModal((th) => ({ ...th, delete: false }));
				}}
				deleteEndpoint="/api/modelstatuses"
				deleteID={deleteId}
				handleRemoveData={handleRemoveData}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Model Statuses"}
					dataCount={allData.length}
					description="Create and manage Model Statuses"
				/>

				<SearchField searchQuery={searchQuery} setSearchQuery={handleSearch} />

				<MobileSearchField
					searchQuery={searchQuery}
					setSearchQuery={handleSearch}
				/>
			</div>
			<ModelStatusesTable
				setData={setAllData}
				data={mainData}
				defaultID={defaultId}
				setSearch={setSearchData}
				onEdit={onEditClick}
				onDelete={onDeleteClick}
				onDefault={onDefaultClick}
				searchQuery={searchQuery}
				isLoading={loading}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (message) => dispatch(showError(message)),
});

export default connect(null, mapDispatchToProps)(SiteAppModelStatuses);
