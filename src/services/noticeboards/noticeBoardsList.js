import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";
import { defaultPageSize } from "helpers/utils";

export const getNoticeBoardsList = async ({
	siteAppId,
	pageNumber = "1",
	pageSize = defaultPageSize(),
	search = "",
	sortField = "",
	sortOrder = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.NoticeBoards}?siteAppId=${siteAppId}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getCountOfNoticeBoardsList = async ({
	siteAppId,
	search = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.NoticeBoards}/count?siteAppId=${siteAppId}&search=${search}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const postNewNoticeBoards = async (payload) => {
	try {
		let response = await API.post(`${Apis.NoticeBoards}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const postNewNoticeBoardsFile = async (payload) => {
	try {
		let response = await API.post(`${Apis.NoticeBoards}/upload`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const patchNoticeBoard = async (id, payload) => {
	try {
		let response = await API.patch(`${Apis.NoticeBoards}/${id}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
