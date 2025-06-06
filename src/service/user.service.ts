import axios from "axios";

export interface UserItem {
    id: number;
    username: string;
    roles: { name: string }[];
}


export const fetchAllUsers = async (): Promise<UserItem[]> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("No auth token found.");

        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${process.env.NEXT_PUBLIC_ALL_USERS_API}`, { headers });

        return res.data?.result || []; // 🔧 Lấy từ `result` thay vì `data`
    } catch (error: any) {
        console.error("❌ Fetch all users error:", error.response?.data || error.message);
        return [];
    }
};


export const deleteUser = async (userId: number): Promise<boolean> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("No auth token found.");

        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_DELETE_USER_API}${userId}`, { headers });

        return res.status === 200;
    } catch (error: any) {
        console.error("❌ Delete user failed:", error.response?.data || error.message);
        return false;
    }
};

