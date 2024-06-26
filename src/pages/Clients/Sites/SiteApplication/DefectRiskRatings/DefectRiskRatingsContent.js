import { handleSort } from "helpers/utils";
import CommonBody from "components/Modules/CommonBody";
import React, { useState, useCallback, useEffect } from "react";
import DetailsPanel from "components/Elements/DetailsPanel";
import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import {
	getDefectRiskRatings,
	getDefaultDefectRiskRatings,
	patchDefaultDefectRiskRatings,
} from "services/clients/sites/siteApplications/defectRiskRatings";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import DeleteDialog from "components/Elements/DeleteDialog";
import DefaultDialog from "components/Elements/DefaultDialog";
import TabTitle from "components/Elements/TabTitle";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

const DefectRiskRatingsContent = ({
	id,
	state,
	dispatch,
	setIs404,
	getError,
}) => {
	const [editData, setEditData] = useState({});
	const [loading, setLoading] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [haveData, setHaveData] = useState(false);
	const [defaultData, setDefaultData] = useState(null);
	const [dataChanged, setDataChanged] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openDefaultDialog, setOpenDefaultDialog] = useState(false);
	const [confirmDefault, setConfirmDefault] = useState([null, null]);
	const errorDispatch = useDispatch();

	const [allData, setAllData] = useState([]);
	const [searchedData, setSearchData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e) => {
		const { value } = e.target;
		setSearchQuery(value);
		const filtered = allData.filter((x) => {
			const regex = new RegExp(value, "gi");
			return x.name.match(regex) || x.action.match(regex);
		});
		setSearchData(filtered);
	};

	const handleGetData = useCallback(async () => {
		setLoading(true);
		try {
			//Getting data from API
			let result = await getDefectRiskRatings(id);

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
			errorDispatch(showError("Failed to load defect risk ratings."));
			return false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, setIs404]);

	useEffect(() => {
		const getApplicationData = async () => {
			// Attempting to get data
			try {
				// Getting data from API
				let defaultResult = await getDefaultDefectRiskRatings(id);
				// if success, adding data to state
				if (defaultResult.status) {
					// Setting default
					setDefaultData(
						defaultResult.data.defaultSafetyCriticalDefectRiskRatingID
					);
				} else {
					// If error, throwing to catch
					throw new Error(defaultResult);
				}
			} catch (err) {
				// TODO: real error handling
				errorDispatch(showError("Failed to fetch application details."));
				return false;
			}
		};

		// Getting application and updating state
		getApplicationData();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		handleGetData()
			.then(() => {
				//Rendering data
				setHaveData(true);
			})
			.catch((err) =>
				errorDispatch(showError("Failed to load defect risk ratings."))
			);
	}, [handleGetData]);

	//Handlers
	const handleAddData = (item) => {
		const newData = [...allData];

		newData.push(item);

		setAllData(newData);

		setDataChanged(true);
	};

	const handleEditData = (d) => {
		const newData = [...allData];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		//Updating state
		setAllData(newData);

		setDataChanged(true);
	};

	// Edit

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

	//Delete
	const handleDeleteDialogOpen = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const handleRemoveData = (id) => {
		setAllData([...allData.filter((d) => d.id !== id)]);
	};

	//Default Dialog
	const handleDefaultDialogOpen = (id) => {
		const { name } = allData.find((x) => x.id === id);
		setConfirmDefault([id, name]);
		setOpenDefaultDialog(true);
	};

	const handleDefaultDialogClose = () => {
		setOpenDefaultDialog(false);
	};

	const handleSetDefault = (defaultID) => {
		const newData = [...allData];

		let index = newData.findIndex((el) => el.id === defaultID);

		if (index >= 0) {
			newData[index].isDefault = true;
		}

		// Updating state
		setAllData(newData);
	};

	const handleDefaultUpdate = async () => {
		// Attempting to update default
		try {
			// Patching change to API
			const result = await patchDefaultDefectRiskRatings(id, [
				{
					op: "replace",
					path: "defaultSafetyCriticalDefectRiskRatingID",
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
			errorDispatch(showError("Failed to update default defect risk ratings."));
			return false;
		}
	};

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
			handleSort(allData, setAllData, "name", "asc");

			setDataChanged(false);
		}
		// eslint-disable-next-line
	}, [dataChanged]);

	const {
		showAdd,
		details: { data },
		defaultCustomCaptionsData: { riskRating, riskRatingPlural, safetyCritical },
		isReadOnly,
	} = state;

	return (
		<div className="container">
			<TabTitle title={`${data.application.name} ${riskRatingPlural}`} />
			{/* DIALOGS */}
			<AddDialog
				open={showAdd}
				closeHandler={() => dispatch({ type: "ADD_TOGGLE" })}
				applicationID={id}
				getError={getError}
				handleAddData={handleAddData}
				header={data?.riskRatingCC || riskRating}
			/>

			<EditDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				data={editData}
				handleEditData={handleEditData}
				getError={getError}
				header={data?.riskRatingCC || riskRating}
			/>

			<DefaultDialog
				open={openDefaultDialog}
				closeHandler={handleDefaultDialogClose}
				data={confirmDefault}
				entity={`${data?.safetyCriticalCC || safetyCritical}`}
				handleDefaultUpdate={handleDefaultUpdate}
			/>

			<DeleteDialog
				entityName={`${data?.riskRatingCC || riskRating}`}
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteId}
				deleteEndpoint="/api/defectriskratings"
				handleRemoveData={handleRemoveData}
			/>

			{/* END DIALOGS */}
			<CommonBody {...{ haveData }}>
				<>
					<div className="detailsContainer">
						<DetailsPanel
							header={`${data?.riskRatingPluralCC || riskRatingPlural}`}
							dataCount={haveData ? allData.length : 0}
							description={`Create and manage ${
								data?.riskRatingPluralCC || riskRatingPlural
							}`}
						/>

						<SearchField
							searchQuery={searchQuery}
							setSearchQuery={handleSearch}
							header={`${data?.riskRatingPluralCC || riskRatingPlural}`}
						/>

						<MobileSearchField
							searchQuery={searchQuery}
							setSearchQuery={handleSearch}
							header={`${data?.riskRatingPluralCC || riskRatingPlural}`}
						/>
					</div>

					<CommonApplicationTable
						isReadOnly={isReadOnly}
						data={allData}
						setData={setAllData}
						setSearch={setSearchData}
						searchQuery={searchQuery}
						columns={["name", "action"]}
						headers={["Name", "Action"]}
						isLoading={loading}
						defaultID={defaultData}
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
							{
								name: `Make ${
									data?.safetyCriticalCC || safetyCritical
								} Default`,
								handler: handleDefaultDialogOpen,
								isDelete: false,
							},
						]}
						searchedData={searchedData}
					/>
				</>
			</CommonBody>
		</div>
	);
};

export default DefectRiskRatingsContent;
