import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ContentStyle from "styles/application/ContentStyle";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ClientTable from "./ClientTable";
import { CircularProgress } from "@material-ui/core";
import AddClientDialog from "./AddClientDialog";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import DeleteDialog from "components/Elements/DeleteDialog";
import { handleSort } from "helpers/utils";

// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import withMount from "components/HOC/withMount";
// Init styled components
const AC = ContentStyle();

const useStyles = makeStyles({
	listActions: {
		marginBottom: 30,
	},
	headerContainer: {
		display: "flex",
	},
	headerText: {
		fontSize: 21,
	},
	buttonContainer: {
		display: "flex",
		marginLeft: "auto",
	},
	productButton: {
		backgroundColor: ColourConstants.confirmButton,
		color: "#FFFFFF",
		fontSize: 15,
		fontFamily: "Roboto Condensed",
		width: 150,
	},
});

const ClientListContent = ({ isMounted }) => {
	// Init hooks
	const classes = useStyles();
	const history = useHistory();

	// Init state
	const [data, setData] = useState([]);
	const [haveData, setHaveData] = useState(false);
	const [dataCount, setDataCount] = useState(null);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedID, setSelectedID] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchedData, setSearchedData] = useState([]);
	// Fetching data on pageload
	useEffect(() => {
		fetchData()
			.then(() => {
				if (!isMounted.aborted) setHaveData(true);
			})
			.catch((err) => console.log("ERROR: ", err));
		// eslint-disable-next-line
	}, []);

	// Handlers
	const fetchData = async () => {
		// Attempting to fetch clients
		try {
			// Fetching clients from backend
			let result = await API.get("/api/Clients");
			if (!isMounted.aborted) {
				if (result.status === 200) {
					// Getting buffer
					result = result.data;

					// Updating state
					result.forEach((d, index) => {
						// TODO: BELOW NEEDS TO COME FROM BACKEND WHEN ClIENTS EXISTS
						// The foreach can be removed when clients exists in response
						d.clients = Math.trunc(Math.random() * 100);

						result[index] = d;
					});

					// Setter happens in sort
					handleSort(result, setData, "name", "asc");

					setDataCount(result.length);

					return true;
				} else {
					// Throwing error if failed
					throw new Error(`Error: Status ${result.status}`);
				}
			}
			// Rendering clients if success
		} catch (err) {
			// TODO: Real error handling when this has been decided on
			// (are we throwing alerts or pushing to home?)
			console.log(err);
			return err;
		}
	};

	const handleAddDialogOpen = () => {
		setOpenAddDialog(true);
	};

	const handleAddDialogClose = () => {
		setOpenAddDialog(false);
	};

	const handleDeleteDialogOpen = (id) => {
		setSelectedID(id);
		setOpenDeleteDialog(true);
	};

	const handleDeleteDialogClose = () => {
		setSelectedID(null);
		setOpenDeleteDialog(false);
	};

	const handleRedirect = (id) => {
		history.push(`/client/${id}`);
	};

	const handleCreateData = async (name) => {
		// Adding spinner
		setHaveData(false);

		// Remove search
		setSearchQuery("");

		// Attempting to create client
		try {
			// Sending create POST to backend
			let result = await API.post("/api/Clients", {
				name: name,
			});

			if (result.status === 201 || result.status === 200) {
				// Getting response
				result = result.data;

				// Redirecting page
				handleRedirect(result);

				// Clearing state
				setData([]);

				// Fetching data
				await fetchData();

				setHaveData(true);

				return { success: true };
			} else {
				// Throwing response if error
				throw new Error(result);
			}
		} catch (err) {
			if (
				err.response.data.errors !== undefined &&
				err.response.data.detail === undefined
			) {
				// Removing spinner
				setHaveData(true);

				return { success: false, errors: err.response.data.errors };
			} else if (
				err.response.data.errors !== undefined &&
				err.response.data.detail !== undefined
			) {
				// Removing spinner
				setHaveData(true);

				return {
					success: false,
					errors: { name: err.response.data.detail },
				};
			} else {
				// Removing spinner
				setHaveData(true);

				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}
		}
	};

	const handleRemoveData = (id) => {
		const newData = [...data].filter(function (item) {
			return item.id !== id;
		});

		// Updating state
		setData(newData);
	};

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
	};

	// Search sorting side effect
	useEffect(() => {
		// Performing search
		handleSearch();
		// eslint-disable-next-line
	}, [searchQuery]);

	return (
		<div className="clientListContentContainer">
			<AddClientDialog
				open={openAddDialog}
				closeHandler={handleAddDialogClose}
				createHandler={handleCreateData}
			/>
			<DeleteDialog
				entityName="Client"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint="/api/Clients"
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
			/>
			<div>
				<div className={classes.listActions}>
					<div className={classes.headerContainer}>
						<Typography
							className={classes.headerText}
							component="h1"
							gutterBottom
						>
							{dataCount === null ? (
								<strong>{"Client List"}</strong>
							) : (
								<strong>{`Client List (${dataCount})`}</strong>
							)}
						</Typography>
						{haveData ? (
							<div className={classes.buttonContainer}>
								<Button
									variant="contained"
									className={classes.productButton}
									onClick={handleAddDialogOpen}
								>
									Add New
								</Button>
							</div>
						) : null}
					</div>

					{haveData ? (
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
											label="Search Clients"
										/>
									</Grid>
								</Grid>
							</AC.SearchInner>
						</AC.SearchContainer>
					) : null}
				</div>

				{haveData ? (
					<ClientTable
						data={data}
						setData={setData}
						handleSort={handleSort}
						searchQuery={searchQuery}
						handleDeleteDialogOpen={handleDeleteDialogOpen}
						searchedData={searchedData}
						setSearchedData={setSearchedData}
					/>
				) : (
					<CircularProgress />
				)}
			</div>
		</div>
	);
};

export default withMount(ClientListContent);
