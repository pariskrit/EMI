import { useEffect, useState, useRef, useMemo } from "react";

function useInfiniteScrollWithoutCount(
	fetchData,
	page,
	scrollEvent = window,
	uniqueId,
	extra = {}
) {
	const [loading, setLoading] = useState(false);

	const pageRef = useRef(page);
	const prevPageRef = useRef(0);
	const hasMoreRef = useRef(true);
	const extraInfo = useRef(extra);
	const threshold = 1;

	useMemo(() => {
		pageRef.current = page;
		extraInfo.current = extra;
	}, [page, extra]);

	useEffect(() => {
		prevPageRef.current = page === 1 ? 0 : prevPageRef.current;
	}, [page]);

	const fetchMoreData = async () => {
		if (hasMoreRef.current) {
			if (prevPageRef.current !== pageRef.current) {
				prevPageRef.current = pageRef.current;
				setLoading(true);
				const response = await fetchData(pageRef.current, extraInfo.current);

				if (response.length === 0) {
					setLoading(false);
					hasMoreRef.current = false;
					return;
				}

				setLoading(false);
			}
		}
	};

	useEffect(() => {
		scrollEvent.addEventListener("scroll", handleScroll);
		return () => scrollEvent.removeEventListener("scroll", handleScroll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scrollEvent]);

	const handleScroll = async (e) => {
		if (loading) return;

		const doc = document.getElementById(uniqueId);
		if (uniqueId && doc) {
			if (
				Math.ceil(doc?.offsetHeight + doc?.scrollTop) - doc.scrollHeight >=
				0
			) {
				await fetchMoreData();
			}
		} else if (
			document.documentElement.offsetHeight -
				(scrollEvent.innerHeight + document.documentElement.scrollTop) <=
			threshold
		) {
			await fetchMoreData();
		}
	};
	const gotoTop = () => {
		scrollEvent.scroll({ top: 0, left: 0, behavior: "smooth" });
	};
	return { loading, gotoTop, hasMoreRef };
}

export default useInfiniteScrollWithoutCount;
