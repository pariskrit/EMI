import { connect } from "react-redux";
import React, { useState } from "react";
import { showError } from "redux/common/actions";
import DefectRiskRatingsContent from "./DefectRiskRatingsContent.js";

const DefectRiskRatings = ({ state, dispatch, appId, getError }) => {
	//Init state
	const [is404, setIs404] = useState(false);

	if (is404 === false) {
		return (
			<DefectRiskRatingsContent
				id={appId}
				setIs404={setIs404}
				state={state}
				dispatch={dispatch}
				getError={getError}
			/>
		);
	} else {
		return <p>404: Application id {appId} does not exist.</p>;
	}
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(DefectRiskRatings);
