import { connect } from "react-redux";
import React, { useState } from "react";
import CommonComponent from "./CommonComponent";
import { useParams } from "react-router-dom";
import { showError } from "redux/common/actions";

function SingleColumnTableCommonComponent({
	state,
	dispatch,
	getError,
	header,
	apis,
}) {
	// Init params
	const { appId } = useParams();

	const param = useParams();

	// Init state
	const [is404, setIs404] = useState(false);

	// Rendering pauses content with Navbar. Otherwise, 404 error
	if (is404 === false) {
		return (
			<CommonComponent
				id={appId}
				setIs404={setIs404}
				getError={getError}
				{...{ header, apis, state, dispatch }}
			/>
		);
	} else {
		return <p>404: Application id {appId} does not exist.</p>;
	}
}

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(
	null,
	mapDispatchToProps
)(SingleColumnTableCommonComponent);
