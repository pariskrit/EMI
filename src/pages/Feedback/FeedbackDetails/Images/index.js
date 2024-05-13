import { CircularProgress, Grid } from "@mui/material";
import ImageUpload from "components/Elements/ImageUpload";
import ImageViewer from "components/Elements/ImageViewer";
import AccordionBox from "components/Layouts/AccordionBox";
import ProvidedAsset from "components/Modules/ProvidedAsset/ProvidedAsset";
import { BASE_API_PATH } from "helpers/constants";
import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "tss-react/mui";

import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import {
	getFeedbackImages,
	uploadFeedbackImage,
} from "services/feedback/feedbackdetails";

const useStyles = makeStyles()((theme) => ({
	image: {
		padding: "0 8px !important",
	},
}));

function DefectImages({ feedbackId, captions, isReadOnly }) {
	const { classes, cx } = useStyles();
	const [images, setImages] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const [progressData, setProgressData] = useState(0);
	const [loading, setLoading] = useState(true);
	const [openImageViewer, setOpenImageViewer] = useState(false);
	const [imagetoView, setImageToview] = useState("");
	const dispatch = useDispatch();

	const handleImageUpload = async (e) => {
		setIsUploading(true);
		const formData = new FormData();
		formData.append("file", e[0]);

		const response = await uploadFeedbackImage(feedbackId, formData, {
			onUploadProgress: (progressEvent) => {
				const progress = Math.floor(
					(progressEvent?.loaded / progressEvent?.total) * 100
				);
				setProgressData(progress);
			},
		});
		if (response.status) {
			setImages([...images, response.data]);
		} else {
			dispatch(showError(response?.data?.detail || "Could not upload image"));
		}
		setIsUploading(false);
		setProgressData(0);
	};

	const handleDeleteImage = (id) =>
		setImages(images.filter((img) => img?.id !== id));

	const handleOpenImageViewer = (imgUrl) => {
		setOpenImageViewer(true);
		setImageToview(imgUrl);
	};

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
		<>
			<ImageViewer
				open={openImageViewer}
				onClose={() => setOpenImageViewer(false)}
				imgSource={imagetoView}
			/>
			<AccordionBox
				title={`${captions?.feedback} Images (${images?.length})`}
				defaultExpanded
			>
				{loading ? (
					<CircularProgress />
				) : (
					<Grid container spacing={2}>
						{images.map((img) => (
							<Grid item xs={12} key={img?.id} className={classes?.image}>
								<ProvidedAsset
									src={img?.thumbnailURL}
									alt={img?.imageKey}
									deleteName="Image"
									noBottomDivider
									deleteLogo={handleDeleteImage}
									deleteEndpoint={`${BASE_API_PATH}feedbackimages`}
									imageId={img?.id}
									isLogo={false}
									onImageClick={() => handleOpenImageViewer(img?.imageURL)}
									isReadOnly={isReadOnly}
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
									isReadOnly={isReadOnly}
								/>
							</Grid>
						) : null}
					</Grid>
				)}
			</AccordionBox>
		</>
	);
}

export default DefectImages;
