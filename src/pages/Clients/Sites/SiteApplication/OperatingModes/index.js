import React, { useContext, useEffect, useState } from "react";
import DetailsPanel from "components/Elements/DetailsPanel";
import ContentStyle from "styles/application/ContentStyle";
import Grid from "@material-ui/core/Grid";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import OperatingModesTable from "./OperatingModesTable";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import { getOperatingModes } from "services/clients/sites/siteApplications/operatingModes";
import { SiteContext } from "contexts/SiteApplicationContext";
import DeleteDialog from "components/Elements/DeleteDialog";

const AC = ContentStyle();

function OperatingModes({ appId }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [data, setData] = useState([]);
	const [searchedData, setSearchData] = useState([]);
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [{ showAdd }, dispatch] = useContext(SiteContext);

	const handleSearch = (e) => {
		const { value } = e.target;
		setSearchQuery(value);
		const filtered = data.filter((x) => {
			const regex = new RegExp(value, "gi");
			return x.name.match(regex);
		});
		setSearchData(filtered);
	};

	const fetchOperatingModesLists = async () => {
		const result = await getOperatingModes(appId);
		setData(result.data);
	};

	const closeAddModal = () => dispatch({ type: "ADD_TOGGLE" });

	const addData = (newData) => setData([...data, newData]);

	const onOpenDeleteDialog = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const handleRemoveData = (id) =>
		setData([...data.filter((d) => d.id !== id)]);

	useEffect(() => {
		fetchOperatingModesLists();
	}, []);

	return (
		<>
			<DeleteDialog
				entityName="Operating Mode"
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteId}
				deleteEndpoint="/api/operatingmodes"
				handleRemoveData={handleRemoveData}
			/>
			<AddDialog
				open={showAdd}
				closeHandler={closeAddModal}
				applicationID={appId}
				handleAddData={addData}
			/>
			<EditDialog />
			<div className="detailsContainer">
				<DetailsPanel
					header={"Operating Modes"}
					dataCount={2}
					description="Create and manage Operating Modes"
				/>
				<div className="desktopSearchCustomCaptions">
					<AC.SearchContainer>
						<AC.SearchInner>
							<Grid container spacing={1} alignItems="flex-end">
								<div className="flex">
									<Grid item>
										<SearchIcon
											style={{ marginTop: "20px", marginRight: "5px" }}
										/>
									</Grid>
									<Grid item>
										<AC.SearchInput
											value={searchQuery}
											onChange={handleSearch}
											label="Search Operating Modes"
										/>
									</Grid>
								</div>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainer>
				</div>
			</div>

			<OperatingModesTable
				currentTableSort={currentTableSort}
				data={data}
				handleDeleteDialogOpen={onOpenDeleteDialog}
				searchedData={""}
				searchQuery=""
			/>
		</>
	);
}

export default OperatingModes;
