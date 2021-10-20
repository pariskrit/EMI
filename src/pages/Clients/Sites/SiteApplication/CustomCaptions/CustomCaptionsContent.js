import React, { useState, useEffect, useCallback, useContext } from "react";
import ContentStyle from "styles/application/ContentStyle";
import CircularProgress from "@material-ui/core/CircularProgress";
import DetailsPanel from "components/Elements/DetailsPanel";
import CustomCaptionsTable from "./CustomCaptionsTable";
import "./customCaptions.css";
import {
	getCustomCaptions,
	patchCustomCaptions,
	getDefaultCustomCaptions,
} from "services/clients/sites/siteApplications/customCaptions";
import { SiteContext } from "contexts/SiteApplicationContext";

import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";

// Init styled components
const AC = ContentStyle();

const CustomCaptionsContent = ({ id, setIs404, state }) => {
	// Init state
	const [data, setData] = useState({});
	// const [defaultData, setDefaultData] = useState({});
	const [haveData, setHaveData] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// const [state, dispatch] = useContext(SiteContext);

	let defaultData = state.defaultCustomCaptionsData;

	// Handlers
	const handleGetData = useCallback(
		async (updateName) => {
			// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
			// to caching), which should technically prevent unrequired backend calls
			// Attempting to get data
			try {
				// Getting data from API
				let result = await getCustomCaptions(id);

				// if success, adding data to state
				if (result.status) {
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
				console.log(err);
				return false;
			}
		},
		[id, setIs404]
	);

	const handleUpdateCustomCaption = async (key, value) => {
		try {
			let updateData = await patchCustomCaptions(id, [
				{
					op: "replace",
					path: key,
					value: value === "" ? null : value,
				},
			]);

			if (updateData.status) {
				setData({ ...data, ...{ [key]: value } });

				return { success: true, error: null };
			} else {
				throw new Error(updateData);
			}
		} catch (err) {
			if (err.response.data.errors !== undefined) {
				return { success: false, error: err.response.data.errors };
			} else {
				// TODO: non validation error handling
				console.log(err);

				return { success: false, error: "Unknown error" };
			}
		}
	};

	// Fetch Side effect to get data
	useEffect(() => {
		// Handling update of name if state not provided
		let updateName = true;

		// Getting data and updating state
		handleGetData(updateName)
			.then(() => {
				// Rendering data
				setHaveData(true);
			})
			.catch((err) => console.log(err));
		// eslint-disable-next-line
	}, [handleGetData]);

	return (
		<div>
			{/* Spinner should start here */}
			{haveData ? (
				<>
					<div className="detailsContainer">
						<DetailsPanel
							header={"Custom Captions"}
							dataCount={null}
							description="Manage custom captions for this applications"
						/>

						<SearchField
							searchQuery={searchQuery}
							setSearchQuery={(e) => setSearchQuery(e.target.value)}
							header="Custom Captions"
						/>

						<MobileSearchField
							searchQuery={searchQuery}
							setSearchQuery={(e) => setSearchQuery(e.target.value)}
							header="Custom Captions"
						/>
					</div>

					<CustomCaptionsTable
						data={data}
						defaultData={defaultData}
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
