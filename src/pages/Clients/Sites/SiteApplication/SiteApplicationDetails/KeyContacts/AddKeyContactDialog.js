import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { DefaultPageSize } from "helpers/constants";
import {
	debounce,
	generateErrorState,
	handleSort,
	handleValidateObj,
} from "helpers/utils";
import React, { useCallback, useEffect, useState } from "react";
import {
	getClientUserSiteAppList,
	getClientUserSiteAppListCount,
} from "services/users/userDetails";
import AddDialogStyle from "styles/application/AddDialogStyle";
import * as yup from "yup";

const schema = yup.object({
	userID: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { userID: "" };
const defaultError = { userID: null };

const useStyles = makeStyles({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
	},
	createButton: {
		width: "auto",
	},
});

const AddNoteDialog = ({ open, handleClose, createHandler, siteAppId }) => {
	const classes = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [isUpdating, setIsUpdating] = useState(false);
	const [page, setPage] = useState({ pageNo: 1, pageSize: DefaultPageSize });
	const [contactUsers, setContactUsers] = useState([]);
	const [count, setCount] = useState(0);

	const closeOverride = () => {
		setInput(defaultData);
		setErrors(defaultError);
		setPage({ pageNo: 1, pageSize: DefaultPageSize });
		setContactUsers([]);
		setCount(0);
		handleClose();
	};

	const handleCreateProcess = async () => {
		setIsUpdating(true);

		try {
			const localChecker = await handleValidateObj(schema, {
				userID: input?.userID?.id,
			});
			if (!localChecker.some((el) => el.valid === false)) {
				await createHandler(input.userID?.id);

				closeOverride();
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
			}

			setIsUpdating(false);
		} catch (err) {
			setIsUpdating(false);
			closeOverride();
		}
	};

	const fetchClientUserSiteAppsCount = async (search) => {
		const response = await getClientUserSiteAppListCount({ siteAppId, search });
		if (response.status) {
			setCount(response.data);
		}
	};

	useEffect(() => {
		if (open) {
			Promise.all([
				fetchClientUserSiteApps(page.pageNo, []),
				fetchClientUserSiteAppsCount(""),
			]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	const fetchClientUserSiteApps = async (p, prevData) => {
		const response = await getClientUserSiteAppList({
			siteAppId,
			pageNumber: p,
			pageSize: page.pageSize,
			search: "",
		});
		if (response.status) {
			if (p === 1) {
				setContactUsers([...response.data]);
			} else {
				setContactUsers([...prevData, ...response.data]);
			}
		}
	};

	const pageChange = async (p, prevData) => {
		await fetchClientUserSiteApps(p, prevData);
		setPage({ pageNo: p, pageSize: page.pageSize });
	};

	const handleServerSideSearch = useCallback(
		debounce(async (searchTxt) => {
			if (searchTxt) {
				const response = await getClientUserSiteAppList({
					siteAppId,
					pageNumber: 1,
					pageSize: 100,
					search: searchTxt,
				});
				setContactUsers(response.data);
			} else {
				fetchClientUserSiteApps(1, []);
				setPage((prev) => ({ ...prev, pageNo: 1 }));
			}
		}, 500),
		[]
	);

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			{isUpdating ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					{<ADD.HeaderText>Add Key Contact</ADD.HeaderText>}
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton
						onClick={closeOverride}
						variant="contained"
						style={{ width: "auto" }}
					>
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton
						onClick={handleCreateProcess}
						variant="contained"
						className={classes.createButton}
						disabled={isUpdating}
					>
						Save
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<DialogContent className={classes.dialogContent}>
				<ErrorInputFieldWrapper
					errorMessage={errors.userID === null ? null : errors.userID}
				>
					<DyanamicDropdown
						dataSource={contactUsers}
						isServerSide={true}
						width="100%"
						placeholder="Select User"
						dataHeader={[
							{ id: 1, name: "FirstName" },
							{ id: 2, name: "LastName" },
							{ id: 3, name: "Email" },
						]}
						columns={[
							{ id: 1, name: "firstName" },
							{ id: 2, name: "lastName" },
							{ id: 3, name: "email" },
						]}
						selectedValue={{
							...input["userID"],
							firstName: !input?.userID?.firstName
								? ""
								: !input?.userID?.lastName
								? input?.userID?.firstName
								: input?.userID?.firstName + " " + input?.userID?.lastName,
						}}
						handleSort={handleSort}
						handleServierSideSearch={handleServerSideSearch}
						onChange={(val) => {
							setInput({ ...input, userID: val });
						}}
						selectdValueToshow="firstName"
						label={"Attach User"}
						required
						isError={errors.userID === null ? false : true}
						onPageChange={pageChange}
						page={page.pageNo}
						count={count}
						showHeader
					/>
				</ErrorInputFieldWrapper>
			</DialogContent>
		</Dialog>
	);
};

export default AddNoteDialog;
