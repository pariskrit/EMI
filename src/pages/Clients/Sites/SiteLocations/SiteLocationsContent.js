import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { BASE_API_PATH } from "helpers/constants";
import DeleteDialog from "components/Elements/DeleteDialog";
import DetailsPanel from "components/Elements/DetailsPanel";
import ClientSiteTable from "components/Modules/ClientSiteTable";
import ContentStyle from "styles/application/ContentStyle";
import EditDialog from "./EditModal";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import "../SiteDepartment/site.scss";

const AC = ContentStyle();

const SiteLocationsContent = ({ data, setData, isLoading, getError }) => {
	const [locations, setLocations] = useState([]);
	const [editData, setEditData] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedID, setSelectedID] = useState(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	useEffect(() => {
		setLocations(data);
	}, [data]);

	const handleDeleteDialogClose = () => {
		setSelectedID(null);
		setOpenDeleteDialog(false);
	};

	const handleRemoveData = (id) => {
		const newData = [...data].filter(function (item) {
			return item.id !== id;
		});

		// Updating state
		setData(newData);
	};

	// Edit Modal
	const handleEditData = (d) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		// Updating state
		setData(newData);
	};

	const handleEditDialogClose = () => {
		setOpenEditDialog(false);
	};

	const handleEdit = (id) => {
		const detail = [...locations].find((x) => x.id === id);
		setEditData(detail);
		setOpenEditDialog(true);
	};

	//search
	const handleSearch = (e) => {
		setSearchQuery(e.target.value);
		let result = data.filter((d) =>
			d.name.toLowerCase().includes(e.target.value.toLowerCase())
		);

		setLocations(result);
	};

	return (
		<div>
			<DeleteDialog
				entityName="Location"
				open={openDeleteDialog}
				deleteID={selectedID}
				deleteEndpoint={`${BASE_API_PATH}SiteLocations`}
				handleRemoveData={handleRemoveData}
				closeHandler={handleDeleteDialogClose}
			/>

			<EditDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				data={editData}
				handleEditData={handleEditData}
				getError={getError}
			/>

			<div className="detailsContainer">
				<DetailsPanel
					header={"Locations"}
					dataCount={locations.length}
					description="Create and manage locations"
				/>
				<AC.SearchContainer>
					<AC.SearchInner className="applicationSearchBtn">
						<Grid container spacing={1} alignItems="flex-end">
							<Grid item>
								<SearchIcon />
							</Grid>
							<Grid item>
								<AC.SearchInput
									value={searchQuery}
									onChange={handleSearch}
									label="Search Locations"
								/>
							</Grid>
						</Grid>
					</AC.SearchInner>
				</AC.SearchContainer>
			</div>

			<ClientSiteTable
				data={locations}
				columns={["name"]}
				headers={["Name"]}
				onEdit={handleEdit}
				onDelete={(id) => {
					setOpenDeleteDialog(true);
					setSelectedID(id);
				}}
				setData={setLocations}
				pagination={false}
				isLoading={isLoading}
			/>
		</div>
	);
};

export default SiteLocationsContent;
