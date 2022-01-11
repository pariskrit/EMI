import { useRef, useState, useCallback, useEffect } from "react";

/**
 * Wrapper around react's `useState` hook.
 * Use this hook to prevent memory leak as this wont call set state on unmounted component.
 *
 * @param initialValue initial state value
 */

const useStateSafe = (initialValue) => {
	const [val, setVal] = useState(initialValue);
	const ref = useRef();

	useEffect(() => {
		ref.current = true;
		return () => {
			ref.current = false;
		};
	}, []);

	const setValue = useCallback(
		(data) => {
			if ((ref.current = true)) setVal(data);
		},
		[setVal]
	);

	return [val, setValue];
};

export default useStateSafe;
