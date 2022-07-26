import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ContentStyle from "styles/application/ContentStyle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import ApplicationActionButtons from "./ApplicationActionButtons";
import NavButtons from "components/Elements/NavButtons";
import ApplicationDetails from "./ApplicationDetails";
import ColourDetails from "./ColourDetails";
// import ApplicationLogo from "./ApplicationLogo";
// import SmallNavLogo from "./SmallNavLogo";
import API from "helpers/api";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import "./application2.css";
import NavDetails from "components/Elements/NavDetails";
import { applicationListPath } from "helpers/routePaths";
import AlertColor from "./alertColor";
import AssetUpload from "./ApplicationAssetUpload";
import {
	uploadAppLogo,
	uploadMobileWhiteAppLogo,
	uploadMobileWhiteSmallAppLogo,
	uploadSmallAppLogo,
	uploadWaterMark,
} from "services/applications/detailsScreen/application";
import TabTitle from "components/Elements/TabTitle";

// Init styled components
const AC = ContentStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
	purpose: yup.string("This field must be a string").nullable(),
	equipmentModelStructure: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
	assetModelStructure: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
	showLocations: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
	showLubricants: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
	showParts: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
	showOperatingMode: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
	showSystem: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
	showDefectParts: yup
		.boolean("This field must be a boolean (true or false)")
		.required("This field is required"),
	colour: yup
		.string("This field must be a string")
		.required("This field is required"),
	logoKey: yup.string("This field must be a string").nullable(),
	logoFilename: yup.string("This field must be a string").nullable(),
	isLogoTrademarked: yup
		.boolean("This field must be a boolean (true or false)")
		.nullable(),
	logoURL: yup.string("This field must be a string").nullable(),
});

// Default state schemas
const defaultErrorSchema = {
	name: null,
	purpose: null,
	equipmentModelStructure: null,
	assetModelStructure: null,
	showLocations: null,
	showLubricants: null,
	showParts: null,
	showOperatingMode: null,
	showSystem: null,
	showDefectParts: null,
	colour: null,
	logoKey: null,
	logoFilename: null,
	isLogoTrademarked: null,
	logoURL: null,
};
const defaultStateSchema = {
	name: "",
	purpose: "",
	equipmentModelStructure: false,
	assetModelStructure: false,
	showLocations: false,
	showLubricants: false,
	showParts: false,
	showOperatingMode: false,
	showSystem: false,
	showDefectParts: false,
	colour: "",
	logoKey: "",
	logoFilename: "",
	isLogoTrademarked: false,
	logoURL: "",
};

const ApplicationContent = ({ navigation, id, setIs404 }) => {
	const history = useHistory();

	// Init state
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState(defaultErrorSchema);

	// State that can prob be moved to global
	const [data, setData] = useState(defaultStateSchema);
	const [inputData, setInputData] = useState(defaultStateSchema);

	// isActive state is being patched on change (this is closer to the eventual autosave
	// future plan)
	const [isActive, setIsActive] = useState(false);

	// Handlers
	const handleSave = async (lKey, lName) => {
		// Handling updating of logo if provided
		if (lKey === undefined || lName === undefined) {
			lKey = inputData.logoKey;
			lName = inputData.logoFilename;
		} else {
			setInputData({ ...inputData, ...{ logoKey: lKey, logoFilename: lName } });
		}

		// Clearning any past errors
		setErrors(defaultErrorSchema);

		// Updating save state
		setIsSaving(true);

		// Attempting to save changes
		try {
			const localChecker = await handleValidateObj(schema, inputData);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				// Updating
				let result = await API.patch(`/api/Applications/${id}`, [
					{ op: "replace", path: "name", value: inputData.name },
					{ op: "replace", path: "purpose", value: inputData.purpose },
					{
						op: "replace",
						path: "allowIndividualAssetModels",
						value: inputData.equipmentModelStructure,
					},
					{
						op: "replace",
						path: "allowFacilityBasedModels",
						value: inputData.assetModelStructure,
					},
					{
						op: "replace",
						path: "showLocations",
						value: inputData.showLocations,
					},
					{
						op: "replace",
						path: "showLubricants",
						value: inputData.showLubricants,
					},
					{
						op: "replace",
						path: "showParts",
						value: inputData.showParts,
					},
					{
						op: "replace",
						path: "showOperatingMode",
						value: inputData.showOperatingMode,
					},
					{
						op: "replace",
						path: "showSystem",
						value: inputData.showSystem,
					},
					{
						op: "replace",
						path: "showDefectParts",
						value: inputData.showDefectParts,
					},
					{ op: "replace", path: "logoKey", value: lKey },
					{ op: "replace", path: "logoFilename", value: lName },
					{
						op: "replace",
						path: "isLogoTrademarked",
						value: inputData.isLogoTrademarked,
					},
					{
						op: "replace",
						path: "color",
						value: inputData.colour.substring(1),
					},
				]);

				// Handling success
				if (result.status === 200) {
					setData({
						...data,
						...inputData,
						...{ logoKey: lKey, logoFilename: lName },
					});

					// Updating saving state
					setIsSaving(false);

					return true;
				} else {
					throw new Error(result);
				}
			} else {
				const newErrors = generateErrorState(localChecker);

				setErrors({ ...errors, ...newErrors });
				setIsSaving(false);
			}
		} catch (err) {
			if (err.response.data.errors !== undefined) {
				setErrors({ ...errors, ...err.response.data.errors });
				setIsSaving(false);
			} else {
				// TODO: Handle non-validation errors
				setIsSaving(false);

				console.log(err);
				return false;
			}
		}
	};
	const handleUpdateIsActive = (updatedIsActive) => {
		setIsActive(updatedIsActive);
	};
	const handleRedirect = (id) => {
		history.push(`${applicationListPath}/${id}`);
	};

	// Fetching data after pageload
	useEffect(() => {
		// Below goofy syntax is due to no async/await support in main useEffect func
		// More details: https://stackoverflow.com/a/53572588/8151750
		const fetchData = async () => {
			// Attempting to get data
			try {
				// Fetching from backend
				let result = await API.get(`/api/Applications/${id}`);

				// Handling success
				if (result.status === 200) {
					result = result.data;

					// Setting isActive
					setIsActive(result.isActive);

					const updatedStated = {
						name: result.name,
						purpose: result.purpose,
						equipmentModelStructure: result.allowIndividualAssetModels,
						assetModelStructure: result.allowFacilityBasedModels,
						showLocations: result.showLocations,
						showLubricants: result.showLubricants,
						showModel: result.showModel,
						showSerialNumberRange: result.showSerialNumberRange,
						showParts: result.showParts,
						showOperatingMode: result.showOperatingMode,
						showSystem: result.showSystem,
						showDefectParts: result.showDefectParts,
						colour: `#${result.color}`,
						logoKey: result.logoKey,
						logoFilename: result.logoFilename,
						isLogoTrademarked: result.isLogoTrademarked,
						logoURL: result.logoURL,
						alertColor: `#${result.alertColor}`,
						watermarkURL: result.watermarkURL,
						mobileWhiteAppLogoURL: result.mobileWhiteAppLogoURL,
						mobileSmallWhiteAppLogoURL: result.mobileSmallWhiteAppLogoURL,
						smallLogoURL: result.smallLogoURL,
					};

					// Updating state
					setData(updatedStated);
					setInputData(updatedStated);

					// Stopping spinner and triggering render of data
					setIsLoading(false);
				}

				// Handling 404
				if (result.status === 404) {
					setIs404(true);
					return;
				}
			} catch (err) {
				// TODO: real handling of errors
				console.log(err);
				return;
			}
		};

		// Calling fetch function
		fetchData();
	}, [id, setIs404]);

	// Loading spinner while awaiting data. Otherwise, render screen
	if (isLoading) {
		return (
			<div className="container">
				<CircularProgress />
			</div>
		);
	} else {
		return (
			<div className="applicationContentContainer container">
				<TabTitle title={data.name} />
				<AC.TopContainer className="applicationNav">
					<NavDetails
						staticCrumbs={[
							{ id: 1, name: "Applications", url: applicationListPath },
							{ id: 2, name: data.name },
						]}
					/>

					<ApplicationActionButtons
						handleSave={handleSave}
						handleRedirect={handleRedirect}
						isSaving={isSaving}
						id={id}
						// TODO: Below will come from state when the field exists
						currentStatus={isActive}
						handleUpdateIsActive={handleUpdateIsActive}
					/>
				</AC.TopContainer>

				<NavButtons
					navigation={navigation}
					applicationName={data.name}
					current="Details"
				/>
				<Grid container>
					<Grid item xs={12}>
						<ApplicationDetails
							inputData={inputData}
							originalInputData={data}
							setInputData={setInputData}
							errors={errors}
							id={id}
						/>
					</Grid>

					{/*----------------------- Desktop View ----------------------- */}
					<Grid item xs={6} className="desktopViewGrid">
						<ColourDetails
							inputColour={inputData.colour}
							setInputColour={setInputData}
							id={id}
						/>
					</Grid>

					<Grid item xs={6} className="desktopViewGrid">
						<AssetUpload
							imageUrl={inputData.logoURL}
							id={id}
							uploadToS3={uploadAppLogo}
							title="Application Logo"
							titleKey="logoKey"
						/>
					</Grid>

					<Grid item xs={6} className="desktopViewGrid">
						<AlertColor
							inputColour={inputData.alertColor}
							setInputColour={setInputData}
							id={id}
						/>
					</Grid>

					<Grid item xs={6} className="desktopViewGrid">
						<AssetUpload
							imageUrl={inputData.watermarkURL}
							id={id}
							uploadToS3={uploadWaterMark}
							title="Watermark"
							titleKey="watermarkKey"
						/>
					</Grid>

					<Grid item xs={6} className="desktopViewGrid">
						<AssetUpload
							imageUrl={inputData.smallLogoURL}
							id={id}
							uploadToS3={uploadSmallAppLogo}
							title="Small Navigation Logo"
							titleKey="smallLogoKey"
							paddingStyle={{ paddingRight: "2%" }}
						/>
					</Grid>

					<Grid item xs={6} className="desktopViewGrid">
						<AssetUpload
							imageUrl={inputData.mobileWhiteAppLogoURL}
							id={id}
							uploadToS3={uploadMobileWhiteAppLogo}
							title="Mobile White App Logo"
							titleKey="mobileWhiteAppLogoKey"
						/>
					</Grid>

					<Grid item xs={6} className="desktopViewGrid">
						<AssetUpload
							imageUrl={inputData.mobileSmallWhiteAppLogoURL}
							id={id}
							uploadToS3={uploadMobileWhiteSmallAppLogo}
							title="Mobile Small White App Logo"
							titleKey="mobileSmallWhiteAppLogoKey"
							paddingStyle={{ paddingRight: "2%" }}
						/>
					</Grid>

					{/* ----------------------- Mobile View ----------------------- */}
					<Grid item xs={12} className="mobileViewGridWithDiffDisplay">
						<ColourDetails
							inputColour={inputData.colour}
							setInputColour={setInputData}
							id={id}
						/>
					</Grid>
					<Grid item xs={12} className="mobileViewGridWithDiffDisplay">
						<AlertColor
							inputColour={inputData.alertColor}
							setInputColour={setInputData}
							id={id}
						/>
					</Grid>
					<Grid item xs={12} className="mobileViewGridWithDiffDisplay">
						<AssetUpload
							imageUrl={inputData.logoURL}
							id={id}
							uploadToS3={uploadAppLogo}
							title="Application Logo"
							titleKey="logoKey"
						/>
					</Grid>
					<Grid item xs={12} className="mobileViewGridWithDiffDisplay">
						<AssetUpload
							imageUrl={inputData.smallLogoURL}
							id={id}
							uploadToS3={uploadSmallAppLogo}
							title="Small Navigation Logo"
							titleKey="smallLogoKey"
							paddingStyle={{ paddingRight: "2%" }}
						/>
					</Grid>
					<Grid item xs={12} className="mobileViewGridWithDiffDisplay">
						<AssetUpload
							imageUrl={inputData.watermarkURL}
							id={id}
							uploadToS3={uploadWaterMark}
							title="Watermark"
							titleKey="watermarkKey"
						/>
					</Grid>

					<Grid item xs={12} className="mobileViewGridWithDiffDisplay">
						<AssetUpload
							imageUrl={inputData.mobileWhiteAppLogoURL}
							id={id}
							uploadToS3={uploadMobileWhiteAppLogo}
							title="Mobile White App Logo"
							titleKey="mobileWhiteAppLogoKey"
						/>
					</Grid>

					<Grid item xs={12} className="mobileViewGridWithDiffDisplay">
						<AssetUpload
							imageUrl={inputData.mobileSmallWhiteAppLogoURL}
							id={id}
							uploadToS3={uploadMobileWhiteSmallAppLogo}
							title="Mobile Small White App Logo"
							titleKey="mobileSmallWhiteAppLogoKey"
						/>
					</Grid>
				</Grid>
			</div>
		);
	}
};

export default ApplicationContent;
