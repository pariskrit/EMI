import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { FeedbackDetailsPath, feedbackPath } from "helpers/routePaths";
import access from "helpers/access";
import Feedback from "..";
import FeedbackList from "../FeedbackList";
import FeedbackDetailPage from "../FeedbackDetails";

const FeedbackPage = () => {
	return (
		<Feedback>
			<AccessRoute
				path={feedbackPath}
				exact
				component={FeedbackList}
				access={access.feedbackAccess}
			/>
			<AccessRoute
				path={FeedbackDetailsPath}
				component={FeedbackDetailPage}
				access={access.feedbackAccess}
			/>
		</Feedback>
	);
};

export default FeedbackPage;
