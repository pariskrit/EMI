import React from "react";
import AddSiteLocationsDialog from "routes/Clients/Sites/SiteLocations/SiteLocations/AddSiteLocationsDialog";

export default {
	title: "Components/AddSiteLocation",
	component: AddSiteLocationsDialog,
};

const Template = (args) => <AddSiteLocationsDialog {...args} />;

export const AddModal = Template.bind({});

AddModal.args = {
	open: true,
};
