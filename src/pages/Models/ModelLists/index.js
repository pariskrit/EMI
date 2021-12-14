import { handleSort } from "helpers/utils";
import Button from "@material-ui/core/Button";
import { useSearch } from "hooks/useSearch";
import { CircularProgress } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { getUsersList } from "services/users/usersList";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ContentStyle from "styles/application/ContentStyle";
import { Grid } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import ModelsListTable from "./ModelsListTable";

// import AddUserDialog from "./AddUserDialog";
// import ImportListDialog from "./ImportListDialog";
// import DeleteDialog from "components/Elements/DeleteDialog";

import { DefaultPageSize } from "helpers/constants";

const AT = ActionButtonStyle();
const AC = ContentStyle();

const media = "@media(max-width: 414px)";

const useStyles = makeStyles({
	listActions: {
		marginBottom: 30,
	},
	headerContainer: {
		display: "flex",
		[media]: {
			flexDirection: "column",
		},
	},
	headerText: {
		fontSize: 21,
	},
	buttonContainer: {
		display: "flex",
		marginLeft: "auto",
		[media]: {
			marginLeft: 0,
		},
	},
	importButton: {
		background: "#ED8738",
	},
	productButton: {
		backgroundColor: ColourConstants.confirmButton,
		color: "#FFFFFF",
		fontFamily: "Roboto Condensed",
		width: 150,
		fontSize: "13.5px",
		fontWeight: "bold",
		marginRight: "10px",
	},
});

const ModelLists = ({ getError }) => {
	const classes = useStyles();

	//Init State
	const [haveData, setHaveData] = useState(true);

	// const [dataCount, setDataCount] = useState(null);
	const [modal, setModal] = useState({ import: false, add: false });

	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const [page, setPage] = useState({ pageNo: 1, perPage: DefaultPageSize });

	const searchRef = useRef("");

	const allData = [
		{ name: "pariskrit", modelName: "model1", modelTypeId: 345, type: "type1" },
		{ name: "moktan", modelName: "model3", modelTypeId: 346, type: "type3" },
	];

	const {
		// allData,
		setAllData,
		searchedData,
		searchQuery,
		setSearchData,
		setSearchQuery,
	} = useSearch();

	// const fetchData = useCallback(
	// 	async (pNo, searchText) => {
	// 		try {
	// 			let result = await getUsersList(pNo, DefaultPageSize, searchText);

	// 			if (result.status) {
	// 				result = result.data;

	// 				setAllData(result);
	// 				// setDataCount(result.length);
	// 				return true;
	// 			} else {
	// 				// Throwing error if failed
	// 				throw new Error(`Error: Status ${result.status}`);
	// 			}
	// 		} catch (err) {
	// 			console.log(err);
	// 			return err;
	// 		}
	// 	},
	// 	[setAllData]
	// );

	// useEffect(() => {
	// 	fetchData(1)
	// 		.then(() => {
	// 			setHaveData(true);
	// 		})
	// 		.catch((err) => console.log("ERROR : ", err));
	// }, [fetchData]);

	const mainData = searchQuery.length === 0 ? allData : searchedData;

	//Handler
	//Add
	const handleAddData = (d) => {
		const newData = [...allData];

		newData.push(d);

		setAllData(newData);
	};

	//DELETE
	const handleDeleteDialogOpen = (id) => {
		setDeleteID(id);

		setOpenDeleteDialog(true);
	};

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const handleRemoveData = (id) =>
		setAllData([...allData.filter((d) => d.id !== id)]);

	//Pagination
	// const handlePage = async (p, prevData) => {
	// 	try {
	// 		const response = await getUsersList(
	// 			p,
	// 			DefaultPageSize,
	// 			searchRef.current
	// 		);
	// 		if (response.status) {
	// 			setPage({ pageNo: p, rowsPerPage: DefaultPageSize });
	// 			setAllData([...prevData, ...response.data]);
	// 			response.data = [...prevData, ...response.data];
	// 			return response;
	// 		} else {
	// 			throw new Error(response);
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 		return err;
	// 	}
	// };

	const importSuccess = () => {
		// fetchData(1);
	};

	const debounce = (func, delay) => {
		let timer;
		return function () {
			let self = this;
			let args = arguments;
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(self, args);
			}, delay);
		};
	};

	//handle search
	const handleSearch = useCallback(
		debounce((value) => {
			searchRef.current = value;
			// fetchData(1, value);
		}, 500),
		[]
	);

	return (
		<div className="container">
			{/* <ImportListDialog
				open={modal.import}
				handleClose={() => setModal((th) => ({ ...th, import: false }))}
				importSuccess={importSuccess}
				getError={getError}
			/>

			<AddUserDialog
				open={modal.add}
				handleClose={() => setModal((th) => ({ ...th, add: false }))}
				handleAddData={handleAddData}
				setSearchQuery={setSearchQuery}
				getError={getError}
			/>

			<DeleteDialog
				entityName="User"
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteID}
				deleteEndpoint="/api/users"
				handleRemoveData={handleRemoveData}
			/> */}

			<div className={classes.listActions}>
				<div className={classes.headerContainer}>
					<Typography
						className={classes.headerText}
						component="h1"
						gutterBottom
					>
						{allData.length === 0 ? (
							<strong>{"Model List"}</strong>
						) : (
							<strong>{`Model List (${allData.length})`}</strong>
						)}
					</Typography>
					{haveData ? (
						<div className={classes.buttonContainer}>
							<AT.GeneralButton
								onClick={() => setModal((th) => ({ ...th, import: true }))}
								className={classes.importButton}
							>
								Import from list
							</AT.GeneralButton>

							<Button
								variant="contained"
								className={classes.productButton}
								onClick={() => setModal((th) => ({ ...th, add: true }))}
							>
								Add New
							</Button>
						</div>
					) : null}
				</div>

				<AC.SearchContainer>
					<AC.SearchInner className="applicationSearchBtn">
						<Grid container spacing={1} alignItems="flex-end">
							<Grid item>
								<SearchIcon />
							</Grid>
							<Grid item>
								<AC.SearchInput
									onChange={(e) => handleSearch(e.target.value)}
									label="Search"
								/>
							</Grid>
						</Grid>
					</AC.SearchInner>
				</AC.SearchContainer>
			</div>
			{haveData ? (
				<ModelsListTable
					data={mainData}
					headers={["Name", "Model", "Type", "Status"]}
					columns={["name", "modelName", "modelTypeId", "type"]}
					setData={setAllData}
					handleSort={handleSort}
					searchQuery={searchQuery}
					searchedData={searchedData}
					setSearchData={setSearchData}
					handleDeleteDialogOpen={handleDeleteDialogOpen}
					searchText={searchRef.current}
					// onPageChange={handlePage}
					page={page.pageNo}
				/>
			) : (
				<CircularProgress />
			)}
		</div>
	);
};

export default ModelLists;
