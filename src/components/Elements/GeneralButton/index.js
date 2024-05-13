import React from "react";
import { makeStyles } from "tss-react/mui";
import "./style.css";

function GeneralButton({
	className = null,
	onClick,
	style,
	Icon = null,
	showIconLeft = true,
	showIconRight = false,
	children,
	disabled,
}) {
	let buttonChildren = children;

	if (Icon && showIconLeft) {
		buttonChildren = (
			<div className="button_with_icon">
				<Icon className="icon" />
				{children}
			</div>
		);
	}

	if (Icon && showIconRight) {
		buttonChildren = (
			<div className="button_with_icon">
				{children}
				<Icon className="icon" />
			</div>
		);
	}
	const useStyles = makeStyles()((theme) => ({}));
	const { cx } = useStyles();
	return (
		<button
			onClick={onClick}
			className={cx("button", className, { "disabled-button": disabled })}
			style={{ ...style, textTransform: "uppercase" }}
			disabled={disabled}
		>
			{buttonChildren}
		</button>
	);
}

export default GeneralButton;
