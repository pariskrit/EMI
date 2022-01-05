import React, { useEffect } from "react";

function withMount(Component) {
	return function (props) {
		const status = {};
		useEffect(() => {
			return () => {
				status.aborted = true;
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return <Component {...props} isMounted={status} />;
	};
}
export default withMount;
