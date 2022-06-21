import { CircularProgress, Grid, makeStyles } from "@material-ui/core";
import ImageUpload from "components/Elements/ImageUpload";
import AccordionBox from "components/Layouts/AccordionBox";
import ProvidedAsset from "components/Modules/ProvidedAsset/ProvidedAsset";
import { BASE_API_PATH } from "helpers/constants";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getDefectImages, uploadDefectImage } from "services/defects/details";
import {
	getFeedbackImages,
	uploadFeedbackImage,
} from "services/feedback/feedbackdetails";

const useStyles = makeStyles({
	image: {
		padding: "0 8px !important",
	},
});

function DefectImages({ feedbackId, captions }) {
	const classes = useStyles();
	const [images, setImages] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const [progressData, setProgressData] = useState(0);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	const handleImageUpload = async (e) => {
		setIsUploading(true);
		const formData = new FormData();
		formData.append("file", e[0]);

		const response = await uploadFeedbackImage(feedbackId, formData, {
			onUploadProgress: (progressEvent) => {
				const progress = Math.floor(
					(progressEvent.loaded / progressEvent.total) * 100
				);
				setProgressData(progress);
			},
		});
		if (response.status) {
			setImages([...images, response.data]);
		} else {
			dispatch(showError(response.data?.detail || "Could not upload image"));
		}
		setIsUploading(false);
		setProgressData(0);
	};

	const handleDeleteImage = (id) =>
		setImages(images.filter((img) => img.id !== id));

	const fetchDefectImages = useCallback(async () => {
		const response = await getFeedbackImages(feedbackId);

		if (response.status) {
			setImages(response.data);
		}

		setLoading(false);
	}, [feedbackId]);

	useEffect(() => {
		fetchDefectImages();
	}, [fetchDefectImages]);

	return (
		<AccordionBox
			title={`${captions?.feedback} Images (${images.length})`}
			defaultExpanded
		>
			{loading ? (
				<CircularProgress />
			) : (
				<Grid container spacing={2}>
					{images.map((img) => (
						<Grid item xs={12} key={img.id} className={classes.image}>
							<ProvidedAsset
								src={img.thumbnailURL}
								alt={img.imageKey}
								deleteName="Image"
								noBottomDivider
								deleteLogo={handleDeleteImage}
								deleteEndpoint={`${BASE_API_PATH}feedbackimages`}
								imageId={img.id}
								isLogo={false}
							/>
						</Grid>
					))}

					{images.length < 6 ? (
						<Grid item xs={12}>
							<ImageUpload
								imageUrl={null}
								imageName=""
								onDrop={handleImageUpload}
								isUploading={isUploading}
								uploadPercentCompleted={progressData}
							/>
						</Grid>
					) : null}
				</Grid>
			)}
		</AccordionBox>
	);
}

export default DefectImages;
