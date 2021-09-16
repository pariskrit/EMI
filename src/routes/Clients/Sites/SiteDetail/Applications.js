import React, { useState, useEffect, useRef } from "react";
import AccordionBox from "components/Elements/AccordionBox";
import ApplicationTable from "components/Modules/ApplicationTable";
import ConfirmChangeDialog from "components/ConfirmChangeDialog";
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
	setError,
	fetchKeyContactsList,
	isLoading,
	setIsLoading,
}) => {
	const [applicationList, setApplicationList] = useState([]);
	const [openChangeConfirmDialog, setOpenChangeConfirmDialog] = useState(false);
	const [applicationToChange, setApplicationToChanged] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const cancelFetch = useRef(false);

	// open and close confirm change dialog
	const onOpenChangeConfirmDialog = (id) => {
		setApplicationToChanged(applicationList.find((app) => app.id === id));
		setOpenChangeConfirmDialog(true);
	};

	const onCloseChangeConfirmDialog = () => {
		setOpenChangeConfirmDialog(false);
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

		if (cancelFetch.current) {
			return;
		}

		if (result.status) {
			setApplicationList(
				result.data.map((data) => ({
					id: data.id,
					name: data.name,
					isActive: data.isActive,
				}))
			);
		}

		setIsLoading(false);
	};

	useEffect(() => {
		fetchApplicationList();

		return () => {
			cancelFetch.current = true;
		};
	}, []);

	return (
		<>
			<ConfirmChangeDialog
				open={openChangeConfirmDialog}
				isUpdating={isUpdating}
				closeHandler={onCloseChangeConfirmDialog}
				handleChangeConfirm={onConfirmChange}
			/>

			<AddSiteApplicationModal
				open={openModal}
				handleClose={onCloseAddSiteApplicationModal}
				siteId={siteId}
				fetchKeyContactsList={fetchKeyContactsList}
				fetchApplicationList={fetchApplicationList}
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
