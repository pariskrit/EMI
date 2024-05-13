import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useHistoryLength() {
	const location = useLocation();
	const [historyLength, setHistoryLength] = useState(0);

	useEffect(() => {
		setHistoryLength((prevLength) => prevLength + 1);
		return () => {
			setHistoryLength((prevLength) => {
				if (prevLength === 0) {
					return 0;
				} else {
					return prevLength - 1;
				}
			});
		};
	}, [location.key]);

	return historyLength;
}
