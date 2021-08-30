import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
// import DeleteDialog from "components/DeleteDialog";
import RestoreIcon from "@material-ui/icons/Restore";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import DepartmentsTable from "components/DepartmentsTable";
import Navcrumbs from "components/Navcrumbs";
import AddSiteDepartmentDialog from "components/SiteDepartment/AddSiteDepartmentDialog";
import ColourConstants from "helpers/colourConstants";
import React, { useState } from "react";
import ContentStyle from "styles/application/ContentStyle";
import "./site.scss";

const AC = ContentStyle();

const useStyles = makeStyles({
	buttonContainer: {
		display: "flex",
		marginLeft: "auto",
		marginRight: "20px",
	},
	productButton: {
		backgroundColor: ColourConstants.confirmButton,
		color: "#FFFFFF",
		fontSize: 15,
		fontFamily: "Roboto Condensed",
		width: 150,
	},
});

const SiteDepartmentsContent = () => {
	const classes = useStyles();

	// const [datas,setDatas] = useState([{name:'ABC', desc: 'Company ABC'},{name:'DEF', desc: 'Company DEF'},{name:'XYZ', desc: 'Company XYZ'}])

	// const [selectedID, setSelectedID] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [openAddDialog, setOpenAddDialog] = useState(false);
	// const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	// //Delete Modal
	// const handleDeleteDialogOpen = (id) => {
	// 	setSelectedID(id);
	// 	setOpenDeleteDialog(true);
	// };

	// const handleDeleteDialogClose = () => {
	// 	setSelectedID(null);
	// 	setOpenDeleteDialog(false);
	// };

	// const handleRemoveData = (id) => {
	// 	const newData = [...datas].filter(function (item) {
	// 		return item.name !== id;
	// 	});

	//     console.log('sagar',id)

	// 	// Updating state
	// 	setDatas(newData);
	// };

	//Add Button Modal
	const handleAddDialogOpen = () => {
		setOpenAddDialog(true);
	};

	const handleAddDialogClose = () => {
		setOpenAddDialog(false);
	};

	const handleCreateData = () => {
		console.log("created");
	};

	return (
		<div>
			<AddSiteDepartmentDialog
				open={openAddDialog}
				closeHandler={handleAddDialogClose}
				createHandler={handleCreateData}
			/>
			{/* <DeleteDialog
				entityName="Department"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				// deleteEndpoint="/api/Applications"
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
			/> */}

			<div className="flex justify-between" className="flex">
				<Navcrumbs
					crumbs={["Site", ""]} // ----------------------- put dynamic value
					status=""
					lastSaved=""
				/>

				<div className={classes.buttonContainer}>
					<Button
						variant="contained"
						className={`${classes.productButton} addNewBtn`}
						onClick={handleAddDialogOpen}
					>
						Add New
					</Button>
				</div>

				<div className="right-section">
					<div className="restore">
						<RestoreIcon />
					</div>
				</div>
			</div>

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
								label="Search Applications"
							/>
						</Grid>
					</Grid>
				</AC.SearchInner>
			</AC.SearchContainer>
			<h3>Departments</h3>
			{/* <DepartmentsTable {...{datas,handleDeleteDialogOpen}}/> */}
			<DepartmentsTable />
		</div>
	);
};

export default SiteDepartmentsContent;
