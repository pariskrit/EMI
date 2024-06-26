import AccordionBox from "components/Layouts/AccordionBox";
import React, { useContext, useEffect, useState } from "react";
import ImageUpload from "components/Elements/ImageUpload";
import {
	updateModel,
	uploadImageToS3,
} from "services/models/modelDetails/details";
import DeleteDialog from "pages/Models/ModelDetails/ModelDetail/DeleteDialog";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import ImageViewer from "components/Elements/ImageViewer";
import { ModelContext } from "contexts/ModelDetailContext";

function ModelImage({
	imageUrl,
	modelId,
	isReadOnly,
	thumbnailURL,
	customCaptions,
}) {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [image, setImage] = useState(null);
	const [thumbnailImg, setThumbnailImg] = useState(null);

	const [openImage, setOPenImage] = useState(false);
	const [uploadPercentCompleted, setUploadPercentCompleted] = useState(0);
	const [, dispatch] = useContext(ModelContext);

	const reduxDispatch = useDispatch();

	const onImageDrop = async (e) => {
		setIsUploading(true);
		const formData = new FormData();
		formData.append("file", e[0]);

		const response = await uploadImageToS3(modelId, formData, {
			onUploadProgress: (progressEvent) => {
				let percentCompleted = Math.floor(
					(progressEvent.loaded * 100) / progressEvent.total
				);
				setUploadPercentCompleted(() => percentCompleted);
				// do whatever you like with the percentage complete
				// maybe reduxDispatch an action that will update a progress bar or something
			},
		});

		if (response.status) {
			setImage(response.data.imageURL);
			setThumbnailImg(response.data.thumbnailURL);
			dispatch({
				type: "SET_IMAGE",
				payload: {
					imageURL: response.data.imageURL,
					thumbnailURL: response.data.thumbnailURL,
				},
			});
		} else {
			reduxDispatch(showError("Could not upload image"));
		}
		setIsUploading(false);
		setUploadPercentCompleted(0);
	};

	const onDeleteLogo = () => setOpenDeleteDialog(true);

	const onDeleteDialogClose = () => setOpenDeleteDialog(false);

	const handleDeleteImage = async () => {
		setIsDeleting(true);
		const response = await updateModel(modelId, [
			{ op: "replace", path: "imageKey", value: null },
		]);

		if (response.status) {
			setImage(null);
			setThumbnailImg(null);
			dispatch({
				type: "SET_IMAGE",
				payload: {
					imageURL: null,
					thumbnailURL: null,
				},
			});
		} else {
			reduxDispatch(showError("Could not delete"));
		}
		setIsDeleting(false);

		onDeleteDialogClose();
	};

	useEffect(() => {
		if (image === null && imageUrl) {
			setImage(imageUrl);
			setThumbnailImg(thumbnailURL);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageUrl]);

	return (
		<>
			<ImageViewer
				open={openImage}
				onClose={() => setOPenImage(false)}
				imgSource={image}
			/>
			<DeleteDialog
				open={openDeleteDialog}
				closeHandler={onDeleteDialogClose}
				entityName="Model Image"
				handleDelete={handleDeleteImage}
				isDeleting={isDeleting}
			/>
			<AccordionBox title={`${customCaptions?.model} Image (${image ? 1 : 0})`}>
				<ImageUpload
					imageUrl={thumbnailImg}
					imageName=""
					onDrop={onImageDrop}
					removeImage={onDeleteLogo}
					isUploading={isUploading}
					isReadOnly={isReadOnly}
					onClick={() => setOPenImage(true)}
					uploadPercentCompleted={uploadPercentCompleted}
				/>
			</AccordionBox>
		</>
	);
}

export default ModelImage;
