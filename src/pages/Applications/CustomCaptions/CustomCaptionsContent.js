import React, { useState, useEffect, useCallback } from "react";
import API from "helpers/api";
import ContentStyle from "styles/application/ContentStyle";
import CircularProgress from "@mui/material/CircularProgress";
import NavDetails from "components/Elements/NavDetails";
import NavButtons from "components/Elements/NavButtons";
import DetailsPanel from "components/Elements/DetailsPanel";
import Grid from "@mui/material/Grid";
import CustomCaptionsTable from "./CustomCaptionsTable";
import "./customCaptions.css";
// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import { appPath, applicationListPath } from "helpers/routePaths";
import TabTitle from "components/Elements/TabTitle";
import { setHistoryDrawerState, showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import RestoreIcon from "@mui/icons-material/Restore";
import { useSelector } from "react-redux";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { getApplicationDetails } from "services/History/application";

// Init styled components
const AC = ContentStyle();

const CustomCaptionsContent = ({ navigation, id, setIs404, state }) => {
	// Init state
	const [applicationName, setApplicationName] = useState("");
	const [data, setData] = useState({});
	const [haveData, setHaveData] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const errorDispatch = useDispatch();
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);

	// Handlers
	const handleGetData = useCallback(
		async (updateName) => {
			// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
			// to caching), which should technically prevent unrequired backend calls
			// Attempting to get data
			try {
				// Getting data from API
				let result = await API.get(`/api/Applications/${id}`);

				// if success, adding data to state
				if (result.status === 200) {
					// Updating name if required
					if (updateName) {
						setApplicationName(result.data.name);
					}

					// Replacing CC nulls with empty string. Needed for input state consistancy
					let nullReplaced = result.data;

					Object.keys(nullReplaced).forEach((el) => {
						if (el.indexOf("CC") !== -1 && nullReplaced[el] === null) {
							nullReplaced[el] = "";
						} else {
							return;
						}
					});

					setData(nullReplaced);

					setHaveData(true);

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
				errorDispatch(showError("Failed to fetch custom captions."));
				return false;
			}
		},
		[id, setIs404]
	);
	const handleUpdateCustomCaption = async (key, value) => {
		if (value === "") {
			errorDispatch(showError("Custom Captions cannot be empty."));
			return { success: false, error: "Empty value sent" };
		}
		try {
			let updateData = await API.patch(`/api/Applications/${id}`, [
				{
					op: "replace",
					path: key,
					value: value === "" ? null : value,
				},
			]);

			if (updateData.status === 200) {
				setData({ ...data, ...{ [key]: value } });

				return { success: true, error: null };
			} else {
				throw new Error(updateData);
			}
		} catch (err) {
			if (err.response?.data?.errors !== undefined) {
				return { success: false, error: err.response.data.errors };
			} else {
				// TODO: non validation error handling
				errorDispatch(showError("Failed to update custom caption."));
				return { success: false, error: "Unknown error" };
			}
		}
	};

	// Fetch Side effect to get data
	useEffect(() => {
		// Handling update of name if state not provided
		let updateName = true;

		if (state !== null) {
			setApplicationName(state?.applicationName);

			updateName = false;
		}

		// Getting data and updating state
		handleGetData(updateName)
			.then(() => {
				// Rendering data
				setHaveData(true);
			})
			.catch((err) =>
				errorDispatch(showError("Failed to fetch custom captions."))
			);
		// eslint-disable-next-line
	}, [handleGetData]);

	return (
		<div className="container">
			<TabTitle title={`${applicationName} Custom Captions`} />
			<HistoryBar
				id={id}
				showhistorybar={isHistoryDrawerOpen}
				dispatch={errorDispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					getApplicationDetails(id, pageNumber, pageSize)
				}
			/>
			<div className="topContainerCustomCaptions">
				<NavDetails
					staticCrumbs={[
						{ id: 1, name: "Applications", url: appPath + applicationListPath },
						{
							id: 2,
							name: state !== null ? state?.applicationName : applicationName,
						},
					]}
				/>

				<div
					className="restore"
					onClick={() => errorDispatch(setHistoryDrawerState(true))}
				>
					<RestoreIcon />
				</div>
			</div>

			<NavButtons
				navigation={navigation}
				applicationName={
					state !== undefined ? state?.applicationName : applicationName
				}
				current="Details"
			/>

			{/* Spinner should start here */}
			{haveData ? (
				<>
					<div className="detailsContainer">
						<DetailsPanel
							header={"Custom Captions"}
							dataCount={null}
							description="Manage custom captions for this applications"
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
													variant="standard"
													value={searchQuery}
													onChange={(e) => {
														setSearchQuery(e.target.value);
													}}
													label="Search custom captions"
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
												variant="standard"
												value={searchQuery}
												onChange={(e) => {
													setSearchQuery(e.target.value);
												}}
												label="Search custom captions"
											/>
										</Grid>
									</Grid>
								</AC.SearchInner>
							</AC.SearchContainerMobile>
						</div>
					</div>

					<CustomCaptionsTable
						data={data}
						searchQuery={searchQuery}
						handleUpdateCustomCaption={handleUpdateCustomCaption}
					/>
				</>
			) : (
				<AC.SpinnerContainer>
					<CircularProgress />
				</AC.SpinnerContainer>
			)}
		</div>
	);
};

export default CustomCaptionsContent;
