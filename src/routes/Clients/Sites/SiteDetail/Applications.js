import React, { useState, useEffect } from "react";
import AccordionBox from "components/AccordionBox";
import ApplicationTable from "components/ApplicationTable";
import ConfirmChangeDialog from "components/ConfirmChangeDialog";
import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import AddSiteApplicationModal from "components/AddSiteApplicationModal";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import "./siteDetail.css";
import {
	getSiteApplications,
	updateSiteApplicationStatus,
} from "services/clients/sites/siteDetails";

const Applications = ({
	siteId,
	listOfSiteAppId,
	setError,
	fetchKeyContactsList,
	isLoading,
	setIsLoading,
}) => {
	const [applicationList, setApplicationList] = useState([]);
	const [openChangeConfirmDialog, setOpenChangeConfirmDialog] = useState(false);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
	const [applicationToChange, setApplicationToChanged] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	// open and close confirm change dialog
	const onOpenChangeConfirmDialog = (id) => {
		setApplicationToChanged(applicationList.find((app) => app.id === id));
		setOpenChangeConfirmDialog(true);
	};

	const onCloseChangeConfirmDialog = () => {
		setOpenChangeConfirmDialog(false);
	};

	// open and close delete confirm dialog
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

	const onConfirmChange = async () => {
		setIsUpdating(true);

		const response = await updateSiteApplicationStatus(applicationToChange);

		if (response.status) {
			await fetchApplicationList();
			setIsUpdating(false);
			setOpenChangeConfirmDialog(false);
		} else {
			setIsUpdating(false);
			setOpenChangeConfirmDialog(false);
			setError(response.data.detail);
		}
	};

	const fetchApplicationList = async () => {
		const result = await getSiteApplications(siteId);

		if (result.status) {
			setApplicationList(
				result.data.map((data, index) => ({
					id: listOfSiteAppId[index]?.siteAppId,
					name: data.name,
					isActive: data.isActive,
				}))
			);
		}

		setIsLoading(false);
	};

	useEffect(() => {
		if (listOfSiteAppId.length > 0) {
			fetchApplicationList();
		}
	}, [listOfSiteAppId]);

	return (
		<>
			<ConfirmChangeDialog
				open={openChangeConfirmDialog}
				isUpdating={isUpdating}
				closeHandler={onCloseChangeConfirmDialog}
				handleChangeConfirm={onConfirmChange}
			/>
			{/* <DeleteDialog
				entityName="Application"
				open={openDeleteConfirm}
				closeHandler={onCloseDeleteConfirmDialog}
			/> */}
			<AddSiteApplicationModal
				open={openModal}
				handleClose={onCloseAddSiteApplicationModal}
				siteId={siteId}
				fetchKeyContactsList={fetchKeyContactsList}
			/>
			<AccordionBox
				title="Applications"
				isActionsPresent={true}
				buttonName="Add Application"
				buttonAction={onOpenAddSiteApplicationModal}
				// accordianDetailsCss="table-container"
				accordianDetailsCss="siteDetailTableContainer"
			>
				<ApplicationTable
					data={applicationList}
					isLoading={isLoading}
					showDeleteIcon={false}
					showQuantity={false}
					onDeleteApp={onOpenDeleteConfirmDialog}
					onChangeApp={onOpenChangeConfirmDialog}
				/>
			</AccordionBox>
		</>
	);
};

const mapStateToProps = ({ commonData: { error } }) => ({ error });

const mapDispatchToProps = (dispatch) => ({
	setError: (message) => dispatch(showError(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Applications);
