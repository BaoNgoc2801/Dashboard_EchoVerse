"use client";

import { useEffect, useState, useRef } from "react";
import { fetchImageDetail, ImageDetail } from "@/service/post.service";

export const useImageDetails = (ids: string[]) => {
    const [detailsMap, setDetailsMap] = useState<Record<string, ImageDetail>>({});
    const [loading, setLoading] = useState(true);
    const fetchedIdsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const newMap: Record<string, ImageDetail> = {};
            const newIds = ids.filter((id) => !fetchedIdsRef.current.has(id));

            await Promise.all(
                newIds.map(async (id) => {
                    try {
                        const detail = await fetchImageDetail(id);
                        if (detail) {
                            newMap[id] = detail;
                            fetchedIdsRef.current.add(id);
                        }
                    } catch (err) {
                        console.error(`❌ Failed to fetch detail for ID ${id}:`, err);
                    }
                })
            );

            setDetailsMap((prev) => ({ ...prev, ...newMap }));
            setLoading(false);
        };

        if (ids.length > 0) {
            fetchAll();
        }
    }, [ids.join(",")]); // stringify to ensure dependency comparison

    return { detailsMap, loading };
};
