import "./site.scss";
import Grid from "@material-ui/core/Grid";
import DeleteDialog from "components/DeleteDialog";
import DetailsPanel from "components/DetailsPanel";
import ContentStyle from "styles/application/ContentStyle";
import DepartmentsTable from "components/DepartmentsTable";
import React, { useState, useCallback, useEffect } from "react";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import EditDialog from "routes/Clients/Sites/SiteDepartment/EditModal";

import ClientSiteTable from "components/ClientSiteTable";

const AC = ContentStyle();

const SiteDepartmentsContent = ({ data, setData }) => {
	const [searchedData, setSearchedData] = useState([]);
	const [editData, setEditData] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedID, setSelectedID] = useState(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const [departments, setDepartments] = useState([]);

	useEffect(() => {
		setDepartments(data);
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
		const detail = [...departments].find((x) => x.id === id);
		setEditData(detail);
		setOpenEditDialog(true);
	};

	return (
		<div>
			<DeleteDialog
				entityName="Department"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint="/api/SiteDepartments"
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
					header={"Departments"}
					dataCount={123}
					description="Create and manage departments"
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
									label="Search Departments"
								/>
							</Grid>
						</Grid>
					</AC.SearchInner>
				</AC.SearchContainer>
			</div>

			<ClientSiteTable
				data={departments}
				columns={["name", "description"]}
				headers={["Name", "Description"]}
				onEdit={handleEdit}
				onDelete={(id) => {
					setOpenDeleteDialog(true);
					setSelectedID(id);
				}}
				setData={setDepartments}
				pagination={false}
			/>
		</div>
	);
};

export default SiteDepartmentsContent;
