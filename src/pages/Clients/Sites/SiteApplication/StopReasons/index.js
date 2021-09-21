import { connect } from "react-redux";
import React, { useState } from "react";
import StopsContent from "./StopsContent";
import { useParams } from "react-router-dom";
import { showError } from "redux/common/actions";

function StopsReasons({ getError }) {
	// Init params
	const { id } = useParams();

	// Init state
	const [is404, setIs404] = useState(false);

	// Rendering pauses content with Navbar. Otherwise, 404 error
	if (is404 === false) {
		return <StopsContent id={id} setIs404={setIs404} getError={getError} />;
	} else {
		return <p>404: Application id {id} does not exist.</p>;
	}
}

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(StopsReasons);
