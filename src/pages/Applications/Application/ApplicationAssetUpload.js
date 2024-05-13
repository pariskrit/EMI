import AccordionBox from "components/Layouts/AccordionBox";
import React, { useEffect, useState } from "react";
import ImageUpload from "components/Elements/ImageUpload";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { updateApplicaitonDetails } from "services/applications/detailsScreen/application";
import DeleteDialog from "pages/Models/ModelDetails/ModelDetail/DeleteDialog";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

const useStyles =  makeStyles()((theme) =>({
	logoContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
		paddingLeft: (props) => props?.paddingLeft,
		paddingRight: (props) => props?.paddingRight,
	},
	logoAccordion: {
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
	logoContentParent: {
		width: "100%",
	},
	spinnerContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
}))

function ApplicationAssetUpload({
	imageUrl,
	id,
	uploadToS3,
	title,
	titleKey,
	isReadOnly,
	paddingStyle = { paddingRight: "2%" },
}) {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [image, setImage] = useState(null);
	const dispatch = useDispatch();
	const [progressData, setProgressData] = useState(0);
	const classes = useStyles(paddingStyle);

	const onImageDrop = async (e) => {
		setIsUploading(true);
		const formData = new FormData();
		formData.append("file", e[0]);

		const response = await uploadToS3(id, formData, {
			onUploadProgress: (progressEvent) => {
				const progress = Math.floor(
					(progressEvent.loaded / progressEvent.total) * 100
				);
				setProgressData(progress);
			},
		});

		if (response.status) {
			setImage(response.data);
		} else {
			dispatch(showError(response?.data?.detail || "Could not upload image"));
		}
		setIsUploading(false);
		setProgressData(0);
	};

	const onDeleteLogo = () => setOpenDeleteDialog(true);

	const onDeleteDialogClose = () => setOpenDeleteDialog(false);

	const handleDeleteImage = async () => {
		setIsDeleting(true);
		const payload = [
			{
				op: "replace",
				path: titleKey,
				value: null,
			},
		];
		const response = await updateApplicaitonDetails(id, payload);
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
				entityName={title}
				handleDelete={handleDeleteImage}
				isDeleting={isDeleting}
			/>
			<div className={`${classes.logoContainer} logoContainerRight`}>
				<AccordionBox title={title} defaultExpanded={false}>
					<ImageUpload
						isReadOnly={isReadOnly}
						imageUrl={image}
						imageName=""
						onDrop={onImageDrop}
						removeImage={onDeleteLogo}
						isUploading={isUploading}
						uploadPercentCompleted={progressData}
					/>
				</AccordionBox>
			</div>
		</>
	);
}

export default ApplicationAssetUpload;
