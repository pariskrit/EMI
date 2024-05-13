import React from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import SimpleDataTable from "components/Modules/SimpleDataTable";

const CheckedOutServices = ({ customCaptions, servicesList, isLoading }) => {
	return (
		<AccordionBox
			title={`Checked Out ${customCaptions?.servicePlural}`}
			accordianDetailsCss="siteDetailTableContainer"
		>
			<SimpleDataTable
				isLoading={isLoading}
				data={servicesList}
				tableHeaders={[
					`${customCaptions?.serviceWorkOrder}` || "Work Order",
					`${customCaptions?.model}` || `Model Name`,
					`${customCaptions?.asset}` || `Asset Name`,
					`${customCaptions?.interval}` || `Interval`,
					`${customCaptions?.role}` || `Role`,
					"Checked Out User",
					"Checked Out Time",
				]}
			/>
		</AccordionBox>
	);
};

export default CheckedOutServices;
