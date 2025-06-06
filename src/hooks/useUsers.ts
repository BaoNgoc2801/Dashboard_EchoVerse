import { useEffect, useState } from "react";
import axios from "axios";

export interface User {
    id: string;
    channelName: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    avatar?: string;
    isActive: boolean;
    createdAt: string;
    totalPosts?: number;
    totalLivestreams?: number;
}

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_ALL_USERS_API}`);
                setUsers(res.data?.data || []);
            } catch (err) {
                console.error("Error fetching users", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
}
