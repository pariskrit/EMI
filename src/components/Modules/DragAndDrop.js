import React from "react";
import PropTypes from "prop-types";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Table } from "@material-ui/core";

const DragAndDrop = ({
	handleDragEnd,
	header,
	WrapComponent,
	droppableId,
	RowComponent,
	data,
	columns,
}) => {
	const Drop = WrapComponent;
	const Row = RowComponent;
	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Table aria-label="Table">
				{header}
				<Droppable droppableId={droppableId}>
					{(parent) => (
						<Drop ref={parent.innerRef} {...parent.droppableProps}>
							{data.map((row, index) => (
								<Draggable key={row.id} draggableId={row.id + ""} index={index}>
									{(child) => (
										<Row
											key={index}
											{...child.draggableProps}
											ref={child.innerRef}
											handleDrag={child.dragHandleProps}
										>
											{columns.map((c) => row[c])}
										</Row>
									)}
								</Draggable>
							))}
						</Drop>
					)}
				</Droppable>
			</Table>
		</DragDropContext>
	);
};

DragAndDrop.propTypes = {
	handleDragEnd: PropTypes.func.isRequired,
	data: PropTypes.array.isRequired,
	header: PropTypes.element,
	droppableId: PropTypes.string,
	columns: PropTypes.arrayOf(PropTypes.string),
};

DragAndDrop.defaultProps = {
	droppableId: "droppable-item",
};

export default DragAndDrop;
