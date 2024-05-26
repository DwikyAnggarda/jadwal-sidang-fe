// import { jwtVerify } from "jose";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import Cookies from 'js-cookie';
import { NextResponse } from "next/server";
import moment from 'moment-timezone';
import { redirect } from 'next/navigation'
// import { useRouter } from "next/navigation";

export const API_URL = process.env.NEXT_PUBLIC_API_BACKEND;
// const cookies = new Cookies();
// const accessToken = Cookies.get("token") ?? null;
// console.log('access', accessToken);
// moment.locale("id");
// const router = useRouter();
const currentDate = new Date();

// Get the current time in Asia/Jakarta time zone
const jakartaTime = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

// Calculate the expiration time by adding 30 seconds
// const expirationTime = new Date(jakartaTime.getTime() + 60 * 1000); // 30 seconds * 1000 milliseconds per second
const expirationTime = moment.tz('Asia/Jakarta').add(30, 'seconds'); // 30 seconds * 1000 milliseconds per second
console.log('expirationTime', expirationTime.toDate().toUTCString());

export function getJwtSecretKey() {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("JWT Secret key is not matched");
    }
    return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(token) {
    try {
        // const { payload } = await jwtVerify(token, getJwtSecretKey());
        if (!token) {
            return null;
        }
        
        return token;
        // const { payload } = await token;

    } catch (error) {
        return null;
    }
}

function isAccessTokenValid(token) {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime; // Check expiration time
    } catch (error) {
        console.log('isAccessTokenValid error ', error);
        return false; // Invalid token
    }
}

/**
 * Custom fetch for axios
 */

export const apiFetch = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        'Authorization': `Bearer ${Cookies.get("token")}`
    }
})

apiFetch.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // console.log('err', error.response.status);
        // return;
        if (error.response.status === 401) {
            // return NextResponse.redirect('/login');
            Cookies.remove("token");
            window.location.href = '/login';
            // Clear token/cookies here
            // Example: document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            
            // Redirect to login page
            // router.push('/login');
        }
        return Promise.reject(error);
    }
);

/* apiFetch.interceptors.request.use(async (config) => {
    if (isAccessTokenValid(config.headers.Authorization.split(' ')[1])) {
        return config; // Access token is valid
    }

    const newAccessToken = await refreshToken(Cookies.get("token"));
    console.log('newAccessToken ', newAccessToken);
    config.headers.Authorization = `Bearer ${newAccessToken}`;
    return config;
}); */

export async function refreshToken(token) {
    try {
        console.log('Refresh token process');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/refresh`);
        console.log('Refresh token response ', response.data.token);
        // return true;

        /*  if (!response.ok) {
            console.log('Refresh token failed');
            throw new Error('Refresh token failed'); // Handle errors
        } */

        // const newToken = response.data.token;

        Cookies.remove("token");

        // document.cookie = `token=${response.data.token}; max-age=30; expires=${expirationTime.toDate().toUTCString()} path=/;`;
        document.cookie = `token=${response.data.token}; path=/;`;
        
        /* cookies.set({
            name: "token",
            value: response.data.token,
            // path: "/",
            // httpOnly: true,
            // secure: true,
            // maxAge: 60 * 60 * 24,
            // maxAge: Math.floor((expirationTime.getTime() - currentDate.getTime()) / 1000), // 30 seconds
            // maxAge: moment().seconds(+30).format(), // 30 seconds
        }); */

        return response.data.token;

        // const user = await response.json();
        // return user.data.token; // Return the new access token
    } catch (error) {
        console.log('Refresh token error ', error.response.data);
        // router.push("/login");
        const redirect = NextResponse.redirect(new URL(`/login`));
        return redirect;
    }
}

export async function logout() {
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get("token")}`
        await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/logout`);

        Cookies.remove("token");

        const response = NextResponse.json(
            { success: true },
            { status: 200, headers: { "content-type": "application/json" } }
        );
        
        return response;
        // const user = await response.json();
        // return user.data.token; // Return the new access token
    } catch (error) {
        return NextResponse.json({ success: false, error: "Can't logout" });
        // console.log('Refresh token error ', error);
        // router.push("/login");
    }
}

/* export async function apiFetch(endpoint, method,  = {}) {
    const url = `${API_URL}${endpoint}`;

    await axios({
        url,
        method,
        ...additionalConfig
    })
    .then((response) => {
        console.log(response);
        //set token on cookies
        // Cookies.set('token', response.data.token);
        
        //redirect to dashboard
        // Router.push('/dashboard');
    })
    .catch((error) => {
        console.log(error.response.data);
        //assign error to state "validation"
        // setValidation(error.response.data);
    });

    // try {
    //     const response = await fetch(url, options);

    //     if (!response.ok) {
    //         // console.log(response);
    //         // return new Error(`Error fetching ${url}: ${response.statusText}`);
    //     }

    //     return await response.json();
    // } catch (error) {
    //     console.error(error);
    //     throw error;
    // }
} */