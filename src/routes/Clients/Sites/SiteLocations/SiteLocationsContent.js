import API from "helpers/api";
import "../SiteDepartment/site.scss";
import Grid from "@material-ui/core/Grid";
import { handleSort } from "helpers/utils";
import Navcrumbs from "components/Navcrumbs";
import Button from "@material-ui/core/Button";
import NavButtons from "components/NavButtons";
import DetailsPanel from "components/DetailsPanel";
import DeleteDialog from "components/DeleteDialog";
import RestoreIcon from "@material-ui/icons/Restore";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "@material-ui/core/styles";
import LocationsTable from "components/LocationsTable";
import { useHistory, useParams } from "react-router-dom";
import ClientSiteTable from "components/ClientSiteTable";
import ContentStyle from "styles/application/ContentStyle";
import React, { useState, useCallback, useEffect } from "react";
import EditDialog from "routes/Clients/Sites/SiteLocations/EditModal";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import AddSiteLocationsDialog from "components/SiteLocations/AddSiteLocationsDialog";

const AC = ContentStyle();

const SiteLocationsContent = ({ data, setData }) => {
	const [searchedData, setSearchedData] = useState([]);
	const [editData, setEditData] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedID, setSelectedID] = useState(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		setLocations(data);
	}, [data]);

	const handleSearch = () => {
		// Clearning state and returning if empty
		if (searchQuery === "") {
			setSearchedData([]);
			return;
		}

		let results = [];

		// Checking data
		for (let i = 0; i < data.length; i++) {
			// Pushing current data to results arr if containes search
			if (data[i].name.toLowerCase().includes(searchQuery.toLowerCase())) {
				results.push(data[i]);
			}
		}

		// Updating state
		setSearchedData(results);

		return;
	};

	console.log("sagar", searchedData);

	// Search sorting side effect
	useEffect(() => {
		// Performing search
		handleSearch();
		// eslint-disable-next-line
	}, [searchQuery]);

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

	return (
		<div>
			<DeleteDialog
				entityName="Location"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint="/api/SiteLocations"
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
			/>

			<EditDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				data={editData}
				handleEditData={handleEditData}
			/>

			<div className="detailsContainer">
				<DetailsPanel
					header={"Locations"}
					dataCount={123}
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
									onChange={(e) => {
										setSearchQuery(e.target.value);
									}}
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
			/>
		</div>
	);
};

export default SiteLocationsContent;
