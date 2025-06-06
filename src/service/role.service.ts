import axios from "axios";

export interface Permission {
    name: string;
    description: string;
}

export interface RoleItem {
    name: string;
    description: string;
    permissions: Permission[];
}

export const getAllRoles = async (): Promise<RoleItem[]> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("No auth token found.");

        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${process.env.NEXT_PUBLIC_GET_ALL_ROLES}`, { headers });

        return res.data?.result || [];
    } catch (error: any) {
        console.error("❌ Get all roles error:", error.response?.data || error.message);
        return [];
    }
};


export interface CreateRoleDto {
    name: string;
    description: string;
    permissions: string[];
}

export const createRole = async (role: CreateRoleDto): Promise<boolean> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("No auth token found.");

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_CREATE_ROLE}`,
            role,
            { headers }
        );

        return res.status === 201 || res.status === 200;
    } catch (error: any) {
        console.error("❌ Create role failed:", error.response?.data || error.message);
        return false;
    }
};
