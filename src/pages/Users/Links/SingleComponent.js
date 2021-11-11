import React from "react";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import UserNavigation from "constants/navigation/userNavigation";
import CommonUserHeader from "components/Modules/CommonUserHeader";

const SingleComponent = (route, { getError }) => {
	const navigation = UserNavigation();

	return (
		<>
			<div className="container">
				<CommonUserHeader
					navigation={navigation}
					current={route.name}
					showSwitch={route.showSwitch}
					showHistory={route.showHistory}
					showSave={route.showSave}
					showPasswordReset={route.showPasswordReset}
				/>
				{
					<route.component
						title={route.title}
						apis={route.api}
						getError={getError}
					/>
				}
			</div>
		</>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(SingleComponent);
