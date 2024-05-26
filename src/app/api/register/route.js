import { API_URL } from "@/libs/auth";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
    const body = await request.json();

    const formData = new FormData();

    formData.append("name", body.name);
    formData.append("email", body.email);
    formData.append("password", body.password);
    formData.append("phone", body.phone);

    try {
        const res = await axios.post(`${API_URL}/api/register`, formData);
        const response = NextResponse.json(
            { success: true },
            { status: 200, headers: { "content-type": "application/json" } }
        );

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }

}
