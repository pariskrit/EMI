import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
// import DeleteDialog from "components/DeleteDialog";
import RestoreIcon from "@material-ui/icons/Restore";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import LocationsTable from "components/LocationsTable";
import Navcrumbs from "components/Navcrumbs";
import AddSiteLocationsDialog from "components/SiteLocations/AddSiteLocationsDialog";
import ColourConstants from "helpers/colourConstants";
import React, { useState, useCallback, useEffect } from "react";
import ContentStyle from "styles/application/ContentStyle";
import "../SiteDepartment/site.scss";

import { useHistory, useParams } from "react-router-dom";
import DetailsPanel from "components/DetailsPanel";

import NavButtons from "components/NavButtons";
import API from "helpers/api";
import { handleSort } from "helpers/utils";

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

const SiteLocationsContent = ({ setIs404 }) => {
	const classes = useStyles();

	let current = "Locations";

	const history = useHistory();
	const { id } = useParams();

	const [data, setData] = useState([]);
	const [dataChanged, setDataChanged] = useState(false);
	const [haveData, setHaveData] = useState(false);
	const [searchedData, setSearchedData] = useState([]);
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);

	const [searchQuery, setSearchQuery] = useState("");
	const [openAddDialog, setOpenAddDialog] = useState(false);

	const handleGetData = useCallback(async () => {
		// Attempting to get data
		try {
			// Getting data from API
			let result = await API.get(`/api/SiteLocations?siteId=${id}`);

			// if success, adding data to state
			if (result.status === 200) {
				// Updating state
				result.data.forEach((d, index) => {
					d.isDefault = false;

					result.data[index] = d;
				});

				handleSort(result.data, setData, "name", "asc");

				return true;
			} // Handling 404
			else if (result.status === 404) {
				setIs404(true);
				return;
			} else {
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			console.log(err);
			return false;
		}
	}, [id, setIs404]);

	useEffect(() => {
		// Getting data and updating state
		handleGetData()
			.then((data) => {
				if (data) {
					// Defaulting to asc name for sort
					setHaveData(true);
				} else {
					throw new Error("Unable to get data");
				}
			})
			.catch((err) => console.log(err));
	}, [handleGetData]);

	//Add Button Modal
	const handleAddDialogOpen = () => {
		setOpenAddDialog(true);
	};

	const handleAddDialogClose = () => {
		setOpenAddDialog(false);
	};

	const handleCreateData = (item) => {
		const newData = [...data];

		newData.push(item);

		setData(newData);

		setDataChanged(true);
	};

	const onNavClick = (path) => {
		history.push(path);
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

		return;
	};

	useEffect(() => {
		if (dataChanged) {
			handleSort(data, setData, currentTableSort[0], currentTableSort[1]);

			if (searchQuery !== "") {
				handleSearch();
			}

			setDataChanged(false);
		}
		// eslint-disable-next-line
	}, [dataChanged]);

	// Search sorting side effect
	useEffect(() => {
		// Performing search
		handleSearch();
		// eslint-disable-next-line
	}, [searchQuery]);


	return (
		<div className="container">
			<AddSiteLocationsDialog
				open={openAddDialog}
				closeHandler={handleAddDialogClose}
				createHandler={handleCreateData}
				siteID={id}
			/>

			<div
				className="flex justify-between"
				style={{ display: "flex", alignItems: "center" }}
			>
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

			<NavButtons
				navigation={[
					{ name: "Details", url: "" },
					{ name: "Assets", url: "/assets" },
					{ name: "Departments", url: "/departments" },
					{ name: "Locations", url: "/locations" },
				]}
				current={current}
				onClick={(nam) => onNavClick(`/site/${id}${nam}`)}
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
			{/* <DepartmentsTable {...{datas,handleDeleteDialogOpen}}/> */}
			<LocationsTable
				handleSort={handleSort}
				data={data}
				setData={setData}
				searchQuery={searchQuery}
				searchedData={searchedData}
				currentTableSort={currentTableSort}
				setSearchedData={setSearchedData}
				setCurrentTableSort={setCurrentTableSort}
				currentTableSort={currentTableSort}
				setDataChanged={setDataChanged}
			/>
		</div>
	);
};

export default SiteLocationsContent;
