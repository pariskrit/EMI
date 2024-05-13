import React from "react";
const CustomGraphDot = (props) => {
	const { cx, cy, stroke, payload, fill } = props;
	if (payload.defects.length) {
		return (
			<svg
				fill={fill}
				x={cx - 10}
				y={cy - 10}
				width={20}
				height={20}
				version="1.1"
				id="Capa_1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 310.806 310.806"
				stroke={stroke}
			>
				<g id="SVGRepo_bgCarrier" stroke-width="0" />
				<g
					id="SVGRepo_tracerCarrier"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<g id="SVGRepo_iconCarrier">
					<path d="M305.095,229.104L186.055,42.579c-6.713-10.52-18.172-16.801-30.652-16.801c-12.481,0-23.94,6.281-30.651,16.801 L5.711,229.103c-7.145,11.197-7.619,25.39-1.233,37.042c6.386,11.647,18.604,18.883,31.886,18.883h238.079 c13.282,0,25.5-7.235,31.888-18.886C312.714,254.493,312.24,240.301,305.095,229.104z M155.403,253.631 c-10.947,0-19.82-8.874-19.82-19.82c0-10.947,8.874-19.821,19.82-19.821c10.947,0,19.82,8.874,19.82,19.821 C175.223,244.757,166.349,253.631,155.403,253.631z M182.875,115.9l-9.762,65.727c-1.437,9.675-10.445,16.353-20.119,14.916 c-7.816-1.161-13.676-7.289-14.881-14.692l-10.601-65.597c-2.468-15.273,7.912-29.655,23.185-32.123 c15.273-2.468,29.655,7.912,32.123,23.185C183.284,110.192,183.268,113.161,182.875,115.9z" />{" "}
				</g>
			</svg>
		);
	} else {
		return (
			<circle
				cx={cx}
				cy={cy}
				r="7"
				stroke-width="3"
				fill={fill}
				width={20}
				height={20}
			/>
		);
	}
};
export default CustomGraphDot;
