import React, { useState, useEffect } from "react";
import { makeStyles, CircularProgress } from "@material-ui/core";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import {
	getImages,
	updateImage,
} from "services/models/modelDetails/modelTasks/images";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import GeneralButton from "components/Elements/GeneralButton";
import AddEditModel from "./AddEditModel";
import DeleteDialog from "components/Elements/DeleteDialog";
import TabelRowImage from "components/Elements/TabelRowImage";

const useStyles = makeStyles({
	images: {
		display: "flex",
		flexDirection: "column",
		marginBottom: 12,
	},
	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
});

const Images = ({ taskInfo, getError }) => {
	const classes = useStyles();
	const [images, setImage] = useState({
		data: [],
		loading: false,
		open: false,
		imageId: null,
		delete: false,
		originalData: [],
		count: taskInfo.imageCount,
	});

	const setState = (da) => setImage((th) => ({ ...th, ...da }));

	function apiResponse(x) {
		return {
			...x,
			description: x.description === null ? "" : x.description,
			image: (
				<TabelRowImage
					imageURL={x.imageURL}
					imageHeight={"100px"}
					imageWidth={"100px"}
				/>
			),
		};
	}

	const errorResponse = (result) => {
		if (result.data.detail) getError(result.data.detail);
		else getError("Something went wrong");
	};

	const fetchTaskImages = async () => {
		setState({ loading: true });
		try {
			let result = await getImages(taskInfo.id);
			setState({ loading: false });
			if (result.status) {
				const responseData = result.data.map((x) => apiResponse(x));
				setState({ data: responseData, originalData: responseData });
			} else {
				errorResponse(result);
			}
		} catch (e) {
			return;
		}
	};

	useEffect(() => {
		fetchTaskImages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setPositionForPayload = (e, listLength) => {
		const { destination, source } = e;
		if (destination.index === listLength - 1) {
			return images.originalData[destination.index]?.pos + 1;
		}
		if (destination.index === 0) {
			return images.originalData[destination.index]?.pos - 1;
		}

		if (destination.index > source.index) {
			return (
				(+images.originalData[destination.index]?.pos +
					+images.originalData[e.destination.index + 1]?.pos) /
				2
			);
		}
		return (
			(+images.originalData[destination.index]?.pos +
				+images.originalData[e.destination.index - 1]?.pos) /
			2
		);
	};

	const handleDragEnd = async (e) => {
		if (!e.destination) {
			return;
		}

		if (e.destination.index === e.source.index) return;
		const result = [...images.data];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setState({ data: result });

		try {
			let payloadBody = [
				{
					path: "pos",
					op: "replace",
					value: setPositionForPayload(e, images.originalData.length),
				},
			];
			const response = await updateImage(e.draggableId, payloadBody);
			if (response.status) {
				setState({ originalData: result });
			} else {
				setState({ data: images.originalData });
			}
		} catch (error) {
			return;
		}
	};

	const handleClose = () => {
		setState({ open: false, imageId: null });
	};

	const handleEdit = (id) => {
		setState({ open: true, imageId: id });
	};

	const handleAddEditComplete = (description) => {
		if (images.imageId) {
			const updatedData = images.data.map((x) =>
				x.id === images.imageId ? { ...x, description } : x
			);
			setImage({ data: updatedData });
		} else {
			fetchTaskImages();
			setState({ count: images.count + 1 });
		}
	};

	const handleDelete = (id) => {
		setState({ delete: true, imageId: id });
	};

	const handleRemoveData = (id) => {
		const filteredData = images.data.filter((x) => x.id !== id);
		setState({ data: filteredData, count: images.count - 1 });
	};

	const handleDeleteDialogClose = () => {
		setState({ delete: false, imageId: null });
	};

	if (images.loading) {
		return <CircularProgress />;
	}

	return (
		<>
			{images.open && (
				<AddEditModel
					open={images.open}
					handleClose={handleClose}
					title="Image"
					taskId={taskInfo.id}
					imageDetail={images.data.find((x) => x.id === images.imageId)}
					handleComplete={handleAddEditComplete}
					errorResponse={errorResponse}
				/>
			)}
			<DeleteDialog
				open={images.delete}
				entityName="Model Image"
				deleteID={images.imageId}
				deleteEndpoint={`/api/modelversiontaskimages`}
				handleRemoveData={handleRemoveData}
				closeHandler={handleDeleteDialogClose}
			/>
			<div className={classes.images}>
				<div className={classes.header}>
					<h1>Images ({images.count})</h1>
					<GeneralButton onClick={() => setState({ open: true })}>
						Add Image
					</GeneralButton>
				</div>
				<DragAndDropTable
					data={images.data}
					handleDragEnd={handleDragEnd}
					headers={["Image", "Description"]}
					columns={[
						{ id: 1, name: "image", style: { width: "50vw" } },
						{ id: 2, name: "description", style: { width: "50vw" } },
					]}
					isModelEditable
					menuData={[
						{
							name: "Edit",
							handler: handleEdit,
							isDelete: false,
						},
						{
							name: "Delete",
							handler: handleDelete,
							isDelete: true,
						},
					]}
				/>
			</div>
		</>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(Images);
