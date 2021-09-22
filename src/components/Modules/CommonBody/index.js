import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ContentStyle from "styles/application/ContentStyle";

const AC = ContentStyle();

const CommonBody = ({ haveData, children }) => {
	return (
		<div>
			{haveData ? (
				children
			) : (
				<AC.SpinnerContainer>
					<CircularProgress />
				</AC.SpinnerContainer>
			)}
		</div>
	);
};

export default CommonBody;
