"use client";
//layout
// import Layout from "../layouts/default";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
//import Link
import Link from 'next/link';

//import Head
import Head from 'next/head';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Lakukan pengecekan token di sini
        const checkToken = () => {
            // Misalnya, Anda memiliki cookie bernama 'authToken' untuk menyimpan token
            const authToken = Cookies.get('token');
            if (authToken) {
                // Jika token masih ada, redirect ke halaman dashboard
                router.push('/protected');
            } else {
                // Jika token tidak ada, tidak perlu melakukan apa pun
                // atau Anda bisa menambahkan logika redirect ke halaman login di sini
                router.push('/login');
            }
        };

        // Panggil fungsi pengecekan token saat komponen dimount
        checkToken();
    }, []); // Kita hanya ingin menjalankan efek sekali saat komponen dimount, jadi array dependencies kosong

    // Anda tidak perlu merender apa pun di komponen Home, karena akan diarahkan secara langsung
    return null;

    // return (
    //     // <button className="btn btn-primary">Hello daisyUI!</button>
    //     <Link href="/protected" className="btn btn-primary">Dashboard</Link>
    // )
}