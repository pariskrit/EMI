import React, { useState, useEffect, useContext } from "react";
import { CircularProgress, LinearProgress } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import {
	getImages,
	updateImage,
} from "services/models/modelDetails/modelTasks/images";
import { connect, useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import GeneralButton from "components/Elements/GeneralButton";
import AddEditModel from "./AddEditModel";
import DeleteDialog from "components/Elements/DeleteDialog";
import TabelRowImage from "components/Elements/TabelRowImage";
import DetailsPanel from "components/Elements/DetailsPanel";
import withMount from "components/HOC/withMount";
import { TaskContext } from "contexts/TaskDetailContext";
import { setPositionForPayload } from "helpers/setPositionForPayload";
import { ModelContext } from "contexts/ModelDetailContext";
import { pasteModelTaskImage } from "services/models/modelDetails/modelTasks/pasteApi";
import ImageViewer from "components/Elements/ImageViewer";

const useStyles = makeStyles()((theme) => ({
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
}));

const Images = ({ taskInfo, getError, isMounted }) => {
	const me =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const access = me?.position?.modelAccess;

	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	const [, CtxDispatch] = useContext(TaskContext);
	const [state, MtxDispatch] = useContext(ModelContext);

	const [images, setImage] = useState({
		data: [],
		loading: true,
		open: false,
		imageId: null,
		delete: false,
		originalData: [],
		count: taskInfo.imageCount,
	});
	const [pastePart, setPastePart] = useState(true);
	const [isPasting, setIsPasting] = useState(false);
	const [openImage, setOPenImage] = useState(false);
	const [ImageToOpen, setImageToOpen] = useState(null);

	const setState = (da) => setImage((th) => ({ ...th, ...da }));

	function apiResponse(x) {
		return {
			...x,
			description: x.description === null ? "" : x.description,
			image: (
				<TabelRowImage
					imageURL={x?.thumbnailURL}
					imageHeight={"100px"}
					imageWidth={"100px"}
					onClickImage={() => {
						setOPenImage(true);
						setImageToOpen(x?.imageURL);
					}}
				/>
			),
		};
	}

	const errorResponse = (result) => {
		if (result.data.detail) getError(result.data.detail);
		else getError("Something went wrong");
	};

	const fetchTaskImages = async (showLoading = true) => {
		showLoading && setState({ loading: true });
		try {
			let result = await getImages(taskInfo.id);
			if (!isMounted.aborted) {
				showLoading && setState({ loading: false });
				if (result.status) {
					const responseData = result.data.map((x) => apiResponse(x));
					setState({ data: responseData, originalData: responseData });
					if (result.data.length > 0) {
						CtxDispatch({ type: "SET_IMAGES", payload: true });
					} else {
						CtxDispatch({ type: "SET_IMAGES", payload: false });
					}
				} else {
					errorResponse(result);
				}
			}
		} catch (e) {
			return;
		}
	};

	useEffect(() => {
		fetchTaskImages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setPastePart(state.isImageTaskDisabled);
	}, [state]);

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
					value: setPositionForPayload(e, images.originalData),
				},
			];
			const response = await updateImage(e.draggableId, payloadBody);
			if (!isMounted.aborted) {
				if (response.status) {
					const newDate = result.map((x, i) =>
						i === e.destination.index ? { ...x, pos: response.data.pos } : x
					);
					setState({ originalData: newDate, data: newDate });
				} else {
					setState({ data: images.originalData });
				}
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

	const handleAddEditComplete = (data) => {
		if (images.imageId) {
			const updatedData = images.data.map((x) =>
				x.id === images.imageId ? { ...x, description: data } : x
			);
			setImage((prev) => ({
				...prev,
				data: updatedData,
				originalData: updatedData,
			}));
		} else {
			const mainData = [...images.data];
			mainData.push(apiResponse(data));
			setState({
				count: images.count + 1,
				data: mainData,
				originalData: mainData,
			});
			CtxDispatch({
				type: "TAB_COUNT",
				payload: {
					countTab: "imageCount",
					data: mainData?.length,
				},
			});
			if (mainData.length > 0) {
				CtxDispatch({ type: "SET_IMAGES", payload: true });
			} else {
				CtxDispatch({ type: "SET_IMAGES", payload: false });
			}
		}
	};

	const handleDelete = (id) => {
		setState({ delete: true, imageId: id });
	};

	const handleRemoveData = (id) => {
		const filteredData = images.data.filter((x) => x.id !== id);
		setState({ data: filteredData, count: images.count - 1 });
		CtxDispatch({
			type: "TAB_COUNT",
			payload: {
				countTab: "imageCount",
				data: filteredData?.length,
			},
		});
		if (filteredData.length === 0) {
			CtxDispatch({ type: "SET_IMAGES", payload: false });
		}
	};

	const handleDeleteDialogClose = () => {
		setState({ delete: false, imageId: null });
	};

	const handleCopy = (id) => {
		localStorage.setItem("taskimage", id);
		MtxDispatch({ type: "DISABLE_IMAGES_TASK", payload: false });
	};

	const handlePaste = async () => {
		setIsPasting(true);
		try {
			const taskPartId = localStorage.getItem("taskimage");
			let result = await pasteModelTaskImage(taskInfo.id, {
				modelVersionTaskImageID: taskPartId,
			});

			if (!isMounted.aborted) {
				if (result.status) {
					await fetchTaskImages(false);
				} else {
					// errorResponse(result);
					dispatch(showError(result?.data?.detail || "Could not paste"));
				}
			}
		} catch (e) {
			return;
		}
		setIsPasting(false);
	};

	const checkcopyPartStatus = async () => {
		try {
			const taskId = localStorage.getItem("taskimage");

			if (taskId) {
				setPastePart(false);
			}
		} catch (error) {
			return;
		}
	};

	const visibilitychangeCheck = function () {
		if (!document.hidden) {
			checkcopyPartStatus();
		}
	};

	useEffect(() => {
		checkcopyPartStatus();
		document.addEventListener("visibilitychange", visibilitychangeCheck);
		return () =>
			document.removeEventListener("visibilitychange", visibilitychangeCheck);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (images.loading) {
		return <CircularProgress />;
	}

	return (
		<>
			<ImageViewer
				open={openImage}
				onClose={() => {
					setOPenImage(false);
					setImageToOpen(null);
				}}
				imgSource={ImageToOpen}
			/>
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
				entityName="Image"
				deleteID={images.imageId}
				deleteEndpoint={`/api/modelversiontaskimages`}
				handleRemoveData={handleRemoveData}
				closeHandler={handleDeleteDialogClose}
			/>
			<div className={classes.images}>
				<div className={classes.header}>
					<DetailsPanel header={`Images`} dataCount={images.count} />
					{access === "F" && !state?.modelDetail?.isPublished ? (
						<>
							<GeneralButton
								style={{ background: "#ED8738" }}
								onClick={handlePaste}
								disabled={pastePart}
							>
								Paste {"Image"}
							</GeneralButton>
							<GeneralButton onClick={() => setState({ open: true })}>
								ADD IMAGE
							</GeneralButton>
						</>
					) : null}
				</div>
				{isPasting ? <LinearProgress /> : null}

				<DragAndDropTable
					data={images.data}
					handleDragEnd={handleDragEnd}
					headers={["Image", "Description"]}
					columns={[
						{ id: 1, name: "image", style: { width: "50vw" } },
						{ id: 2, name: "description", style: { width: "50vw" } },
					]}
					isModelEditable
					disableDnd={access === "R" || state?.modelDetail?.isPublished}
					menuData={[
						{
							name: "Edit",
							handler: handleEdit,
							isDelete: false,
						},
						{
							name: "Copy",
							handler: handleCopy,
						},
						{
							name: "Delete",
							handler: handleDelete,
							isDelete: true,
						},
					].filter((x) => {
						if (state?.modelDetail?.isPublished) {
							return x?.name === "Copy";
						}
						if (access === "F") return true;
						if (access === "E") {
							if (x.name === "Edit") return true;
							else return false;
						}
						return false;
					})}
				/>
			</div>
		</>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(withMount(Images));
