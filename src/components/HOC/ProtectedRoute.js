import React from "react";
import { connect } from "react-redux";

const ProtectedRoute = ({ element, roles, userDetail }) => {
	return <div></div>;
};

const mapStateToProps = ({ authData: { userDetail } }) => ({ userDetail });

export default connect(mapStateToProps)(ProtectedRoute);
