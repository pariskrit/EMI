import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { makeStyles } from "@material-ui/core/styles";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { handleSort } from "helpers/utils";
import { getLubricants } from "services/clients/sites/siteApplications/lubricants";
import { patchModelTask } from "services/models/modelDetails/modelTasks";
import { Facebook } from "react-spinners-css";
import withMount from "components/HOC/withMount";

// Init styled components
const ADD = AddDialogStyle();

const useStyles = makeStyles({
	mainContainer: {
		margin: "20px 0",
	},
	container: {
		display: "flex",
		alignItems: "center",
		gap: "20px",
		marginBottom: "20px",
		width: "100%",
	},
	typo: {
		width: 140,
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: 14,
	},
	inputText: {
		color: "#000000de",
	},
});

const Lubricant = ({ taskInfo, access, isMounted }) => {
	// init hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	const [lubricantsList, setLubricantsList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [localTaskInfo, setLocalTaskInfo] = useState({});
	const [isUpdating, setUpdating] = useState({});

	const {
		position: { siteAppID },
		customCaptions,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	// checking the access of the user to allow or disallow edit add.
	const isReadOnly = access === "R";

	const fetchLubricants = async (id) => {
		!isMounted.aborted && setLoading(true);
		try {
			const response = await getLubricants(id);
			if (response.status) {
				if (!isMounted.aborted) {
					setLubricantsList(response.data);
				}
			} else {
				dispatch(
					showError(
						response?.data?.title ||
							response?.data ||
							"Could not fetch task lubricant"
					)
				);
			}
		} catch (error) {
			dispatch(
				showError(
					error?.response?.data ||
						error?.response ||
						"Could not update task lubricant"
				)
			);
		} finally {
			!isMounted.aborted && setLoading(false);
		}
	};

	useEffect(() => {
		fetchLubricants(siteAppID);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteAppID]);

	useEffect(() => {
		if (taskInfo) setLocalTaskInfo(taskInfo);
	}, [taskInfo]);

	const dropdownHandleChange = async (value, fieldName, name) => {
		setLocalTaskInfo({
			...localTaskInfo,
			[fieldName]: value?.id || null,
			[name]: value?.name || null,
		});
		try {
			const response = await patchModelTask(taskInfo?.id, [
				{ op: "replace", path: fieldName, value: value?.id || null },
			]);
			if (response.status) {
				taskInfo[fieldName] = value?.id || null;
				taskInfo[name] = value?.name || null;
			} else {
				setLocalTaskInfo(taskInfo);
				dispatch(
					showError(response?.data?.detail || "Could not update Lubricant")
				);
			}
		} catch (error) {
			setLocalTaskInfo(taskInfo);
			dispatch(
				showError(error?.response?.data?.title || "Could not update Lubricant")
			);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setLocalTaskInfo({ ...localTaskInfo, [name]: value });
	};

	const handleBlur = async (e) => {
		const { name, value } = e.target;
		if ("" + value === "" + taskInfo[name]) return;

		setUpdating((prev) => ({ ...prev, [name]: true }));
		try {
			const response = await patchModelTask(taskInfo?.id, [
				{
					op: "replace",
					path: name,
					value: value ? value : null,
				},
			]);
			if (response.status) {
				taskInfo[name] = value;
			} else {
				dispatch(
					showError(
						response?.data?.title ||
							response?.data ||
							"Could not update task lubricant"
					)
				);
				setLocalTaskInfo(taskInfo);
			}
		} catch (error) {
			setLocalTaskInfo(taskInfo);
			dispatch(
				showError(
					error?.response?.data ||
						error?.response ||
						"Could not update task lubricant"
				)
			);
		} finally {
			setUpdating((prev) => ({ ...prev, [name]: false }));
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (!isUpdating?.[e.target.name]) {
			if (e.keyCode === 13) {
				handleBlur(e);
			}
		}
	};

	return (
		<div className={classes.mainContainer}>
			<div className={classes.container}>
				<Typography className={classes.typo}>Volume</Typography>
				<ADD.NameInput
					value={localTaskInfo.lubricantVolume ?? ""}
					onChange={(e) => handleChange(e)}
					onBlur={(e) => handleBlur(e)}
					variant="outlined"
					fullWidth
					type="number"
					name="lubricantVolume"
					InputProps={{
						classes: {
							input: classes.inputText,
						},
						endAdornment: isUpdating?.lubricantVolume ? (
							<Facebook size={20} color="#A79EB4" />
						) : null,
					}}
					disabled={isUpdating?.lubricantVolume || isReadOnly}
					onKeyDown={(e) => handleEnterPress(e)}
				/>
			</div>
			<div className={classes.container}>
				<Typography className={classes.typo}>Unit of Measure</Typography>
				<ADD.NameInput
					value={localTaskInfo.lubricantUOM ?? ""}
					onChange={(e) => handleChange(e)}
					onBlur={(e) => handleBlur(e)}
					variant="outlined"
					fullWidth
					name="lubricantUOM"
					InputProps={{
						classes: {
							input: classes.inputText,
						},
						endAdornment: isUpdating?.lubricantUOM ? (
							<Facebook size={20} color="#A79EB4" />
						) : null,
					}}
					disabled={isUpdating?.lubricantUOM || isReadOnly}
					onKeyDown={(e) => handleEnterPress(e)}
				/>
			</div>
			<div className={classes.container}>
				<Typography className={classes.typo}>
					{customCaptions?.lubricant}
				</Typography>
				<DyanamicDropdown
					isServerSide={false}
					width="100%"
					placeholder="Select Lubricant "
					columns={[{ id: 1, name: "name" }]}
					dataSource={lubricantsList}
					selectedValue={{
						id: localTaskInfo.lubricantID,
						name: localTaskInfo.lubricantName,
					}}
					handleSort={handleSort}
					onChange={(val) =>
						dropdownHandleChange(val, "lubricantID", "lubricantName")
					}
					selectdValueToshow="name"
					isReadOnly={isReadOnly || loading}
					showClear
				/>
			</div>
		</div>
	);
};

export default withMount(Lubricant);
