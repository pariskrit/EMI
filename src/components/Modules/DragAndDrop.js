import React from "react";
import PropTypes from "prop-types";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const DragAndDrop = ({
	data,
	handleDragEnd,
	tableHead,
	droppableId,
	tableColumns,
	tableStyle,
	bodyStyle,
	rowStyle,
}) => {
	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<table style={tableStyle}>
				{tableHead}
				<Droppable droppableId={droppableId}>
					{(parent) => (
						<tbody
							ref={parent.innerRef}
							{...parent.droppableProps}
							tableBodyStyle={bodyStyle}
						>
							{data.map((row, index) => (
								<Draggable key={row.id} draggableId={row.id + ""} index={index}>
									{(child) => (
										<tr
											key={index}
											{...child.draggableProps}
											ref={child.innerRef}
											rowStyle={rowStyle}
										>
											{tableColumns(row, index)}
										</tr>
									)}
								</Draggable>
							))}
						</tbody>
					)}
				</Droppable>
			</table>
		</DragDropContext>
	);
};

DragAndDrop.propTypes = {
	data: PropTypes.array.isRequired,
	handleDragEnd: PropTypes.func.isRequired,
	droppableId: PropTypes.string,
	tableHead: PropTypes.element.isRequired,
	tableColumns: PropTypes.func.isRequired,
	tableStyle: PropTypes.object,
	bodyStyle: PropTypes.object,
	rowStyle: PropTypes.object,
};

DragAndDrop.defaultProps = {
	droppableId: "dnd-id",
	tableStyle: {},
	bodyStyle: {},
	rowStyle: {},
};

export default DragAndDrop;
