import React from "react";
import Feedback from "pages/Feedback";
import FeedbackList from "pages/Feedback/FeedbackList";
import { Route, Routes } from "react-router-dom";
import FeedbackDetails from "../FeedbackDetails";
import AccessRoute from "components/HOC/AccessRoute";
import access from "helpers/access";

const FeedbackPage = () => {
	return (
		<Feedback>
			<Routes>
				<Route element={<AccessRoute access={access.feedbackAccess} />}>
					<Route index element={<FeedbackList />} />
					<Route path={":id"} element={<FeedbackDetails />} />
				</Route>
			</Routes>
		</Feedback>
	);
};

export default FeedbackPage;
