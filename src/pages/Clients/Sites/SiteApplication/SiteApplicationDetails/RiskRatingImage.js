import AccordionBox from "components/Layouts/AccordionBox";
import React, { useEffect, useState } from "react";
import ImageUpload from "components/Elements/ImageUpload";
import DeleteDialog from "pages/Models/ModelDetails/ModelDetail/DeleteDialog";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { CircularProgress } from "@material-ui/core";
import {
	DeleteDefectRiskRatingImage,
	uploadDefectRiskRatingImage,
} from "services/clients/sites/siteApplications/siteApplicationDetails";

function RiskRatingImage({ loading, details }) {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [image, setImage] = useState(null);
	const [uploadPercentCompleted, setUploadPercentCompleted] = useState(0);
	const dispatch = useDispatch();

	useEffect(() => {
		if (loading === false && details) {
			setImage(details?.data?.defectRiskRatingURL);
		}
	}, [details, loading]);

	const onImageDrop = async (e) => {
		setIsUploading(true);
		const formData = new FormData();
		formData.append("file", e[0]);

		const response = await uploadDefectRiskRatingImage(
			details?.data?.id,
			formData,
			{
				onUploadProgress: (progressEvent) => {
					let percentCompleted = Math.floor(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					setUploadPercentCompleted(() => percentCompleted);
				},
			}
		);

		if (response.status) {
			setImage(response.data);
		} else {
			dispatch(showError("Could not upload image"));
		}
		setIsUploading(false);
		setUploadPercentCompleted(() => 0);
	};

	const onDeleteLogo = () => setOpenDeleteDialog(true);

	const onDeleteDialogClose = () => setOpenDeleteDialog(false);

	const handleDeleteImage = async () => {
		setIsDeleting(true);
		const response = await DeleteDefectRiskRatingImage(details?.data?.id);
		if (response.status) {
			setImage(null);
		} else {
			dispatch(showError("Could not delete"));
		}
		setIsDeleting(false);

		onDeleteDialogClose();
	};

	if (loading) {
		return (
			<AccordionBox title="Details">
				<CircularProgress />
			</AccordionBox>
		);
	}

	return (
		<>
			<DeleteDialog
				open={openDeleteDialog}
				closeHandler={onDeleteDialogClose}
				entityName="Defect Risk Rating Image"
				handleDelete={handleDeleteImage}
				isDeleting={isDeleting}
			/>
			<AccordionBox title={`Defect Risk Rating Image`}>
				<ImageUpload
					imageUrl={image}
					imageName=""
					onDrop={onImageDrop}
					removeImage={onDeleteLogo}
					isUploading={isUploading}
					uploadPercentCompleted={uploadPercentCompleted}
				/>
			</AccordionBox>
		</>
	);
}

export default RiskRatingImage;
