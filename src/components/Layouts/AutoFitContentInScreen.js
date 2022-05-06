import useAutoHeightForContent from "hooks/useAutoHeightForContent";
import React from "react";

function AutoFitContentInScreen({ children, loading, containsTable = false }) {
	const { tableHeight } = useAutoHeightForContent(loading);
	return (
		<div
			className={
				containsTable ? "table-scroll-wrapper" : "common-scroll-wrapper"
			}
			id="table-scroll-wrapper-container"
			style={{ maxHeight: tableHeight + "px" }}
		>
			{children}
		</div>
	);
}

export default AutoFitContentInScreen;
