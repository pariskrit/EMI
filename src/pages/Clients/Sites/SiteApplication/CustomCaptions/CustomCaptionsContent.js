import React, { useState, useEffect, useCallback } from "react";
import ContentStyle from "styles/application/ContentStyle";
import DetailsPanel from "components/Elements/DetailsPanel";
import CustomCaptionsTable from "./CustomCaptionsTable";
import "./customCaptions.css";
import { patchCustomCaptions } from "services/clients/sites/siteApplications/customCaptions";
import CircularProgress from "@material-ui/core/CircularProgress";

import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";

// Init styled components
const AC = ContentStyle();

const CustomCaptionsContent = ({ id, state, dispatch }) => {
	// Init state
	const [data, setData] = useState({});
	const [haveData, setHaveData] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	let defaultData = state.defaultCustomCaptionsData;

	// Handlers
	const handleGetData = useCallback(async () => {
		setData(state.details.data);
		setHaveData(true);
	}, [state]);

	const handleUpdateCustomCaption = async (key, value) => {
		try {
			let updateData = await patchCustomCaptions(id, [
				{
					op: "replace",
					path: key + "CC",
					value: value === "" ? null : value,
				},
			]);

			if (updateData.status) {
				setData({ ...data, ...{ [key + "CC"]: value } });
				dispatch({
					type: "SET_SITE_APP_DETAIL",
					payload: {
						...state.details,
						data: { ...state.details.data, [key + "CC"]: value },
					},
				});

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
