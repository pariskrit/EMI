import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import reorder from "assets/reorder.png";
import "./style.css";

const style = {
	color: "#307ad7",
};
function DynamicRow({ rowData, isChild = false, onTaskClick }) {
	const [isMore, setIsMore] = useState({});

	const showChildren = (id) => {
		if (isMore[id]?.show) {
			setIsMore({ ...isMore, [id]: { show: false } });
			return;
		}
		setIsMore({ ...isMore, [id]: { show: true } });
	};
	useEffect(() => {
		const taskElement = document.getElementById(
			`highlightedTask_${rowData.parentId}`
		);

		if (taskElement) {
			taskElement.scrollIntoView({ behavior: "smooth", block: "center" });
		}
		if (rowData.expandedId) {
			console.log("expanded");
			setIsMore({ [rowData.expandedId]: { show: true } });
		}
	}, [rowData]);
	return (
		<Droppable
			droppableId={
				rowData?.parentId
					? `droppable_${rowData?.name}_${rowData.parentId}`
					: `droppable_${rowData?.name}`
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
								isDragDisabled={!val.value.isDraggable}
							>
								{(provided2, snapshot) => (
									<>
										{i === rowData.value.length - 1 &&
										rowData.value.length !== 1 ? (
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
														}}
													></span>
												) : null}
												<div className="row__questions__icon">
													{/* {<val.value.Icon />} */}
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
															? `highlightedTask_${rowData.parentId}`
															: ""
													}
													className={`row__questions__item ${
														val.value.type === "task" ? "cursor link" : ""
													} ${
														val.value.highlightTask ||
														val.value.highlightQuestion ||
														val.value.highlightTaskQuestion
															? "highlight"
															: ""
													}`}
													onClick={
														val.value.type === "task"
															? () => onTaskClick(val.value.modelVersionTaskID)
															: () => {}
													}
												>
													{val.value.type === "task"
														? `${val.value.actionName} / ${val.value.name}`
														: val.value.name}
												</div>
											</div>

											<div className="row__main">
												{val.value.type === "task" ? val.value.assetName : null}
												<div
													{...provided2.dragHandleProps}
													style={{
														opacity: val.value.isDraggable ? 1 : 0,
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
							{isMore[val.value.id]?.show ? (
								<DynamicRow
									rowData={val.children}
									isChild={val?.children?.value?.length}
									onTaskClick={onTaskClick}
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
