import React from "react";
import CommonHeader from "components/Modules/CommonHeader";
import NavButtons from "components/Elements/NavButtons";
import { getLocalStorageData } from "helpers/utils";
import roles from "helpers/roles";

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
	const { role, position } = getLocalStorageData("me") || {};

	const FullSettingAccess = position?.settingsAccess === "F";

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
					FullSettingAccess,
				}}
			/>
			{/* && role !== roles.clientAdmin */}

			{role !== roles.superAdmin && (
				<NavButtons
					role={role}
					navigation={navigation}
					applicationName={applicationName}
					current={current}
				/>
			)}
		</>
	);
};

export default CommonHeaderWrapper;
