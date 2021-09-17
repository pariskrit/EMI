import React from "react";
import CommonHeader from "../CommonHeader";
import NavButtons from "components/Modules/NavButtons";
import applicationNavigation from "helpers/applicationNavigation";

const CommonHeaderWrapper = ({
	status,
	lastSaved,
	onClickAdd,
	onClickSave,
	onDuplicate,
	onImport,
	showAdd,
	showDuplicate,
	showHistory,
	showSave,
	showSwitch,
	showImport,
	crumbs,
	isUpdating,
	currentStatus,
	handlePatchIsActive,
	navigation,
	data,
	current,
}) => {
	return (
		<>
			<CommonHeader
				{...{
					status,
					lastSaved,
					onClickAdd,
					onClickSave,
					onDuplicate,
					onImport,
					showAdd,
					showDuplicate,
					showHistory,
					showSave,
					showSwitch,
					showImport,
					crumbs,
					isUpdating,
					currentStatus,
					handlePatchIsActive,
				}}
			/>

			<NavButtons
				navigation={navigation}
				applicationName={data.name}
				current={current}
			/>
		</>
	);
};

export default CommonHeaderWrapper;
