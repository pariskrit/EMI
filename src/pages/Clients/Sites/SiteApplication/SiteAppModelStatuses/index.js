import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import API from "helpers/api";
import ContentStyle from "styles/application/ContentStyle";
import CircularProgress from "@material-ui/core/CircularProgress";
import DetailsPanel from "components/Elements/DetailsPanel";
import DeleteDialog from "components/Elements/DeleteDialog";
import DefaultDialog from "components/Elements/DefaultDialog";
import AddStatusDialog from "./AddDialog";
import EditStatusDialog from "./EditDialog";
import ModelStatusesTable from "./ModelStatusesTable";
import { showError } from "redux/common/actions";

// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

// Init styled components
const AC = ContentStyle();
const SiteAppModelStatuses = ({ state, dispatch, appId }) => {
	const [data, setData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchedData, setSearchedData] = useState([]);
	const [defaultData, setDefaultData] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleGetData = useCallback(async () => {
		setLoading(true);
		// Attempting to get data
		try {
			// Getting data from API
			let result = await API.get(`/api/modelstatuses?siteAppId=${appId}`);

			// if success, adding data to state
			if (result.status === 200) {
				setLoading(false);
				// Updating state
				result.data.forEach((d, index) => {
					d.isDefault = false;

					result.data[index] = d;
				});
				setData(result.data);

				return true;
			} else {
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			setLoading(false);
			console.log(err);
			return false;
		}
	}, [appId]);

	useEffect(() => {
		handleGetData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const mainData = searchQuery.length === 0 ? data : searchedData;

	return (
		<div>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Model Statuses"}
					dataCount={data.length}
					description="Create and manage Model Statuses"
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
											onChange={(e) => {
												setSearchQuery(e.target.value);
											}}
											label="Search Statuses"
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
										label="Search Statuses"
									/>
								</Grid>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainerMobile>
				</div>
			</div>
			<ModelStatusesTable
				setData={setData}
				data={mainData}
				defaultID={defaultData}
				onEdit={() => {}}
				onDelete={() => {}}
				onDefault={() => {}}
				searchQuery={searchQuery}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (message) => dispatch(showError(message)),
});

export default connect(null, mapDispatchToProps)(SiteAppModelStatuses);
