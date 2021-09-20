import React, { useCallback, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import DetailsPanel from "components/Elements/DetailsPanel";
import ContentStyle from "styles/application/ContentStyle";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";
import { handleSort } from "helpers/utils";
import AddDialog from "./AddDialog/AddDialog";

const AC = ContentStyle();

const SiteAppPauses = ({ state, dispatch, siteAppIds }) => {
	const { clientId, id, appId } = siteAppIds;
	const [data, setData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	// const [deleteID, setDeleteID] = useState(null);
	const [searchedData, setSearchData] = useState([]);

	const handleGetData = useCallback(async () => {
		try {
			let result = await API.get(`${BASE_API_PATH}Pauses?siteAppId=${appId}`);
			if (result.status === 200) {
				const mainData = result.data.map((x) => ({
					...x,
					totalSub: x.pauseSubcategories.length,
				}));

				handleSort(mainData, setData, "name", "asc");
				return result;
			}
		} catch (err) {}
	}, [appId]);

	const handleAddData = async (main) => {};

	useEffect(() => {
		handleGetData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSearch = (e) => {
		const { value } = e.target;
		setSearchQuery(value);
		const filtered = data.filter((x) => {
			const regex = new RegExp(value, "gi");
			return x.name.match(regex);
		});
		setSearchData(filtered);
	};

	const mainData = searchQuery.length === 0 ? data : searchedData;

	return (
		<div>
			<AddDialog
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "ADD_TOGGLE" })}
				applicationID={appId}
				handleAddData={handleAddData}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Pause Reasons"}
					dataCount={data.length}
					description="Create and manage Pause Reasons"
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
											label="Search Pauses"
										/>
									</Grid>
								</div>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainer>
				</div>
				<div className="mobileSearchCustomCaptions">
					<AC.SearchContainerMobile>
						<AC.SearchInner>
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
										label="Search Pauses"
									/>
								</Grid>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainerMobile>
				</div>
			</div>
			<CommonApplicationTable
				setData={setData}
				setSearch={setSearchData}
				searchQuery={searchQuery}
				data={mainData}
				columns={["name", "totalSub"]}
				headers={["Name", "Number of subcategories"]}
				onEdit={(id) => alert("Edit" + id)}
				onDelete={(id) => alert("Delete" + id)}
			/>
		</div>
	);
};

export default SiteAppPauses;
