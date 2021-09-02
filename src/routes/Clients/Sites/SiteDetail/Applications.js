import React, { useState, useEffect } from "react";
import AccordionBox from "components/AccordionBox";
import ApplicationTable from "components/ApplicationTable";
import { BASE_API_PATH } from "helpers/constants";
import API from "helpers/api";
import ConfirmChangeDialog from "components/ConfirmChangeDialog";
import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import AddSiteApplicationModal from "components/AddSiteApplicationModal";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";

const Applications = ({
	siteId,
	listOfSiteAppId,
	setError,
	fetchKeyContactsList,
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
		try {
			const response = await API.patch(
				`${BASE_API_PATH}SiteApps/${applicationToChange.id}`,
				[
					{
						op: "replace",
						path: "isActive",
						value: !applicationToChange.isActive,
					},
				]
			);

			if (response.status === 404 || response.status === 400) {
				throw new Error(response);
			}
			fetchApplicationList();
			fetchKeyContactsList();
		} catch (error) {
			if (Object.keys(error.response.data.errors).length !== 0) {
				setError(error.response.data.errors.name);
			} else if (error.response.data.detail !== undefined) {
				setError(error.response.data.detail);
			} else {
				setError("Something went wrong!");
			}
			setIsUpdating(false);
			setOpenChangeConfirmDialog(false);
		}
	};

	const fetchApplicationList = async () => {
		try {
			const result = await API.get(`${BASE_API_PATH}siteapps?siteid=${siteId}`);

			setApplicationList(
				result.data.map((data, index) => ({
					id: listOfSiteAppId[index]?.siteAppId,
					name: data.name,
					isActive: data.isActive,
				}))
			);

			if (!isUpdating) {
				setIsUpdating(false);
				setOpenChangeConfirmDialog(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchApplicationList();
	}, [listOfSiteAppId]);

	return (
		<>
			<ConfirmChangeDialog
				open={openChangeConfirmDialog}
				isUpdating={isUpdating}
				closeHandler={onCloseChangeConfirmDialog}
				handleChangeConfirm={onConfirmChange}
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
