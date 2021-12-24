import React from "react";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import UsersListContent from "./UsersListContent";

const UsersList = ({ getError, ...rest }) => {
	return <UsersListContent getError={getError} {...rest} />;
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(UsersList);
