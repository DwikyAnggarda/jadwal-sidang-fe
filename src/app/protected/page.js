"use client";
import { useState, useEffect } from "react";
import { apiFetch, logout } from "@/libs/auth";
import moment from "moment";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout"
import { UserGroupIcon, Squares2X2Icon , PencilSquareIcon, DevicePhoneMobileIcon} from "@heroicons/react/20/solid";

export default function ProtectedPage() {
    const router = useRouter();

    // moment.locale("id");
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    // const fetchData = async () => {
    //     // console.log(moment().seconds(+30).format());
    //     //fetch user from Rest API
    //     await apiFetch.get('/api/categories')
    //         .then((response) => {
    //             //set response user to state
    //             setCategories(response.data);
    //             console.log('categories ', categories);
    //         })
    // }

    const logoutHandler = async () => {
        await logout();
        router.push("/login");
        // if (response?.success) {
        //     router.push("/login");
        //     // console.log("Logout success");
        // } else {
        //     console.log("Logout failed");
        // }
        // console.log(moment().seconds(+30).format());
        //fetch user from Rest API
        // await apiFetch.get('/api/categories')
        //     .then((response) => {
        //         //set response user to state
        //         setCategories(response.data);
        //         console.log('categories ', categories);
        //     })
    }

    const fetchUsers = async () => {
      await apiFetch.get("/api/users").then((response) => {
          //console.log(response);
          setUsers(response.data.data);
      });
  };

  const fetchCategories = async () => {
    await apiFetch.get("/api/categories").then((response) => {
        //console.log(response);
        setCategories(response.data.data);
    });
};

const fetchTask = async () => {
  await apiFetch.get("/api/tasks").then((response) => {
      //console.log(response);
      setTasks(response.data.data);
  });
};


    //hook useEffect
    useEffect(() => {
        // console.log(moment().seconds(30).format());
        //call function "fetchData"
        //fetchData();
        fetchUsers();
        fetchCategories();
        fetchTask();
    }, []);

    return (
      <>
        <AdminLayout router={router}>
                <div className="flex flex-row justify-around card-content">
                    <h2>Halaman Dashboard Jadwal Sidang</h2>
          {/* <div className="card card-total card-side bg-base-100 shadow-xl w-1/3 py-4 pl-2 ">
            <div className="flex flex-row">
              <div className="flex flex-col justify-center">
                  <UserGroupIcon className="w-16 h-16 text-primary" />
              </div>
              <div className="flex flex-col pl-2 justify-center">
                  <h1 className="font-semibold text-xl">{users.length}</h1>
                  <p>Total Users</p>
              </div>
            </div>
          </div>
          <div className="card card-total card-side bg-base-100 shadow-xl w-1/3 py-2 pl-2  ml-2">
            <div className="flex flex-row">
              <div className="flex flex-col justify-center">
                  <Squares2X2Icon className="w-16 h-16 text-primary" />
              </div>
              <div className="flex flex-col pl-2 justify-center">
                  <h1 className="font-semibold text-xl">{categories.length}</h1>
                  <p>Total Categories</p>
              </div>
            </div>
          </div>
          <div className="card card-total card-side bg-base-100 shadow-xl w-1/3 py-2 pl-2  ml-2">
            <div className="flex flex-row">
              <div className="flex flex-col justify-center">
                  <PencilSquareIcon className="w-16 h-16 text-primary" />
              </div>
              <div className="flex flex-col pl-2 justify-center">
                  <h1 className="font-semibold text-xl">{tasks.length}</h1>
                  <p>Total Tasks</p>
              </div>
            </div>
          </div> */}
          </div>
          {/* <p>Categories</p> */}
          <ul>
            {/* {categories.map((category) => (
                <li key={category.id}>
                    {category.name}
                </li>
            ))} */}
          </ul>

          {/* <button className="btn btn-primary" onClick={fetchData}>
            Refresh
          </button> */}
          {/* <button className="btn btn-error" onClick={logoutHandler}>
            Logout
          </button> */}
        </AdminLayout>
      </>
    );
}