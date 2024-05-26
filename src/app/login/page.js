"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/20/solid";


export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });
        const { success } = await res.json();
        if (success) {
            router.push("/protected");
            // router.reload();
        } else {
            alert("Login failed");
        }
    };

    const toRegister = () => {
        router.push("/register");
    };

    return (
        <div>
            <div className="flex flex-col py-12 px-48 container">
                <div className="flex">
                    <h1 className="font-extrabold text-xl">Manajemen Jadwal Sidang</h1>
                </div>
                <div className="flex flex-row mt-24 justify-center validasi-content">
                    <div
                        className="flex flex-col  form-content w-1/2 pr-12">
                        <h1 className="mx-auto font-extrabold text-4xl mb-12">LOGIN</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="form-control w-full  mb-2">
                                    <div className="label mb-2">
                                        <span className="label-text text-md font-medium">Email</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                            <EnvelopeIcon className="w-5 h-5 opacity-70 text-primary" />
                                        </span>
                                        <input type="text" className="input input-bordered pl-10 w-full max-w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                </label>
                            </div>
                            <div className="form-control">
                                <label className="form-control w-full  mb-2">
                                    <div className="label mb-2">
                                        <span className="label-text text-md font-medium">Password</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                            <LockClosedIcon className="w-5 h-5 opacity-70 text-primary" />
                                        </span>
                                        <input type="password" className="input input-bordered pl-10 w-full max-w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" className="btn btn-primary">LOGIN</button>
                            </div>
                        </form>
                        {/* <div className="mt-3">
                            <h3 className="text-md font-medium">Belum punya akun? <a onClick={toRegister} className="text-blue-700 link no-underline">Daftar disini!</a></h3>
                        </div> */}
                    </div>
                    {/* <div
                        className="image-content w-1/2">
                        <img src="/assets/images/checklist.svg"></img>
                    </div> */}
                </div>
            </div>
        </div>
        // <div className="hero min-h-screen bg-base-200">
        //     <div className="hero-content text-center">
        //         <div className="max-w-md">
        //             <h1 className="text-5xl font-bold">LOGIN</h1>
        //             <form onSubmit={handleSubmit}>
        //                 <div className="form-control">
        //                     <label className="label">
        //                         <span className="label-text">Email</span>
        //                     </label>
        //                     <input
        //                         type="text"
        //                         className="input input-bordered"
        //                         value={username}
        //                         onChange={(e) => setUsername(e.target.value)}
        //                         placeholder="Masukkan Alamat Email"
        //                     />
        //                 </div>
        //                 <div className="form-control">
        //                     <label className="label">
        //                         <span className="label-text">Password</span>
        //                     </label>
        //                     <input
        //                         type="password"
        //                         className="input input-bordered"
        //                         value={password}
        //                         onChange={(e) => setPassword(e.target.value)}
        //                         placeholder="Masukkan Password"
        //                     />
        //                 </div>
        //                 <div className="form-control mt-6">
        //                     <button type="submit" className="btn btn-primary">
        //                         LOGIN
        //                     </button>
        //                 </div>
        //             </form>
        //             <div className="mt-3">
        //                 <h3>
        //                     Belum punya akun?{" "}
        //                     <a onClick={toRegister} className="text-blue-700 link no-underline">
        //                         Daftar disini!
        //                     </a>
        //                 </h3>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
}
