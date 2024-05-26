"use client";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/libs/auth";
import { UserCircleIcon, UserIcon , EnvelopeIcon, DevicePhoneMobileIcon} from "@heroicons/react/20/solid";

export default function ProfilPage() {
    const router = useRouter();
    const [data, setData] = useState([]);

    const fetchData = async () => {
        await apiFetch.get("/api/profile").then((response) => {
            //console.log(response);
            setData(response.data.data);
        });
    };


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AdminLayout router={router}>
            <div className="flex justify-center items-center mt-32">
                <div className="bg-profile profile  w-1/2 flex flex-col justify-center items-center rounded-lg shadow-slate-300 shadow-md">
                    <div className="-translate-y-24 w-full flex flex-col justify-center items-center">
                        <UserCircleIcon className="w-48 h-48 text-gray-500 mb-5" />
                        <div className="flex justify-between w-3/4 bg-white py-2 px-4 rounded-md mb-3">
                            <h1>{data.name}</h1>
                            <UserIcon className="w-5 h-5 text-primary " />
                        </div>
                        <div className="flex justify-between w-3/4 bg-white py-2 px-4 rounded-md mb-3">
                            <h1>{data.email}</h1>
                            <EnvelopeIcon className="w-5 h-5 text-primary " />
                        </div>
                        <div className="flex justify-between w-3/4 bg-white py-2 px-4 rounded-md mb-3">
                            <h1>{data.phone}</h1>
                            <DevicePhoneMobileIcon className="w-5 h-5 text-primary " />
                        </div>
                    </div>
                    
                </div>
            </div>
        </AdminLayout>
    );
}
