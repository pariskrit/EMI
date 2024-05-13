import React, { useState, useEffect, useCallback, useContext } from "react";
import ContentStyle from "styles/application/ContentStyle";
import DetailsPanel from "components/Elements/DetailsPanel";
import CustomCaptionsTable from "./CustomCaptionsTable";
import "./customCaptions.css";
import { patchCustomCaptions } from "services/clients/sites/siteApplications/customCaptions";
import CircularProgress from "@mui/material/CircularProgress";

import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import TabTitle from "components/Elements/TabTitle";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

// Init styled components
const AC = ContentStyle();

const CustomCaptionsContent = ({ id, state, dispatch }) => {
	// Init state
	const errorDispatch = useDispatch();

	const [data, setData] = useState({});
	const [haveData, setHaveData] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	let defaultData = state.defaultCustomCaptionsData;

	// Handlers
	const handleGetData = useCallback(async () => {
		let nullReplaced = state.details.data;

		Object.keys(nullReplaced).forEach((el) => {
			if (el.indexOf("CC") !== -1 && nullReplaced[el] === null) {
				nullReplaced[el] = "";
			} else {
				return;
			}
		});

		setData(nullReplaced);
		setHaveData(true);
	}, [state]);

	const handleUpdateCustomCaption = async (key, value) => {
		if (value === "") {
			errorDispatch(showError("Custom Captions cannot be empty."));
			return { success: false, error: "Empty value sent" };
		}
		try {
			let updateData = await patchCustomCaptions(id, [
				{
					op: "replace",
					path: key + "CC",
					value: value === "" ? null : value,
				},
			]);

			if (updateData.status) {
				let customData = JSON.parse(sessionStorage.getItem("me"));
				let data = {
					...customData,
					customCaptions: {
						...customData.customCaptions,
						userReference: updateData.data.userReferenceCC,
						[key]: value,
					},
				};
				localStorage.setItem("me", JSON.stringify(data));
				sessionStorage.setItem("me", JSON.stringify(data));
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
			if (err.response?.data?.errors !== undefined) {
				return { success: false, error: err?.response?.data?.errors };
			} else {
				// TODO: non validation error handling
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
			.catch((err) => errorDispatch(showError("Failed to load data.")));
		// eslint-disable-next-line
	}, [handleGetData]);

	return (
		<div>
			<TabTitle
				title={`${state?.details?.data?.application?.name} Custom Captions`}
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
