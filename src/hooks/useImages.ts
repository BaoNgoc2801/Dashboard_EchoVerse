"use client";
import { useEffect, useState } from "react";
import { fetchImages, ImageItem } from "@/service/post.service";

export const useImages = () => {
    const [streams, setStreams] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await fetchImages();
            setStreams(data);
            setLoading(false);
        };
        load();
    }, []);

    return { streams, loading };
};
