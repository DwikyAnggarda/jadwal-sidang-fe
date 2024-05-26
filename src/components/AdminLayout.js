import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MENU_LIST } from "./constants";
import styles from "../app/globals.css";
import { BellIcon, Bars3BottomLeftIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {  logout, apiFetch} from "@/libs/auth";

export default function Layout({ children}) {
  const router = useRouter();
  const pathName = usePathname();
  const [activePath, setActivePath] = useState(pathName);
  const [activeMenu, setActiveMenu] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [avatarPlaceholder, setAvatarPlaceholder] = useState("");


  const fetchData = async () => {
    await apiFetch.get("/api/profile").then((response) => {
        //console.log(response);
        setData(response.data.data);

        let word = response.data.data.name;
        var firstLetter = word.charAt(0);

        // Mengonversi huruf pertama menjadi huruf kapital
        setAvatarPlaceholder(firstLetter.toUpperCase());
    });
};


useEffect(() => {
    fetchData();
}, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const aside = document.getElementById("beresin-sidebar");
      if (!aside.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    const activedMenu = MENU_LIST.find((menu) => menu.path === activePath);
    if (activedMenu) {
      setActiveMenu(activedMenu.name);
    } else {
      setActiveMenu("");
    }
  }, [activePath]);

  const handleChangePage = (path) => {
    router.push(path);
    setIsOpen(false); 
  };

  const toProfile = () => {
    router.push("/profile");
  };

  const logoutHandler = async () => {
    await logout();
    router.push("/login");
}



  return (
    <div className="w-full h-full relative flex-1 flex-row">
      {/* Sidebar */}
      <button
        data-drawer-target="beresin-sidebar"
        data-drawer-toggle="beresin-sidebar"
        aria-controls="beresin-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={() => setIsOpen(!isOpen)} 
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3BottomLeftIcon className=" w-8 h-8" />
      </button>
      <aside
        id="beresin-sidebar"
        className={`fixed top-0 left-0 z-40 w-60 h-full transition-transform ${
          isOpen ? "" : "-translate-x-full"
        } sm:translate-x-0 bg-primary text-white`}
        aria-label="Sidebar"
      >
        {/* Sidebar Content */}
        <div className="flex items-center justify-center py-10">
          <h2 className="font-bold">JSD</h2>
        </div>
        <div className="h-full px-6 py-4 overflow-y-auto">
          <ul>
            {MENU_LIST.map((menu, index) => {
              if (menu.name !== "Profile") {
                return (
                  <li
                    key={index}
                    className={
                      activePath === menu.path
                        ? "flex flex-row items-center px-3 py-1 rounded-md active mb-4"
                        : "flex flex-row items-center px-3 py-1 rounded-md mb-4"
                    }
                    onClick={() => handleChangePage(menu.path, menu.name)}
                    style={{ cursor: "pointer" }}
                  >
                    {menu.icon && <menu.icon className="w-5 mr-2" />}
                    {menu.name}
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-5 sm:ml-64 h-screen">
        <header className="flex flex-row items-center justify-between">
          <h1 className="font-bold text-3xl text-gray-600">
            {activeMenu ? activeMenu : ""}
          </h1>
          <div className="flex flex-row items-center">
            <BellIcon className=" w-8 h-8 mr-3" />
            <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-10 rounded-full">
                    <span class="text-xl">{avatarPlaceholder}</span>
                {/* <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
                </div>
            </div>
            <details className="dropdown ">
              <summary className="btn ml-3 btn-primary">{data.name}<ChevronDownIcon className=" w-4 h-4" /></summary>
              <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                <li>
                  <a onClick={toProfile}>Profile</a>
                </li>
                <li>
                  <a className="text-red-500" onClick={logoutHandler}>Logout</a>
                </li>
              </ul>
            </details>
          </div>
        </header>
        <main className="mt-8">{children}</main>
      </div>
    </div>
  );
};
