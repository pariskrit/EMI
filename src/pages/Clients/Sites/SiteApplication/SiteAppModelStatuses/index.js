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
import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import { useSearch } from "hooks/useSearch";

const SiteAppModelStatuses = ({ state, dispatch, appId, getError }) => {
	const [data, setData] = useState([]);
	const [confirmDefault, setConfirmDefault] = useState([null, null]);
	const [defaultData, setDefaultData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState({
		edit: false,
		delete: false,
		default: false,
	});
	const [editData, setEditData] = useState({});
	const [deleteId, setDeleteId] = useState(null);
	const {
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

			// if success, adding data to state
			if (result.status) {
				setLoading(false);
				// Updating state
				result.data.forEach((d, index) => {
					d.isDefault = false;

					result.data[index] = d;
				});
				setAllData(result.data);
				setData(result.data);

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
	}, [appId]);

	const onEditClick = (id) => {
		let index = data.findIndex((el) => el.id === id);

		if (index >= 0) {
			setEditData(data[index]);
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
		const newData = [...data];
		newData.push(item);
		setData(newData);
	};

	const handleEditData = (d) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		// Updating state
		setData(newData);
	};

	const handleRemoveData = (id) => {
		const newData = [...data].filter(function (item) {
			return item.id !== id;
		});
		// Updating state
		setData(newData);
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

	// useEffect(() => {
	// 	const getApplicationData = async () => {
	// 		// Attempting to get data
	// 		try {
	// 			// Getting data from API
	// 			let result = await API.get(`/api/siteapps/${appId}/defaults`);

	// 			// if success, adding data to state
	// 			if (result.status === 200) {
	// 				// Setting application name

	// 				// Setting default
	// 				setDefaultData(result.data.defaultModelStatusID);
	// 			} else {
	// 				// If error, throwing to catch
	// 				throw new Error(result);
	// 			}
	// 		} catch (err) {
	// 			// TODO: real error handling
	// 			console.log(err);
	// 			return false;
	// 		}
	// 	};

	// 	// Getting application and updating state
	// 	getApplicationData()
	// 		.then(() => {
	// 			console.log("application name updated");
	// 		})
	// 		.catch((err) => console.log(err));
	// 	// eslint-disable-next-line
	// }, []);

	useEffect(() => {
		handleGetData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const mainData = searchQuery.length === 0 ? data : searchedData;

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
					dataCount={data.length}
					description="Create and manage Model Statuses"
				/>

				<SearchField searchQuery={searchQuery} setSearchQuery={handleSearch} />

				<MobileSearchField
					searchQuery={searchQuery}
					setSearchQuery={handleSearch}
				/>
			</div>
			<ModelStatusesTable
				setData={setData}
				data={mainData}
				defaultID={defaultData}
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
