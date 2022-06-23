import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { noticeboardPath } from "helpers/routePaths";
import access from "helpers/access";
import NoticeBoards from "..";
import NoticeBoardsList from "../NoticeBoardsList";

const NoticeBoardsPage = () => {
	return (
		<NoticeBoards>
			<AccessRoute
				path={noticeboardPath}
				exact
				component={NoticeBoardsList}
				access={access.noticeboardAccess}
			/>
		</NoticeBoards>
	);
};

export default NoticeBoardsPage;
