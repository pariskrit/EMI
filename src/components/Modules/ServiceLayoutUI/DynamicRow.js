import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import reorder from "assets/reorder.png";
import "./style.css";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { modelQuestions, modelsPath, modelTask } from "helpers/routePaths";

const style = {
	color: "#307ad7",
};
function DynamicRow({
	rowData,
	isChild = false,
	isDragDisabled,
	isLastDroppable = false,
	firstRender = true,
}) {
	const [isMore, setIsMore] = useState({});
	const history = useHistory();
	const { id } = useParams();

	const showChildren = (id) => {
		if (isMore[id]?.show) {
			setIsMore({ ...isMore, [id]: { show: false } });
			return;
		}
		setIsMore({ ...isMore, [id]: { show: true } });
	};

	const redirectToQuestionsOrTasksTab = (value) => {
		if (value?.type === "stage") return;

		const goToTask = value.type === "task" || value.type2 === "taskQuestion";
		history.push({
			pathname: goToTask
				? `${modelsPath}/${id}${modelTask}`
				: `${modelsPath}/${id}${modelQuestions}`,
			state: goToTask
				? {
						modelVersionTaskID: value?.modelVersionTaskID || value?.taskId,
						modelVersionQuestionID: value.type === "task" ? null : value?.id,
						fromServiceLayout: true,
				  }
				: { modelVersionQuestionID: value?.id },
		});
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
						idsToExpand = { ...idsToExpand, [id]: { show: true } };
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
					? `droppable_${rowData?.rowName}_${rowData.parentId}`
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
						<React.Fragment key={val.value.sn}>
							<Draggable
								key={val.value.id}
								draggableId={`${val.value.type}_${val.value.id}_${val.value.grandParentId}_${val.value?.parentId}_${val.value.childId}`}
								index={i}
								isDragDisabled={!val.value.isDraggable || isDragDisabled}
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
											{isChild && i === rowData.value.length - 1 ? (
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
														src={val.value.icon}
														alt="icon"
														style={{ width: "20px", height: "20px" }}
													/>
												</div>
												{val?.children?.value?.length &&
												!val.value.hideTaskQuestions ? (
													<div
														className="row__questions__moreicon"
														onClick={() => showChildren(val.value.id)}
													>
														{isMore[val.value.id]?.show ? (
															<RemoveCircleOutlineIcon style={style} />
														) : (
															<AddCircleOutlineOutlinedIcon style={style} />
														)}
													</div>
												) : null}

												<div
													id={
														val.value.highlightTask ||
														val.value.highlightQuestion ||
														val.value.highlightTaskQuestion
															? `highlightedTask`
															: ""
													}
													className={`row__questions__item ${
														val.value.type !== "zone" &&
														val.value.type !== "stage"
															? "cursor link"
															: ""
													} ${
														val.value.highlightTask ||
														val.value.highlightQuestion ||
														val.value.highlightTaskQuestion
															? "highlight"
															: ""
													}`}
													onClick={() =>
														redirectToQuestionsOrTasksTab(val.value)
													}
												>
													{val.value.type === "task"
														? `${val.value.actionName ?? ""} ${val.value.name} `
														: val.value.name}
													{val.value.assetName && val.value.type === "task" ? (
														<span style={{ fontStyle: "italic" }}>
															({val.value.assetName})
														</span>
													) : null}
												</div>
											</div>

											<div className="row__main">
												<div
													{...provided2.dragHandleProps}
													style={{
														opacity:
															!isDragDisabled && val.value.isDraggable ? 1 : 0,
														marginLeft: "10px",
													}}
												>
													<img
														src={reorder}
														alt="icon"
														style={{ width: "18px", height: "18px" }}
													/>
												</div>
											</div>
										</div>
									</>
								)}
							</Draggable>
							{isMore[val.value.id]?.show && !val.value.hideTaskQuestions ? (
								<DynamicRow
									rowData={val.children}
									isChild={val?.children?.value?.length}
									isDragDisabled={isDragDisabled}
									isLastDroppable={i === rowData.value.length - 1}
									firstRender={firstRender}
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
