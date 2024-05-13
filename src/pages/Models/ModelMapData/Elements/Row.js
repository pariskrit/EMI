import React, { useState, useEffect } from "react";
import { CircularProgress, TableCell, TableRow } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import CurveButton from "components/Elements/CurveButton";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import API from "helpers/api";
import AddDialog from "./AddDialog";
import ColourConstants from "helpers/colourConstants";
import DeleteDialog from "./DeleteDialog";
import AccessWrapper from "components/Modules/AccessWrapper";

const successColor = "#24BA78";
const errorColor = "#E21313";
const useStyles = makeStyles()((theme) => ({
	error: {
		color: errorColor,
	},
	success: {
		color: successColor,
	},
	resolveStyle: {
		display: "flex",
		alignItems: "center",
		gap: 10,
	},
	textBox: {
		padding: 15,
		border: "0.9px solid #b9b9b9",
		borderRadius: "6px",
		display: "flex",
		justifyContent: "space-between",
	},
	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
		verticalAlign: "middle",
	},
}));

const Row = ({
	dropDown,
	x,
	setErrorResolve,
	patchApi,
	elementID,
	disableInput,
	access,
}) => {
	const { textBox, deleteIcon, cx, classes } = useStyles();
	const [selectedValue, setSelectedValue] = useState({});
	const [addNew, setAddNew] = useState({ open: false, text: "" });
	const [confirmDelete, setDeleteConfirm] = useState(false);
	const [isUpdating, setUpdating] = useState(false);

	useEffect(() => {
		const selectedData = dropDown.find((y) => y.id === x[elementID]);
		setSelectedValue(selectedData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dropDown]);

	const patchData = (value = null, name = null) => {
		const path = name || "newName";

		setUpdating(true);
		API.patch(patchApi + "/" + x.id, [{ op: "replace", path, value }])
			.then((res) => {
				setErrorResolve(res.data);
				closeHandler();
			})
			.catch((err) => {
				return err.response;
			});
	};

	const handleChange = (value) => {
		patchData(value?.id, elementID);
		setSelectedValue(value);
	};

	const closeHandler = () => {
		setUpdating(false);
		setDeleteConfirm(false);
		setAddNew({ open: false, text: "" });
	};

	return (
		<>
			<DeleteDialog
				confirmDelete={confirmDelete}
				isUpdating={isUpdating}
				handleDeleteConfirm={patchData}
				closeHandler={closeHandler}
			/>
			<AddDialog
				id={x.id}
				setAddNew={setAddNew}
				addComplete={patchData}
				addNew={addNew}
				isUpdating={isUpdating}
			/>
			<TableRow>
				<TableCell>{x.name}</TableCell>
				<TableCell>
					{/* <Dropdown
						options={dropDown}
						selectedValue={selectedValue}
						onChange={handleChange}
						label=""
						required={true}
						width="100%"
						disabled={x.newName !== null || disableInput}
					/>  */}

					<DyanamicDropdown
						dataSource={dropDown}
						width="100%"
						selectedValue={selectedValue}
						onChange={handleChange}
						selectdValueToshow="label"
						disabled={x.newName !== null || disableInput}
						columns={[{ name: "label", id: 1 }]}
						showClear={elementID === "roleID"}
					/>
				</TableCell>
				<TableCell>
					{x.newName !== null ? (
						<span className={textBox}>
							<span>{x.newName}</span>
							{!disableInput && (
								<DeleteIcon
									className={deleteIcon}
									onClick={() => setDeleteConfirm(true)}
								/>
							)}
						</span>
					) : (
						<AccessWrapper access={access} accessList={["E"]}>
							<CurveButton
								style={{ float: "left", background: "#307AD6" }}
								onClick={() => setAddNew({ open: true, text: x.name })}
							>
								Add New
							</CurveButton>
						</AccessWrapper>
					)}
				</TableCell>

				<TableCell>
					{isUpdating ? (
						<CircularProgress style={{ height: 20, width: 20 }} />
					) : (
						<span
							className={cx(
								classes.resolveStyle,
								{
									[classes.error]: x.newName === null || x[elementID] === null,
								},
								{
									[classes.success]:
										x.newName !== null || x[elementID] !== null,
								}
							)}
						>
							{x.newName !== null || x[elementID] !== null ? (
								<>
									<CheckCircleIcon />
									<span>Yes</span>
								</>
							) : (
								<>
									<ErrorOutlinedIcon />
									<span>No</span>
								</>
							)}
						</span>
					)}
				</TableCell>
			</TableRow>
		</>
	);
};

export default Row;
