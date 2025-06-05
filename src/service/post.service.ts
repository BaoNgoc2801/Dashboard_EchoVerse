import axios from "axios";

export interface ImageItem {
    id: string;
    title: string;
    url: string;
    creatorId: string;
}

export interface ImageDetail {
    id: string;
    title: string;
    url: string;
    creator?: {
        name?: string;
    };
}

export interface CommentItem {
    id: string;
    text: string;
    user?: {
        name?: string;
    };
}

// Fetch all images/posts
export const fetchImages = async (): Promise<ImageItem[]> => {
    try {
        const token = localStorage.getItem("auth_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(`${process.env.NEXT_PUBLIC_IMAGES_API}`, {
            headers,
        });
        return res.data?.data || [];
    } catch (error: any) {
        console.error("❌ Fetch images error:", error);
        return [];
    }
};

// Fetch detail for a single image/post
export const fetchImageDetail = async (id: string): Promise<ImageDetail | null> => {
    try {
        const token = localStorage.getItem("auth_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(`${process.env.NEXT_PUBLIC_IMAGES_DETAILS_API}/${id}`, {
            headers,
        });
        return res.data?.data || null;
    } catch (error) {
        console.error(`❌ Fetch image detail error (ID: ${id}):`, error);
        return null;
    }
};

export const fetchComments = async (postId: string): Promise<CommentItem[]> => {
    try {
        const token = localStorage.getItem("auth_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(`${process.env.NEXT_PUBLIC_COMMENTS_API}?postId=${postId}`, { headers });

        return Array.isArray(res.data?.data) ? res.data.data : [res.data.data];
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.warn(`⚠️ No comments found for post ${postId}`);
            return [];
        }
        console.error(`❌ Fetch comments error (PostID: ${postId}):`, error);
        return [];
    }
};

// Upload a new comment for an image/post
export const uploadComments = async (
    id: string,
    text: string,
    userId: string
): Promise<boolean> => {
    try {
        const token = localStorage.getItem("auth_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        await axios.post(
            `${process.env.NEXT_PUBLIC_UPLOAD_COMMENTS_API}/${id}`,
            { text, userId },
            { headers }
        );

        return true;
    } catch (error) {
        console.error(`❌ Upload comment error (ID: ${id}):`, error);
        return false;
    }
};
