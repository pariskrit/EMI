import React from "react";
import CommonHeader from "../CommonHeader";
import NavButtons from "components/Elements/NavButtons";

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
	applicationName,
	current,
}) => {
	console.log("last saved", lastSaved);
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
				applicationName={applicationName}
				current={current}
			/>
		</>
	);
};

export default CommonHeaderWrapper;
