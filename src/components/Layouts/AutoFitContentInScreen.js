import useAutoHeightForContent from "hooks/useAutoHeightForContent";
import useScreenSize from "hooks/useScreenSize";
import React, { useContext, useEffect, useState } from "react";
import { NavbarStateContext } from "./NavbarWrapper";
import screenSizeForTable from "helpers/screenSizeForTable";
function AutoFitContentInScreen({
	children,
	loading = false,
	containsTable = false,
	removeBorder = false,
}) {
	//to fit the screen when chips are added/chip-filters
	const [dynamicTableHeight, setDynamicTableHeight] = useState(0);
	const { tableHeight } = useAutoHeightForContent(loading);
	//for overflow
	const { navBarState } = useContext(NavbarStateContext);
	const screenSize = useScreenSize(loading);
	const autoFitContainerStyle = screenSizeForTable(
		dynamicTableHeight,
		containsTable,
		navBarState,
		screenSize
	);

	useEffect(() => {
		setDynamicTableHeight(tableHeight);
	}, [loading, tableHeight]);

	return (
		<div
			className={
				removeBorder
					? "table-scroll-wrapper remove-border"
					: containsTable
					? "table-scroll-wrapper"
					: "common-scroll-wrapper"
			}
			id="table-scroll-wrapper-container"
			style={autoFitContainerStyle}
		>
			{children}
		</div>
	);
}

export default AutoFitContentInScreen;
