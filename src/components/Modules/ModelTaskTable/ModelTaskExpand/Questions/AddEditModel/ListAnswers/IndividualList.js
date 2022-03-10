import React, { useState, useRef } from "react";
import {
	FormGroup,
	FormControlLabel,
	Typography,
	Button,
	TextField,
	CircularProgress,
} from "@material-ui/core";
import * as yup from "yup";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import EMICheckbox from "components/Elements/EMICheckbox";
import useOutsideClick from "hooks/useOutsideClick";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import { Draggable } from "react-beautiful-dnd";

const me =
	JSON.parse(sessionStorage.getItem("me")) ||
	JSON.parse(localStorage.getItem("me"));

const schema = yup.object({
	name: yup.string().required("Please Provide Name"),
	raiseDefect: yup.bool(),
});

const defaultError = { raiseDefect: null, name: null };

function IndividualList({ x, classes, onEdit, onDelete, index }) {
	const childRef = useRef(null);

	const [editMode, setEdit] = useState(false);
	const [loader, setLoader] = useState(false);
	const [input, setInput] = useState({
		name: x.name,
		raiseDefect: x.raiseDefect,
	});
	const [error, setError] = useState(defaultError);

	const setState = (d) => setInput((th) => ({ ...th, ...d }));

	const handleEdit = async () => {
		setLoader(true);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const res = await onEdit(input);
				setLoader(false);
				if (res) {
					setEdit(false);
				}
			} else {
				const newError = generateErrorState(localChecker);
				setError({ ...error, ...newError });
			}
		} catch (e) {
			return;
		}
	};

	const handlePressEnter = (e) => {
		if (e.keyCode === 13) {
			handleEdit();
		}
	};

	useOutsideClick(childRef, () => setEdit(false));

	return (
		<Draggable draggableId={x.id + ""} index={index}>
			{(provider) => (
				<div ref={childRef} onClick={(e) => setEdit(true)}>
					<div
						className={classes.individualRow}
						{...provider.draggableProps}
						ref={provider.innerRef}
					>
						<span
							{...provider.dragHandleProps}
							ref={provider.innerRef}
							style={{ width: "0%" }}
						>
							<DragIndicatorIcon />
						</span>

						{editMode ? (
							<TextField
								error={error.name === null ? false : true}
								helperText={error.name === null ? null : error.name}
								style={{ width: "74%", padding: "10px 8px" }}
								onChange={(e) => setState({ name: e.target.value })}
								value={input.name}
								size="small"
								variant="outlined"
								autoFocus
								onKeyDown={handlePressEnter}
							/>
						) : (
							<span className={classes.text}>{x.name}</span>
						)}
						<FormGroup style={{ width: "10%" }}>
							<FormControlLabel
								style={{ marginLeft: 0 }}
								control={
									<EMICheckbox
										state={input.raiseDefect}
										changeHandler={() =>
											setState({ raiseDefect: !input.raiseDefect })
										}
										disabled={!editMode}
									/>
								}
								label={
									<Typography className={classes.checkboxText}>
										Raise {me?.customCaptions.defectPlural}
									</Typography>
								}
								disabled={!editMode}
							/>
						</FormGroup>
						<span style={{ width: "8%" }}>
							{editMode ? (
								<Button
									variant="outlined"
									className={classes.button}
									onClick={handleEdit}
								>
									{loader ? (
										<CircularProgress style={{ height: 22, width: 22 }} />
									) : (
										"Edit"
									)}
								</Button>
							) : (
								<DeleteIcon
									className={classes.deleteIcon}
									onClick={(e) => {
										e.stopPropagation();
										onDelete();
									}}
								/>
							)}
						</span>
					</div>
				</div>
			)}
		</Draggable>
	);
}

export default IndividualList;
