import { connect } from "react-redux";
import React, { useState } from "react";
import { showError } from "redux/common/actions";
import UserRolesContent from "./UserRolesContent";

const UserRoles = ({ getError, state, dispatch, appId }) => {
	//Init state
	const [is404, setIs404] = useState(false);

	if (is404 === false) {
		return (
			<UserRolesContent
				id={appId}
				setIs404={setIs404}
				getError={getError}
				state={state}
				dispatch={dispatch}
			/>
		);
	} else {
		return <p>404: Application id {appId} does not exist. </p>;
	}
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(UserRoles);
