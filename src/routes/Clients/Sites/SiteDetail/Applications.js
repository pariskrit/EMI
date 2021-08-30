import React, { useState, useEffect } from "react";
import AccordionBox from "components/AccordionBox";
import ApplicationTable from "components/ApplicationTable";
import { BASE_API_PATH } from "helpers/constants";
import API from "helpers/api";
import ConfirmChangeDialog from "components/ConfirmChangeDialog";
import DeleteDialog from "components/DeleteDialog/DeleteDialog";

const Applications = ({ siteId }) => {
	const [applicationList, setApplicationList] = useState([]);
	const [openChangeStatusConfirm, setChangeStatusConfirm] = useState(false);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

	const fetchApplicationList = async () => {
		try {
			const result = await API.get(`${BASE_API_PATH}siteapps?siteid=${siteId}`);

			console.log(result);
		} catch (error) {
			console.log(error);
		}
	};

	const openChangeStatusConfirmDialog = (id) => {
		setChangeStatusConfirm(true);
	};

	const onCloseChangeStatusConfirmDialog = () => {
		setChangeStatusConfirm(false);
	};

	const openDeleteConfirmDialog = (id) => {
		setOpenDeleteConfirm(true);
	};

	const onCloseDeleteConfirmDialog = () => {
		setOpenDeleteConfirm(false);
	};

	useEffect(() => {
		fetchApplicationList();
	}, []);

	return (
		<>
			<ConfirmChangeDialog
				open={openChangeStatusConfirm}
				closeHandler={onCloseChangeStatusConfirmDialog}
			/>
			<DeleteDialog
				entityName="Application"
				open={openDeleteConfirm}
				closeHandler={onCloseDeleteConfirmDialog}
			/>
			<AccordionBox title="Applications">
				<ApplicationTable
					onDeleteApp={openDeleteConfirmDialog}
					onChangeApp={openChangeStatusConfirmDialog}
				/>
			</AccordionBox>
		</>
	);
};

export default Applications;
