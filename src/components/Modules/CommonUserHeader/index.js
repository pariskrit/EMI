import React from "react";
import CommonHeader from "./CommonHeader";
import NavButtons from "components/Elements/NavButtons";

const CommonUserHeader = ({
	status,
	lastSaved,
	onClickAdd,
	onClickSave,
	onDuplicate,
	onImport,
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
	current,
	showPasswordReset,
	onPasswordReset,
	apis,
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
					showDuplicate,
					showHistory,
					showSave,
					showSwitch,
					showImport,
					crumbs,
					isUpdating,
					currentStatus,
					handlePatchIsActive,
					showPasswordReset,
					onPasswordReset,
				}}
			/>

			<NavButtons
				navigation={navigation}
				current={current}
			/>
		</>
	);
};

export default CommonUserHeader;
