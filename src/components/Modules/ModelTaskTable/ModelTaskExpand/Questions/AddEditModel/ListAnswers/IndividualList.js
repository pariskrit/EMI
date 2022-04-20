import React, { useState, useRef, useEffect } from "react";
import {
	FormGroup,
	FormControlLabel,
	Typography,
	TextField,
} from "@material-ui/core";
import * as yup from "yup";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import reorder from "assets/reorder.png";
import EMICheckbox from "components/Elements/EMICheckbox";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import { Draggable } from "react-beautiful-dnd";
import { Facebook } from "react-spinners-css";

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

	useEffect(() => {
		if (x) {
			setInput({
				name: x.name,
				raiseDefect: x.raiseDefect,
			});
		}
	}, [x]);

	const handleEdit = async (e, fromcheckbox = false, checkBoxValue) => {
		e.persist();
		if (input?.name === x?.name && !fromcheckbox) {
			setEdit(false);
			return;
		}

		if (input?.name === "" && !fromcheckbox) {
			setState({ name: x?.name });
			setEdit(false);
			return;
		}

		setLoader(true);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const res = await onEdit(
					fromcheckbox
						? { ...input, raiseDefect: e?.target?.checked || false }
						: input
				);
				setLoader(false);
				if (res) {
					setEdit(false);
					x.name = input?.name;
					x.raiseDefect = input?.raiseDefect;
				}
			} else {
				const newError = generateErrorState(localChecker);
				setError({ ...error, ...newError });
				setInput({
					name: x.name,
					raiseDefect: x.raiseDefect,
				});
			}
		} catch (e) {
			setInput({
				name: x.name,
				raiseDefect: x.raiseDefect,
			});
			return;
		} finally {
			setLoader(false);
			setEdit(false);
		}
	};

	const handlePressEnter = (e) => {
		if (e.keyCode === 13) {
			handleEdit(e);
		}
	};

	// useOutsideClick(childRef, () => setEdit(false));

	return (
		<Draggable draggableId={x.id + ""} index={index}>
			{(provider) => (
				<div ref={childRef}>
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
							<img src={reorder} alt="" height={18} width={18} />
						</span>

						{editMode ? (
							<TextField
								error={error.name === null ? false : true}
								helperText={error.name === null ? null : error.name}
								style={{
									width: "74%",
									backgroundColor: "white",
								}}
								onChange={(e) => setState({ name: e.target.value })}
								value={input?.name}
								size="small"
								variant="outlined"
								autoFocus
								onKeyDown={handlePressEnter}
								onBlur={handleEdit}
								disabled={loader}
								InputProps={{
									classes: {
										input: classes.inputText,
									},

									endAdornment: loader ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
								}}
							/>
						) : (
							<span className={classes.text} onClick={() => setEdit(true)}>
								{input?.name}
							</span>
						)}
						<FormGroup style={{ width: "10%" }}>
							<FormControlLabel
								style={{ marginLeft: 0 }}
								control={
									<EMICheckbox
										state={input.raiseDefect}
										changeHandler={(e) => {
											setInput((prev) => ({
												...prev,
												raiseDefect: !input.raiseDefect,
											}));
											handleEdit(e, true, e.target.checked);
										}}
									/>
								}
								label={
									<Typography className={classes.checkboxText}>
										Raise {me?.customCaptions.defectPlural}
									</Typography>
								}
							/>
						</FormGroup>
						<span>
							<DeleteIcon
								className={classes.deleteIcon}
								onClick={(e) => {
									e.stopPropagation();
									onDelete();
								}}
							/>
						</span>
					</div>
				</div>
			)}
		</Draggable>
	);
}

export default IndividualList;
