import AccordionBox from "components/Layouts/AccordionBox";
import React, { useEffect, useState } from "react";
import ImageUpload from "components/Elements/ImageUpload";
import {
	updateModel,
	uploadImageToS3,
} from "services/models/modelDetails/details";
import DeleteDialog from "../DeleteDialog";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";

function ModelImage({ imageUrl, modelId, isReadOnly }) {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [image, setImage] = useState(null);
	const dispatch = useDispatch();

	const onImageDrop = async (e) => {
		setIsUploading(true);
		const formData = new FormData();
		formData.append("file", e[0]);

		const response = await uploadImageToS3(modelId, formData);

		if (response.status) {
			setImage(response.data.imageURL);
		} else {
			dispatch(showError("Could not upload image"));
		}
		setIsUploading(false);
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
		} else {
			dispatch(showError("Could not delete"));
		}
		setIsDeleting(false);

		onDeleteDialogClose();
	};

	useEffect(() => {
		if (image === null && imageUrl) {
			setImage(imageUrl);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageUrl]);

	return (
		<>
			<DeleteDialog
				open={openDeleteDialog}
				closeHandler={onDeleteDialogClose}
				entityName="Model Image"
				handleDelete={handleDeleteImage}
				isDeleting={isDeleting}
			/>
			<AccordionBox title="Model Image (1)">
				<ImageUpload
					imageUrl={image}
					imageName=""
					onDrop={onImageDrop}
					removeImage={onDeleteLogo}
					isUploading={isUploading}
					isReadOnly={isReadOnly}
				/>
			</AccordionBox>
		</>
	);
}

export default ModelImage;
