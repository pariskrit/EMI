import React, { useEffect, useState } from "react";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getUsersList } from "services/users/usersList";
import { Button, CircularProgress } from "@material-ui/core";
import { handleSort } from "helpers/utils";
import { makeStyles } from "@material-ui/core/styles";
import AppsIcon from "@material-ui/icons/Apps";
import ColourConstants from "helpers/colourConstants";
import AddNewModelDetail from "./AddNewModelDetail";
import ModalAwaitingImports from "./ModalAwaitingImports";
import API from "helpers/api";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
// import ImportFileDialouge from "../Models/ModelLists/ImportFileDialog";

const AT = ActionButtonStyle();

const useStyles = makeStyles({
	productButton: {
		backgroundColor: ColourConstants.confirmButton,
		color: "#FFFFFF",
		fontSize: 15,
		fontFamily: "Roboto Condensed",
		width: 150,
	},
	headerContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	importButton: {
		background: "#ED8738",
	},
});

function Test() {
	const classes = useStyles();

	const [data, setData] = useState([]);
	const [selectItem, setSelectItem] = useState({});
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState({ pageNo: 1, perPage: 10 });
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openImportFile, setOpenImportFile] = useState(false);

	const handleAddDialogOpen = () => {
		setOpenAddDialog(true);
	};

	const handleAddDialogClose = () => {
		setOpenAddDialog(false);
	};

	useEffect(() => {
		const fetchData = async (pageNumber, perPageNumber) => {
			setLoading(true);
			const result = await getUsersList(pageNumber, perPageNumber);
			setData(result.data);
			setLoading(false);
		};
		fetchData(page.pageNo, page.perPage);
	}, []);

	const onChange = (item) => {
		setSelectItem(item);
	};

	//Pagination
	const onPageChange = async (p, prevData) => {
		try {
			const response = await getUsersList(p, page.perPage);
			if (response.status) {
				setPage({ pageNo: p, perPage: 10 });
				setData([...prevData, ...response.data]);
			} else {
				throw new Error(response);
			}
		} catch (err) {
			console.log(err);
			return err;
		}
	};

	const handleServerSideSort = async (sortField, setOrder) => {
		const fetchData = async (pageNumber, perPageNumber) => {
			// setLoading(true);
			const result = await getUsersList(pageNumber, perPageNumber);
			setData(result.data);
			// setLoading(false);
		};
		fetchData(page.pageNo, 3);
	};

	const handleServierSideSearch = async (searchTxt) => {
		console.log(searchTxt);
	};
	const handleCreateProcess = async (payload) => {
		const newData = await API.post("/api/Models", payload);
		return newData;
	};

	return (
		<div style={{ margin: "30px auto" }}>
			<AddNewModelDetail
				open={openAddDialog}
				closeHandler={handleAddDialogClose}
				createProcessHandler={handleCreateProcess}
				siteId={1}
				title="Add Model"
			/>
			{/* <ImportFileDialouge
				open={openImportFile}
				handleClose={() => setOpenImportFile(false)}
				// importSuccess={importSuccess}
				// getError={getError}
			/> */}
			<div className={classes.headerContainer}>
				<h2>Dynamic Dropdown component</h2>
				<div>
					<AT.GeneralButton
						onClick={() => setOpenImportFile(true)}
						className={classes.importButton}
					>
						Import from file
					</AT.GeneralButton>
					<Button
						variant="contained"
						className={classes.productButton}
						onClick={handleAddDialogOpen}
					>
						Add New
					</Button>
				</div>
			</div>
			<ModalAwaitingImports siteAppId={1} />

			{loading ? (
				<CircularProgress />
			) : (
				<>
					<DyanamicDropdown
						dataSource={data}
						columns={[
							{ name: "displayName", id: 1, minWidth: "130px" },
							{ name: "email", id: 2, minWidth: "200px" },
						]}
						dataHeader={[
							{ name: "displayName", id: 1, minWidth: "130px" },
							{ name: "email", id: 2, minWidth: "200px" },
						]}
						columnsMinWidths={[140, 140, 140, 140, 140]}
						showHeader={true}
						onChange={onChange}
						selectdValueToshow="displayName"
						handleSort={handleSort}
						selectedValue={selectItem}
						page={page.pageNo}
						onPageChange={onPageChange}
						label="Select"
						isServerSide={false}
						handleServerSideSort={handleServerSideSort}
						showClear={true}
						icon={<AppsIcon />}
						handleServierSideSearch={handleServierSideSearch}
						required={true}
					/>
				</>
			)}
		</div>
	);
}

export default Test;
