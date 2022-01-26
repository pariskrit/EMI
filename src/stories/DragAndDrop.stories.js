import React from "react";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import { storiesOf } from "@storybook/react";

storiesOf("components/DragAndDropTable", module).add("controlled", () => {
	function Parent({ children }) {
		const [data, setData] = React.useState([
			{
				id: 1,
				firstName: "Mathew",
				lastName: "Oven",
				email: "rr@gmail.com",
				phone: "34885",
			},
			{
				id: 2,
				firstName: "Charlie",
				lastName: "Chaplin",
				email: "ssr@gmail.com",
				phone: "646546",
			},
		]);
		return <div>{children(data, setData)}</div>;
	}
	return (
		<Parent>
			{(data, setData) => (
				<DragAndDropTable
					data={data}
					headers={["First Name", "Last Name", "Email", "Phone"]}
					columns={["firstName", "lastName", "email", "phone"]}
					handleDragEnd={(result) => {
						const items = Array.from(data);
						const [reorderedItem] = items.splice(result.source.index, 1);
						items.splice(result.destination.index, 0, reorderedItem);
						setData(items);
					}}
				/>
			)}
		</Parent>
	);
});
