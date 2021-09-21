import React, { useContext, useEffect, useState } from "react";
import DetailsPanel from "components/Elements/DetailsPanel";
import ContentStyle from "styles/application/ContentStyle";
import Grid from "@material-ui/core/Grid";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import OperatingModesTable from "./OperatingModesTable";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import { getOperatingModes } from "services/clients/sites/siteApplications/operatingModes";
import { SiteContext } from "contexts/SiteApplicationContext";
import DeleteDialog from "components/Elements/DeleteDialog";
import { useSearch } from "hooks/useSearch";
import DefaultDialog from "components/Elements/DefaultDialog";

const AC = ContentStyle();

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
	const { searchQuery, searchedData, handleSearch, setAllData } = useSearch();

	const fetchOperatingModesLists = async () => {
		const result = await getOperatingModes(appId);
		console.log(result);
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
											label="Search Operating Modes"
										/>
									</Grid>
								</div>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainer>
				</div>
			</div>

			<OperatingModesTable
				currentTableSort={currentTableSort}
				data={data}
				openDefaultDialog={onOpenDefaultDialog}
				handleEditDialogOpen={onOpenEditDialog}
				handleDeleteDialogOpen={onOpenDeleteDialog}
				searchedData={searchedData}
				searchQuery={searchQuery}
				setCurrentTableSort={setCurrentTableSort}
			/>
		</>
	);
}

export default OperatingModes;
