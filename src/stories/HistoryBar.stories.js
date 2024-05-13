import React from "react";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { historyData } from "constants/Analytics";

export default {
	title: "Components/HistoryBar",
	component: HistoryBar,
};

const Template = (args) => <HistoryBar {...args} />;

export const HistoryDrawer = Template.bind({});

HistoryDrawer.args = {
	id: 337,
	showhistorybar: true,
	dispatch: () => {},
	fetchdata: (id, pageNumber, pageSize) => {
		return Promise.resolve({ data: historyData, status: true });
	},
	OnAddItemClick: () => {},
};
