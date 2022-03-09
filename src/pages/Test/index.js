<<<<<<< HEAD
// import React, { useEffect, useState } from "react";
// import DyanamicDropdown from "components/Elements/DyamicDropdown";
// import { getUsersList } from "services/users/usersList";
// import { Button, CircularProgress } from "@material-ui/core";
// import { handleSort } from "helpers/utils";
// import { makeStyles } from "@material-ui/core/styles";
// import AppsIcon from "@material-ui/icons/Apps";
// import ColourConstants from "helpers/colourConstants";
// import AddNewModelDetail from "./AddNewModelDetail";
// import ModalAwaitingImports from "./ModalAwaitingImports";
// import API from "helpers/api";
// import ActionButtonStyle from "styles/application/ActionButtonStyle";
// import SiteWrapper from "components/Layouts/SiteWrapper";
// import { modelScreenNavigation } from "helpers/constants";
// import ModelWrapper from "./ModelWarpper";
// import { useHistory } from "react-router-dom";
// import Task from "./Task";
// import AddNewModelTask from "./AddNewModelTask";
// // import ImportFileDialouge from "../Models/ModelLists/ImportFileDialog";

// const AT = ActionButtonStyle();

// const useStyles = makeStyles({
// 	productButton: {
// 		backgroundColor: ColourConstants.confirmButton,
// 		color: "#FFFFFF",
// 		fontSize: 15,
// 		fontFamily: "Roboto Condensed",
// 		width: 150,
// 	},
// 	headerContainer: {
// 		display: "flex",
// 		alignItems: "center",
// 		justifyContent: "space-evenly",
// 	},
// 	importButton: {
// 		background: "#ED8738",
// 	},
// });

// function Test() {
// 	// const classes = useStyles();

// 	// const [data, setData] = useState([]);
// 	// const [selectItem, setSelectItem] = useState({});
// 	// const [loading, setLoading] = useState(false);
// 	// const [page, setPage] = useState({ pageNo: 1, perPage: 10 });
// 	// const [openAddDialog, setOpenAddDialog] = useState(false);
// 	// const [openImportFile, setOpenImportFile] = useState(false);
// 	// const [ss, setss] = useState([]);

// 	// const handleAddDialogOpen = () => {
// 	// 	setOpenAddDialog(true);
// 	// };

// 	// const handleAddDialogClose = () => {
// 	// 	setOpenAddDialog(false);
// 	// };

// 	// useEffect(() => {
// 	// 	const fetchData = async (pageNumber, perPageNumber) => {
// 	// 		setLoading(true);
// 	// 		const result = await getUsersList(pageNumber, perPageNumber);
// 	// 		setData(result.data);
// 	// 		setLoading(false);
// 	// 	};
// 	// 	fetchData(page.pageNo, page.perPage);
// 	// }, []);

// 	// const onChange = (item) => {
// 	// 	setSelectItem(item);
// 	// };

// 	// //Pagination
// 	// const onPageChange = async (p, prevData) => {
// 	// 	try {
// 	// 		const response = await getUsersList(p, page.perPage);
// 	// 		if (response.status) {
// 	// 			setPage({ pageNo: p, perPage: 10 });
// 	// 			setData([...prevData, ...response.data]);
// 	// 		} else {
// 	// 			throw new Error(response);
// 	// 		}
// 	// 	} catch (err) {
// 	// 		console.log(err);
// 	// 		return err;
// 	// 	}
// 	// };

// 	// const handleServerSideSort = async (sortField, setOrder) => {
// 	// 	const fetchData = async (pageNumber, perPageNumber) => {
// 	// 		// setLoading(true);
// 	// 		const result = await getUsersList(pageNumber, perPageNumber);
// 	// 		setData(result.data);
// 	// 		// setLoading(false);
// 	// 	};
// 	// 	fetchData(page.pageNo, 3);
// 	// };

// 	// const handleServierSideSearch = async (searchTxt) => {
// 	// 	console.log(searchTxt);
// 	// };
// 	// const handleCreateProcess = async (payload) => {
// 	// 	const newData = await API.post("/api/Models", payload);
// 	// 	return newData;
// 	// };

// 	const [openAddNewModal, setOpenAddNewModal] = useState(false);
// 	const history = useHistory();

// 	const { position } = JSON.parse(localStorage.getItem("me"));

// 	return (
// 		<div style={{ margin: "30px auto" }}>
// 			<AddNewModelTask
// 				open={openAddNewModal}
// 				closeHandler={() => setOpenAddNewModal(false)}
// 				siteId={position?.siteAppID}
// 				data={null}
// 				title="Add Model Task"
// 				// createProcessHandler={createModal}
// 			/>
// 			{/* <div className={classes.headerContainer}>
// 				<h2>Dynamic Dropdown component</h2>
// 				<div>
// 					<AT.GeneralButton
// 						onClick={() => setOpenImportFile(true)}
// 						className={classes.importButton}
// 					>
// 						Import from file
// 					</AT.GeneralButton>
// 					<Button
// 						variant="contained"
// 						className={classes.productButton}
// 						onClick={handleAddDialogOpen}
// 					>
// 						Add New
// 					</Button>
// 				</div>
// 			</div>
// 			<ModalAwaitingImports siteAppId={1} />

// 			{loading ? (
// 				<CircularProgress />
// 			) : (
// 				<>
// 					<DyanamicDropdown
// 						dataSource={data}
// 						columns={[
// 							{ name: "displayName", id: 1, minWidth: "130px" },
// 							{ name: "email", id: 2, minWidth: "200px" },
// 						]}
// 						dataHeader={[
// 							{ name: "displayName", id: 1, minWidth: "130px" },
// 							{ name: "email", id: 2, minWidth: "200px" },
// 						]}
// 						columnsMinWidths={[140, 140, 140, 140, 140]}
// 						showHeader={true}
// 						onChange={onChange}
// 						selectdValueToshow="displayName"
// 						handleSort={handleSort}
// 						selectedValue={selectItem}
// 						page={page.pageNo}
// 						onPageChange={onPageChange}
// 						label="Select"
// 						isServerSide={false}
// 						handleServerSideSort={handleServerSideSort}
// 						showClear={true}
// 						icon={<AppsIcon />}
// 						handleServierSideSearch={handleServierSideSearch}
// 						required={true}
// 					/>
// 				</>
// 			)} */}
// 			<ModelWrapper
// 				current="Tasks"
// 				navigation={modelScreenNavigation}
// 				onNavClick={(url) => history.push(url)}
// 				onClickAdd={() => {
// 					setOpenAddNewModal(true);
// 				}}
// 				showAdd
// 				// showSave
// 				showPasteTask
// 				// showChangeStatus
// 				// showSaveChanges
// 				ModelName="Caterpillar M12"
// 				Component={<Task />}
// 			/>
// 		</div>
// 	);
// }

// export default Test;
=======
import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import TextEditor from "components/Elements/TextEditor";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
	WorkBookContainer: {
		margin: 20,
		display: "flex",
	},
	inputContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
});

function Test() {
	const classes = useStyles();

	return (
		<div className={classes.WorkBookContainer}>
			<Grid container spacing={2}>
				<Grid item lg={6} md={6} xs={12}>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
				</Grid>
			</Grid>
		</div>
	);
}

export default Test;
>>>>>>> b82b66165e6b72e57fe996e56815bf1a4a27cb8b
