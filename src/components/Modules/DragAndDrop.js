import React from "react";
import PropTypes from "prop-types";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const DragAndDrop = ({
	data,
	handleDragEnd,
	header,
	tableColumns,
	droppableId,
	tableStyle,
	bodyStyle,
	rowStyle,
}) => {
	return (
		<div>
			<DragDropContext onDragEnd={handleDragEnd}>
				<table style={tableStyle}>
					{header()}
					<Droppable droppableId={droppableId}>
						{(provider) => (
							<tbody
								className="text-capitalize"
								ref={provider.innerRef}
								{...provider.droppableProps}
								style={bodyStyle}
							>
								{data.map((user, index) => (
									<Draggable
										key={user.id}
										draggableId={user.id + ""}
										index={index}
									>
										{(provider) => (
											<tr
												style={rowStyle}
												{...provider.draggableProps}
												ref={provider.innerRef}
											>
												{tableColumns(
													user,
													index,
													provider.dragHandleProps,
													provider.innerRef
												)}
											</tr>
										)}
									</Draggable>
								))}
								{provider.placeholder}
							</tbody>
						)}
					</Droppable>
				</table>
			</DragDropContext>
		</div>
	);
};

DragAndDrop.propTypes = {
	data: PropTypes.array.isRequired,
	handleDragEnd: PropTypes.func.isRequired,
	droppableId: PropTypes.string,
	header: PropTypes.func.isRequired,
	tableStyle: PropTypes.object,
	bodyStyle: PropTypes.object,
	rowStyle: PropTypes.object,
};

DragAndDrop.defaultProps = {
	droppableId: "droppable-2",
	tableStyle: {},
	bodyStyle: {},
	rowStyle: {},
	dragStyle: {},
};

export default DragAndDrop;
