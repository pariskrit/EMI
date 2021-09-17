import React, { useReducer, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DropUploadBox from "components/Modules/DropUploadBox";
import ProviderAsset from "components/Modules/ProvidedAsset/ProvidedAsset";
import { AssetReducer } from "./reducer";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";

// TODO: Below for dev. In prod, they will come from API call
import PLACEHOLER from "assets/PLACEHOLD.jpg";
import AccordionBox from "components/Layouts/AccordionBox";

const INIT_ASSETS = [
	{
		name: "example_name.jpg",
		alt: "User content",
		src: PLACEHOLER,
	},
	{
		name: "lorumipsum12121214432.jpg",
		alt: "User content",
		src: PLACEHOLER,
	},
	{
		name: "stuff_and_important.jpg",
		alt: "User content",
		src: PLACEHOLER,
	},
];

const useStyles = makeStyles((theme) => ({
	otherAssetContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
		paddingLeft: "2%",
	},
	otherAssetAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "99%",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
	detailsParentContainer: {
		width: "100%",
	},
	uploaderContainer: {
		marginTop: "5%",
	},
}));

const OtherAssets = () => {
	// Init hooks
	const classes = useStyles();

	// Init state
	const [assets, dispatch] = useReducer(AssetReducer, INIT_ASSETS);
	const [filesUploading, setFilesUploading] = useState(false);
	const id = 1;

	// Handlers
	const addAssetHandler = (name, alt, src) => {
		dispatch({
			type: "add",
			payload: {
				name: name,
				alt: alt,
				src: src,
			},
		});
	};
	const deleteAssetHandler = (index) => {
		dispatch({
			type: "delete",
			index,
		});
	};
	const newUploadHandler = (key) => {
		console.log(key);
		// files.forEach((file) => {
		// 	addAssetHandler(file.name, "User uploaded file", file.preview);
		// });
	};

	return (
		<div className={`${classes.otherAssetContainer} otherAssets`}>
			<AccordionBox title="Other Assets" defaultExpanded={false}>
				<div className={classes.detailsParentContainer}>
					{assets.map((asset, index) => {
						const handleDelete = () => {
							deleteAssetHandler(index);
						};

						// Preventing duplication of dividers
						if (index === assets.length - 1) {
							return (
								<ProviderAsset
									key={`asset-${index}`}
									noBottomDivider={false}
									name={asset.name}
									src={asset.src}
									alt={asset.alt}
									handleDelete={handleDelete}
								/>
							);
						} else {
							return (
								<ProviderAsset
									key={`asset-${index}`}
									noBottomDivider={true}
									name={asset.name}
									src={asset.src}
									alt={asset.alt}
									handleDelete={handleDelete}
								/>
							);
						}
					})}

					<div className={classes.uploaderContainer}>
						<DropUploadBox
							uploadReturn={newUploadHandler}
							apiPath={`${BASE_API_PATH}Applications/${id}/upload`}
							filesUploading={filesUploading}
							setFilesUploading={setFilesUploading}
							// isImageUploaded={true}
							// setErrorMessage={setErrorMessage}
							// setOpenErrorModal={setOpen}
						/>
					</div>
				</div>
			</AccordionBox>
		</div>
	);
};

export default OtherAssets;
