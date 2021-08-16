import { useEffect, useRef } from "react";

function useDidMountEffect(func, depen) {
	const ref = useRef(false);
	useEffect(() => {
		if (ref.current) func();
		else ref.current = true;
	}, depen);
}

export default useDidMountEffect;
