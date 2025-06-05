import axios from 'axios';

const LOGIN_API_URL = process.env.NEXT_PUBLIC_LOGIN_API_URL;

export const signIn = async (username: string, password: string) => {
    if (!LOGIN_API_URL) {
        console.error('Login API URL is not defined');
        throw new Error('Login API URL is not defined');
    }

    try {
        const response = await axios.post(LOGIN_API_URL, { username, password });

        console.log('Server Response:', response.data);

        if (response.data && response.data.code === 0 && response.data.result?._authenticated && response.data.result.token) {

            localStorage.setItem("auth_token", response.data.result.token);

            return {
                username,
                token: response.data.result.token,
            };
        } else {
            throw new Error('Authentication failed.');
        }
    } catch (error: any) {
        console.error('Login error:', error.response?.data || error.message);
        throw new Error(
            error.response?.data?.message || 'Incorrect username or password.'
        );
    }
};
