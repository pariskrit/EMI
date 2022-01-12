import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { CircularProgress, TableCell, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";
import Dropdown from "components/Elements/Dropdown";
import CurveButton from "components/Elements/CurveButton";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import API from "helpers/api";
import AddDialog from "./AddDialog";
import ColourConstants from "helpers/colourConstants";
import DeleteDialog from "./DeleteDialog";

const successColor = "#24BA78";
const errorColor = "#E21313";
const useStyles = makeStyles({
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
});

const Row = ({ dropDown, x, setErrorResolve, patchApi, elementID }) => {
	const { success, error, resolveStyle, textBox, deleteIcon } = useStyles();
	const [selectedValue, setSelectedValue] = useState({});
	const [addNew, setAddNew] = useState({ open: false, text: "" });
	const [confirmDelete, setDeleteConfirm] = useState(false);
	const [isUpdating, setUpdating] = useState(false);

	useEffect(() => {
		const selectedData = dropDown.find((y) => y.value === x[elementID]);
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
		patchData(value.value, elementID);
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
				defaultName={x.name}
			/>
			<TableRow>
				<TableCell>{x.name}</TableCell>
				<TableCell>
					<Dropdown
						options={dropDown}
						selectedValue={selectedValue}
						onChange={handleChange}
						label=""
						required={true}
						width="100%"
						disabled={x.newName !== null}
					/>
				</TableCell>
				<TableCell>
					{x.newName !== null ? (
						<span className={textBox}>
							<span>{x.newName}</span>
							<DeleteIcon
								className={deleteIcon}
								onClick={() => setDeleteConfirm(true)}
							/>
						</span>
					) : (
						<CurveButton
							style={{ float: "left", background: "#307AD6" }}
							onClick={() => setAddNew({ open: true, text: x.newName })}
						>
							Add New
						</CurveButton>
					)}
				</TableCell>

				<TableCell>
					{isUpdating ? (
						<CircularProgress style={{ height: 20, width: 20 }} />
					) : (
						<span
							className={clsx(
								resolveStyle,
								{ [error]: x.newName === null || x[elementID] === null },
								{ [success]: x.newName !== null || x[elementID] !== null }
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
