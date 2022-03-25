import React from "react";
import clsx from "clsx";
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

	return (
		<button
			onClick={onClick}
			className={clsx("button", className, { "disabled-button": disabled })}
			style={{ ...style, textTransform: "uppercase" }}
			disabled={disabled}
		>
			{buttonChildren}
		</button>
	);
}

export default GeneralButton;
