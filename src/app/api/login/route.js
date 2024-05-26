import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/libs/auth";
import { API_URL } from "@/libs/auth";
import axios from "axios";
import { NextResponse } from "next/server";
import moment from 'moment-timezone';
import Cookies from 'js-cookie';

export async function POST(request) {
    Cookies.remove('token'); // remove token if exist

    // moment.locale("id");
    const body = await request.json();
    
    const currentDate = new Date();

    // Get the current time in Asia/Jakarta time zone
    const jakartaTime = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

    // Calculate the expiration time by adding 30 seconds
    // const expirationTime = new Date(jakartaTime.getTime() + 60 * 1000); // 30 seconds * 1000 milliseconds per second
    const expirationTime = moment.tz('Asia/Jakarta').add(30, 'seconds'); // 30 seconds * 1000 milliseconds per second
    /* const 
    const token = await new SignJWT({
        username: body.username,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30s")
        .sign(getJwtSecretKey());
    const response = NextResponse.json(
        { success: true },
        { status: 200, headers: { "content-type": "application/json" } }
    );
    response.cookies.set({
        name: "token",
        value: token,
        path: "/",
        httpOnly: true,
    });
    return response; */
    //initialize formData
    const formData = new FormData();

    //append data to formData
    formData.append('email', body.username);
    formData.append('password', body.password);

    try {
        const res = await axios.post(`${API_URL}/api/login`, formData);
        const response = NextResponse.json(
            { success: true },
            { status: 200, headers: { "content-type": "application/json" } }
        );

        //set token
        response.cookies.set({
            name: "token",
            value: res.data.token,
            path: "/",
            // expires: expirationTime.toDate().toUTCString(),
            // maxAge: 30, // 30 seconds
            // httpOnly: true,
            // secure: true,/
            // maxAge: 60 * 60 * 24,
            // maxAge: Math.floor((expirationTime.getTime() - currentDate.getTime()) / 1000), // 30 seconds
            // maxAge: new Date(Date.now() + 30 * 1000), // 30 seconds
        });
        
        return response;

        
        /*
        response.cookies.set({
            name: "token",
            value: res.data.token,
            httpOnly: true,
            // secure: true,
            path: "/",
            // expires: 60 * 60 * 24,
        });

        return response; */
        /* let jsonResponse = NextResponse.json(
            { success: true },
            { status: 200, headers: { "content-type": "application/json" }}
        ); */
        // console.log(response.data.token);
        
        //set token
        // document.cookie = "name=token;" + '' + "token=" + response.data.token; + "; path=/ httpOnly=true";
        // document.cookie = "name=token; SameSite=None; Secure";
        // document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

        // jsonResponse.cookies.set({
        //     name: "token",
        //     value: response.data.token,
        //     path: "/",
        //     httpOnly: true,
        // });
        // console.log(response);

        // return NextResponse.json({ success: true });
        // return jsonResponse;
    } catch (error) {
        // console.log(error);
        return NextResponse.json({ success: false, error: error });
    }

    /* if (body.username === "admin" && body.password === "admin") {
        const token = await new SignJWT({
            username: body.username,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30s")
            .sign(getJwtSecretKey());
        const response = NextResponse.json(
            { success: true },
            { status: 200, headers: { "content-type": "application/json" } }
        );
        response.cookies.set({
            name: "token",
            value: token,
            path: "/",
            httpOnly: true,
        });
        return response;
    }
    return NextResponse.json({ success: false }); */
}