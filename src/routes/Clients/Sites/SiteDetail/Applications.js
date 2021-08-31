import React, { useState, useEffect } from "react";
import AccordionBox from "components/AccordionBox";
import ApplicationTable from "components/ApplicationTable";
import { BASE_API_PATH } from "helpers/constants";
import API from "helpers/api";
import ConfirmChangeDialog from "components/ConfirmChangeDialog";
import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import AddSiteApplicationModal from "components/AddSiteApplicationModal";

const Applications = ({ siteId }) => {
	const [applicationList, setApplicationList] = useState([]);
	const [openChangeConfirmDialog, setOpenChangeConfirmDialog] = useState(false);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
	const [isActive, setIsActive] = useState("");
	const [openModal, setOpenModal] = useState(false);

	// open and close confirm change dialog
	const onOpenChangeConfirmDialog = (id) => {
		setOpenChangeConfirmDialog(true);
	};

	const onCloseChangeConfirmDialog = () => {
		setOpenChangeConfirmDialog(false);
	};

	// open and close delete confrim dialog
	const onOpenDeleteConfirmDialog = (id) => {
		setOpenDeleteConfirm(true);
	};

	const onCloseDeleteConfirmDialog = () => {
		setOpenDeleteConfirm(false);
	};

	// open and close add site application modal
	const onOpenAddSiteApplicationModal = () => {
		setOpenModal(true);
	};

	const onCloseAddSiteApplicationModal = () => {
		setOpenModal(false);
	};

	// const onConfirmChange = async () => {

	// 	try {
	// 		const result = await API.get(`${BASE_API_PATH}siteapps?siteid=${siteId}`,[{op:'replace',path:'isActive',value:}]);

	// 		console.log(result);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}

	// }

	const fetchApplicationList = async () => {
		try {
			const result = await API.get(`${BASE_API_PATH}siteapps?siteid=${siteId}`);

			console.log(result);
			setApplicationList(result.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchApplicationList();
	}, []);

	return (
		<>
			<ConfirmChangeDialog
				open={openChangeConfirmDialog}
				closeHandler={onCloseChangeConfirmDialog}
				// handleChangeConfirm={onConfirmChange}
			/>
			<DeleteDialog
				entityName="Application"
				open={openDeleteConfirm}
				closeHandler={onCloseDeleteConfirmDialog}
			/>
			<AddSiteApplicationModal
				open={openModal}
				handleClose={onCloseAddSiteApplicationModal}
				siteId={siteId}
				setApplicationList={setApplicationList}
			/>
			<AccordionBox
				title="Applications"
				isActionsPresent={true}
				buttonName="Add Application"
				buttonAction={onOpenAddSiteApplicationModal}
				accordianDetailsCss="table-container"
			>
				<ApplicationTable
					data={applicationList}
					onDeleteApp={onOpenDeleteConfirmDialog}
					onChangeApp={onOpenChangeConfirmDialog}
				/>
			</AccordionBox>
		</>
	);
};

export default Applications;
