import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import access from "helpers/access";
import NoticeBoards from "pages/Noticeboards";
import NoticeBoardsList from "pages/Noticeboards/NoticeBoardsList";
import { Route, Routes } from "react-router-dom";

const NoticeBoardsPage = () => {
	return (
		<NoticeBoards>
			<Routes>
				<Route element={<AccessRoute access={access.noticeboardAccess} />}>
					<Route index element={<NoticeBoardsList />} />
				</Route>
			</Routes>
		</NoticeBoards>
	);
};

export default NoticeBoardsPage;
