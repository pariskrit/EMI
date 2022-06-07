import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { BASE_API_PATH } from "helpers/constants";
import DetailsPanel from "components/Elements/DetailsPanel";
import DeleteDialog from "components/Elements/DeleteDialog";
import ClientSiteTable from "components/Modules/ClientSiteTable";
import ContentStyle from "styles/application/ContentStyle";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import EditDialog from "./EditModal";
import "./site.scss";
import { getLocalStorageData } from "helpers/utils";

const AC = ContentStyle();

const SiteDepartmentsContent = ({ data, setData, isLoading, getError }) => {
	const [editData, setEditData] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [departments, setDepartments] = useState([]);
	const [selectedID, setSelectedID] = useState(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const { customCaptions } = getLocalStorageData("me");

	useEffect(() => {
		setDepartments(data);
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
		const detail = [...departments].find((x) => x.id === id);
		setEditData(detail);
		setOpenEditDialog(true);
	};

	//search
	const handleSearch = (e) => {
		setSearchQuery(e.target.value);
		let result = data.filter((d) =>
			d.name.toLowerCase().includes(e.target.value.toLowerCase())
		);

		setDepartments(result);
	};

	return (
		<div>
			<DeleteDialog
				entityName="Department"
				open={openDeleteDialog}
				deleteID={selectedID}
				deleteEndpoint={`${BASE_API_PATH}SiteDepartments`}
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
					header={customCaptions?.departmentPlural ?? "Departments"}
					dataCount={departments.length}
					description={`Create and manage ${
						customCaptions?.departmentPlural ?? "departments"
					}`}
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
									label={`Search ${
										customCaptions?.departmentPlural ?? "Departments"
									}`}
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
				isLoading={isLoading}
			/>
		</div>
	);
};

export default SiteDepartmentsContent;
