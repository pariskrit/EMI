import React from "react";
import "./style.css";

function GeneralButton({
	className = null,
	onClick,
	style,
	Icon = null,
	showIconLeft = true,
	showIconRight = false,
	children,
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
		<button onClick={onClick} className={`button ${className}`} style={style}>
			{buttonChildren}
		</button>
	);
}

export default GeneralButton;
