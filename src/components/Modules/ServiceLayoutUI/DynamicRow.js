import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import reorder from "assets/reorder.png";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
	appPath,
	modelQuestions,
	modelsPath,
	modelTask,
} from "helpers/routePaths";
import { COLLAPSEDID } from "constants/modelDetails";

const style = {
	color: "#307ad7",
};
function DynamicRow({
	rowData,
	isChild = false,
	isDragDisabled,
	isLastDroppable = false,
	firstRender = true,
	taskIdToHighlight,
	taskQuestionIdToHighlight,
}) {
	const [isMore, setIsMore] = useState({});
	const navigate = useNavigate();
	const { id } = useParams();
	const collapsedIds = JSON.parse(sessionStorage.getItem(COLLAPSEDID) || "{}");

	const handleSessionStorage = (data) => {
		sessionStorage.setItem(COLLAPSEDID, JSON.stringify(data));
	};

	const showChildren = (id, childrenData) => {
		const collapsedIds = JSON.parse(
			sessionStorage.getItem(COLLAPSEDID) || "{}"
		);
		if (isMore[id]?.show) {
			setIsMore({ ...isMore, [id]: { show: false } });
			collapsedIds[id] = { show: false };
			handleSessionStorage(collapsedIds);
			return;
		}
		//add children id to collapse id in session
		const zoneIds = childrenData?.zones?.map((zone) => zone.modelVersionZoneID);
		const taskIds = childrenData?.tasks
			?.filter((task) => task.questions.length)
			.map((data) => data.id);
		const tempCollapseIds = [...(zoneIds || []), ...(taskIds || [])];
		tempCollapseIds?.forEach((item) => (collapsedIds[item] = { show: false }));

		setIsMore({ ...isMore, [id]: { show: true } });
		delete collapsedIds?.[id];
		handleSessionStorage(collapsedIds);
	};

	const redirectToQuestionsOrTasksTab = (value) => {
		if (value?.type === "stage") return;

		const goToTask = value?.type === "task" || value?.type2 === "taskQuestion";
		navigate(
			goToTask
				? `${appPath}${modelsPath}/${id}${modelTask}`
				: `${appPath}${modelsPath}/${id}${modelQuestions}`,
			{
				state: goToTask
					? {
							modelVersionTaskID: value?.modelVersionTaskID || value?.taskId,
							modelVersionQuestionID: value?.type === "task" ? null : value?.id,
							fromServiceLayout: true,
					  }
					: { modelVersionQuestionID: value?.id },
			}
		);
	};

	//returns ids in value and perform recursive loop to children value
	const getArrayOfIds = (data, highlightedId) => {
		const ids = [];
		data.forEach((d) => {
			if (d?.value?.tasks?.length) {
				const isIdPresent = d.value.tasks.some(
					(task) =>
						task.id === highlightedId ||
						task.modelVersionTaskID === highlightedId
				);
				if (isIdPresent) {
					d.value.tasks.forEach((task) => {
						if (
							task.modelVersionTaskID !== highlightedId &&
							task.questions.length
						) {
							collapsedIds[task.id] = { show: false };
							handleSessionStorage(collapsedIds);
						}
						ids.push(task.id);
					});
				} else {
					collapsedIds[d.value.id] = { show: false };
					handleSessionStorage(collapsedIds);
				}
			} else {
				d?.value?.modelVersionTaskID && ids.push(d?.value?.modelVersionTaskID);
				d?.value?.id && ids.push(d?.value?.id);
				d?.value?.modelVersionTaskQuestionID &&
					ids.push(d?.value?.modelVersionTaskQuestionID);
			}
			if (!Array.isArray(d?.children)) {
				ids.push(...getArrayOfIds(d.children.value, highlightedId));
			}
		});

		return ids;
	};

	useEffect(() => {
		const autoExpandRows = () => {
			if (
				rowData.name !== "startQuestions" &&
				rowData.name !== "endQuestions"
			) {
				const listOfIds = rowData?.value
					.filter((val) => val?.children?.length !== 0)
					.map((val) => val?.value?.id);

				if (listOfIds.length !== 0) {
					let idsToExpand = {};
					listOfIds.forEach((id) => {
						let value = false;
						const highlightedId = +taskIdToHighlight || +taskIdToHighlight;

						//check if the collapsed items contains the id to highlight
						if (highlightedId && collapsedIds.hasOwnProperty(`${id}`)) {
							const requiredData = rowData?.value?.find(
								(data) => data?.value?.id === id
							);

							const tempId = getArrayOfIds([requiredData], highlightedId);
							value = tempId.includes(highlightedId);
							if (value) {
								const collapsedIds = JSON.parse(
									sessionStorage.getItem(COLLAPSEDID) || "{}"
								);
								delete collapsedIds?.[id];
								handleSessionStorage(collapsedIds);
							}
						}

						//set collapse state added based on session storage and the value of highlighted ids
						if (!collapsedIds.hasOwnProperty(`${id}`) || value) {
							idsToExpand = { ...idsToExpand, [id]: { show: true } };
						}
					});
					setIsMore(idsToExpand);
				}
			}
		};
		if (firstRender) autoExpandRows();
	}, [rowData, firstRender]);

	return (
		<Droppable
			droppableId={
				rowData?.parentId
					? `droppable_${rowData?.rowName}_${rowData?.parentId}_${rowData?.value?.[0]?.value?.grandParentId}`
					: `droppable_${rowData?.rowName}`
			}
			type={rowData?.name}
		>
			{(provided, snapshot) => (
				<div
					{...provided.droppableProps}
					ref={provided.innerRef}
					style={{
						marginLeft: rowData.marginLeft,
						borderLeft: isChild ? "2px solid #307ad7" : null,
					}}
					className="position-relative"
				>
					{rowData?.value?.map((val, i) => (
						<React.Fragment key={val?.value?.sn}>
							<Draggable
								key={val?.value?.id + (val?.value?.grandParentId || 1)}
								draggableId={`${val?.value?.type}_${val?.value?.id}_${val?.value?.grandParentId}_${val?.value?.parentId}_${val?.value?.childId}_${i}`}
								index={i}
								isDragDisabled={!val?.value?.isDraggable || isDragDisabled}
							>
								{(provided2, snapshot) => (
									<>
										{isLastDroppable ? (
											<div className="sl-white-border last-child-row"></div>
										) : null}
										<div
											ref={provided2.innerRef}
											{...provided2.draggableProps}
											className="row__questions"
										>
											{isChild && i === rowData?.value?.length - 1 ? (
												<div className="sl-white-border"></div>
											) : null}
											<div className="row__main">
												{isChild ? (
													<span
														style={{
															width: "19px",
															height: "2px",
															background: "#307ad7",
															marginLeft: "-1px",
														}}
													></span>
												) : null}
												<div className="row__questions__icon">
													<img
														src={val?.value?.icon}
														alt="icon"
														style={{ width: "20px", height: "20px" }}
													/>
												</div>
												<div
													{...provided2.dragHandleProps}
													style={{
														display:
															!isDragDisabled && val?.value?.isDraggable
																? "block"
																: "none",

														marginLeft: "10px",
													}}
												>
													<img
														src={reorder}
														alt="icon"
														style={{ width: "18px", height: "18px" }}
													/>
												</div>
												{val?.children?.value?.length &&
												!val?.value?.hideTaskQuestions ? (
													<div
														className="row__questions__moreicon"
														onClick={() =>
															showChildren(val?.value?.id, val.value)
														}
													>
														{isMore[val?.value?.id]?.show ? (
															<RemoveCircleOutlineIcon style={style} />
														) : (
															<AddCircleOutlineOutlinedIcon style={style} />
														)}
													</div>
												) : null}

												<div
													id={
														val?.value?.highlightTask ||
														val?.value?.highlightQuestion ||
														val?.value?.highlightTaskQuestion
															? `highlightedTask`
															: ""
													}
													className={`row__questions__item ${
														val?.value?.type !== "zone" &&
														val?.value?.type !== "stage"
															? "cursor link"
															: ""
													} ${
														val?.value?.highlightTask ||
														val?.value?.highlightQuestion ||
														val?.value?.highlightTaskQuestion
															? "highlight"
															: ""
													}`}
													onClick={() =>
														redirectToQuestionsOrTasksTab(val?.value)
													}
												>
													{val?.value?.type === "task"
														? `${val?.value?.actionName ?? ""} ${
																val?.value?.name
														  } `
														: val?.value?.name}
													{val?.value?.assetName &&
													val?.value?.type === "task" ? (
														<span style={{ fontStyle: "italic" }}>
															({val?.value?.assetName})
														</span>
													) : null}
												</div>
											</div>
										</div>
									</>
								)}
							</Draggable>
							{isMore[val?.value?.id]?.show &&
							!val?.value?.hideTaskQuestions ? (
								<DynamicRow
									rowData={val?.children}
									isChild={val?.children?.value?.length}
									isDragDisabled={isDragDisabled}
									isLastDroppable={i === rowData?.value?.length - 1}
									firstRender={firstRender}
									taskIdToHighlight={taskIdToHighlight}
									taskQuestionIdToHighlight={taskQuestionIdToHighlight}
								/>
							) : null}
						</React.Fragment>
					))}

					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
}

export default DynamicRow;
