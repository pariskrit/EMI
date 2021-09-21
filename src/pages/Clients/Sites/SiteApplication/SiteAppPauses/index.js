import React, { useCallback, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import DetailsPanel from "components/Elements/DetailsPanel";
import ContentStyle from "styles/application/ContentStyle";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";
import { handleSort } from "helpers/utils";
import AddDialog from "./AddDialog/AddDialog";
import EditDialog from "./EditDialog/EditDialog";
import DeleteDialog from "components/Elements/DeleteDialog";

const AC = ContentStyle();

const SiteAppPauses = ({ state, dispatch, appId }) => {
	const [data, setData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchedData, setSearchData] = useState([]);
	const [modal, setModal] = useState({ edit: false, delete: false });
	const [deleteId, setDeleteId] = useState(null);
	const [editData, setEditData] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleAddSubcat = (parentId, id, name) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === parentId);

		newData[index].pauseSubcategories.push({
			pauseID: parentId,
			id: id,
			name: name,
		});

		newData[index].pauseSubcategories.sort((a, b) =>
			a["name"].toString().localeCompare(b["name"].toString())
		);

		// Updating state
		setData(newData);
	};

	const handleUpdateSubcat = (parentId, subcatID, newName) => {
		const newData = [...data];

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
		setData(newData);
	};

	const handleRemoveSubcat = (sub) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === sub.pauseID);

		newData[index].pauseSubcategories = newData[
			index
		].pauseSubcategories.filter((item) => {
			return item.id !== sub.id;
		});

		newData[index].pauseSubcategories.sort((a, b) =>
			a["name"].toString().localeCompare(b["name"].toString())
		);

		// Updating state
		setData(newData);
	};

	const handleEditDialogOpen = (id) => {
		setModal((th) => ({ ...th, edit: true }));

		data.forEach((d) => {
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

				handleSort(mainData, setData, "name", "asc");
				setLoading(false);
				return result;
			}
		} catch (err) {}
	}, [appId]);

	const handleDeleteDialogClose = () => {
		setDeleteId(null);
		setModal((th) => ({ ...th, delete: false }));
	};

	const handleAddData = (item) => {
		const newData = [...data];
		newData.push(item);
		setData(newData);
	};

	const handleRemoveData = (id) => {
		const newData = [...data].filter(function (item) {
			return item.id !== id;
		});

		// Updating state
		setData(newData);
	};

	const handleEditData = (d) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		// Updating state
		setData(newData);
	};

	useEffect(() => {
		handleGetData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSearch = (e) => {
		const { value } = e.target;
		setSearchQuery(value);
		const filtered = data.filter((x) => {
			const regex = new RegExp(value, "gi");
			return x.name.match(regex);
		});
		setSearchData(filtered);
	};

	const mainData = searchQuery.length === 0 ? data : searchedData;

	return (
		<div>
			<AddDialog
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "ADD_TOGGLE" })}
				applicationID={appId}
				handleAddData={handleAddData}
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
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Pause Reasons"}
					dataCount={data.length}
					description="Create and manage Pause Reasons"
				/>
				<div className="desktopSearchCustomCaptions">
					<AC.SearchContainer>
						<AC.SearchInner>
							<Grid container spacing={1} alignItems="flex-end">
								<div className="flex">
									<Grid item>
										<SearchIcon
											style={{ marginTop: "20px", marginRight: "5px" }}
										/>
									</Grid>
									<Grid item>
										<AC.SearchInput
											value={searchQuery}
											onChange={handleSearch}
											label="Search Pauses"
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
										label="Search Pauses"
									/>
								</Grid>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainerMobile>
				</div>
			</div>
			<CommonApplicationTable
				setData={setData}
				setSearch={setSearchData}
				searchQuery={searchQuery}
				data={mainData}
				columns={["name", "totalSub"]}
				headers={["Name", "Number of subcategories"]}
				onEdit={handleEditDialogOpen}
				onDelete={handleDeleteDialogOpen}
				isLoading={loading}
			/>
		</div>
	);
};

export default SiteAppPauses;
