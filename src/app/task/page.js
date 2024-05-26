"use client";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/libs/auth";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import moment from "moment";
import Datepicker from "react-tailwindcss-datepicker";

export default function TaskPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [profile, setProfile] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(0);
    const [pic, setPic] = useState(0);
    // const [due_at, setDue_at] = useState('');
    const [due_at, setDue_at] = useState({ 
        startDate: null,
        endDate: null
    });
    const [estimation, setEstimation] = useState('');
    const [priority, setPriority] = useState('');
    const [effort, setEffort] = useState('');
    const [status, setStatus] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        await apiFetch.get("/api/tasks").then((response) => {
            //console.log(response);
            setData(response.data.data);
            setColumns([
                {
                    name: "Judul",
                    selector: (row) => row.title,
                    sortable: true,
                },
                {
                    name: "PIC",
                    selector: (row) => row.pic.name,
                    sortable: true,
                },
                {
                    name: "Kategori",
                    selector: (row) => row.category.name,
                    sortable: true,
                },
                {
                    name: "Deadline",
                    selector: (row) => moment(row.due_at).format("DD/MM/YYYY"),
                    sortable: true,
                },
                {
                    name: "Estimasi",
                    selector: (row) => row.estimation,
                    sortable: true,
                },
                {
                    name: "Prioritas",
                    selector: (row) => row.priority,
                    sortable: true,
                },
                {
                    name: "Effort",
                    selector: (row) => row.effort,
                    sortable: true,
                },
                {
                    name: "Status",
                    selector: (row) => row.status,
                    sortable: true,
                },
            ]);
        });
    };

    /* fetch data users */
    const fetchUsers = async () => {
        await apiFetch.get("/api/users").then((response) => {
            //console.log(response);
            setUsers(response.data.data);
        });
    };

    /* fetch profile (sementara) */
    const fetchProfile = async () => {
        await apiFetch.get("/api/profile").then((response) => {
            //console.log(response);
            setProfile(response.data.data);
        });
    };

    /* fetch data categories */
    const fetchCategories = async () => {
        await apiFetch.get("/api/categories").then((response) => {
            //console.log(response);
            setCategories(response.data.data);
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('category_id', category);
        formData.append('pic_id', pic);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('due_at', moment(due_at.startDate).format("YYYY-MM-DD HH:mm:ss"));
        formData.append('finished_at', moment(due_at.endDate).format("YYYY-MM-DD HH:mm:ss"));
        formData.append('estimation', estimation);
        formData.append('priority', priority);
        formData.append('effort', effort);
        formData.append('status', status);

        /* let formData = {
            category_id: category,
            pic_id: pic,
            title: title,
            description: description,
            due_at: moment(due_at.startDate).format("YYYY-MM-DD HH:mm:ss"),
            finished_at: moment(due_at.endDate).format("YYYY-MM-DD HH:mm:ss"),
            estimation: estimation,
            priority: priority,
            effort: effort,
            status: status,
        }; */

        if (file) {
            formData.append('file', file);
        }

        let url = null;
        let msg = "";

        /* const jsonObject = {};
        formData.forEach((value, key) => {
            jsonObject[key] = value;
        });

        const jsonData = JSON.stringify(jsonObject);

        console.log('formData', jsonData); return; */

        if (selectedRows.length > 0) {
            url = apiFetch.put(`/api/tasks/${selectedRows[0].id}`, formData, {
                headers: {
                    'Content-Type': formTitle == 'Form Ubah User' ? 'application/json' : 'multipart/form-data'
                }
            });
            msg = "Berhasil ubah task";
        } else {
            url = apiFetch.post("/api/tasks", formData, {
                headers: {
                    'Content-Type': formTitle == 'Form Ubah User' ? 'application/json' : 'multipart/form-data'
                }
            });
            msg = "Berhasil tambah task";
        }

        await url
            .then((res) => {
                //console.log(res);

                document.getElementById("my_modal_3").close();

                Swal.fire({
                    icon: "success",
                    title: msg,
                    showConfirmButton: false,
                    timer: 1500,
                });

                fetchData();
            })
            .catch((error) => {
                console.log("error: ", error);
                document.getElementById("my_modal_3").close();
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Terjadi kesalahan di sistem. Silakan coba lagi.",
                });
            })
    }

    const handleDate = (newValue) => {
        // console.log("newValue:", newValue);
        setDue_at(newValue); 
    }

    const handleRowSelected = useCallback((state) => {
        setSelectedRows(state.selectedRows);
    }, []);

    const handleFileChange = (event) => {
        const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxFileSize = 4 * 1024 * 1024; // 4MB dalam bytes

        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (allowedFileTypes.includes(selectedFile.type)) {
                if (selectedFile.size <= maxFileSize) {
                    setFile(selectedFile);
                    // console.log('files', event.target.files[0]);
                    // console.log('Berhasil file');
                    setErrorMessage('');
                } else {
                    // Hapus nilai input file
                    event.target.value = null;
                    setFile(null);
                    setErrorMessage('Ukuran file terlalu besar! Maksimal 4MB.');
                }
            } else {
                // Hapus nilai input file
                event.target.value = null;
                setFile(null);
                setErrorMessage('Format file hanya dibolehkan .jpg, .png, .jpeg, .pdf, .doc, .docx!');
            }
        }
    };

    const handleCloseToast = () => {
        setErrorMessage('');
    };

    const handleEdit = () => {
        console.log('selected: ',selectedRows[0]);
        setFormTitle('Form Ubah User')
        document.getElementById('title').value = selectedRows[0].title;
        document.getElementById('pic_id').value = selectedRows[0].pic_id;
        document.getElementById('category_id').value = selectedRows[0].category_id;
        // document.getElementById('due_at').value = moment(selectedRows[0].due_at).format("DD/MM/YYYY");
        document.getElementById('description').value = selectedRows[0].description;
        document.getElementById('estimation').value = selectedRows[0].estimation;
        document.getElementById('priority').value = selectedRows[0].priority;
        document.getElementById('effort').value = selectedRows[0].effort;
        document.getElementById('status').value = selectedRows[0].status;

        setTitle(selectedRows[0].title)
        setPic(selectedRows[0].pic_id)
        setCategory(selectedRows[0].category_id)
        // setDue_at(moment(selectedRows[0].due_at).format("DD/MM/YYYY"))
        setDue_at({ 
            startDate: moment(selectedRows[0].due_at).format("YYYY-MM-DD"),
            endDate: moment(selectedRows[0].due_at).format("YYYY-MM-DD")
        })
        setDescription(selectedRows[0].description)
        setEstimation(selectedRows[0].estimation)
        setPriority(selectedRows[0].priority)
        setEffort(selectedRows[0].effort)
        setStatus(selectedRows[0].status)
        
        document.getElementById('my_modal_3').showModal()
    };

    const openModal = () => {
        setFormTitle("Form Tambah Task");
        document.getElementById("my_modal_3").showModal();
        document.getElementById("title").value = "";
        document.getElementById("pic_id").value = 0;
        document.getElementById("category_id").value = 0;
        setDue_at({ 
            startDate: null,
            endDate: null 
        })
        setFile(null)
        // document.getElementById("due_at").value = moment().format("DD/MM/YYYY");
        document.getElementById("description").value = "";
        document.getElementById("estimation").value = "";
        document.getElementById("priority").value = "null";
        document.getElementById("effort").value = "null";
        document.getElementById("status").value = "null";
    };

    const handleDelete = async () => {
        if (selectedRows.length > 0) {
            await Swal.fire({
                title: "Yakin ingin menghapus?",
                text: "Data tersebut akan hilang selamanya!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya, hapus saja!",
                cancelButtonText: "Batal",
            }).then((result) => {
                if (result.isConfirmed) {
                    apiFetch
                        .delete(`/api/tasks/${selectedRows[0].id}`)
                        .then((response) => {
                            Swal.fire({
                                icon: "success",
                                title: "Berhasil hapus data task",
                                showConfirmButton: false,
                                timer: 1500,
                            });

                            fetchData();
                        })
                        .catch((error) => {
                            console.log("error: ", error);
                            Swal.fire({
                                icon: "error",
                                title: "Gagal!",
                                text: "Terjadi kesalahan di sistem. Silakan coba lagi.",
                            });
                        });
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Belum pilih data task!",
            });
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchData();
        fetchUsers();
        fetchCategories();
    }, []);

    return (
        <AdminLayout router={router}>
            {/* {errorMessage && (
                <div className="toast toast-top toast-end" style={{ zIndex: 9999 }}>
                    <div className="alert alert-error">
                        <span>{errorMessage}</span>
                        <button onClick={handleCloseToast} className="btn btn-ghost btn-small">
                            X
                        </button>
                    </div>
                </div>
            )} */}

            <button className="btn btn-primary mb-4 mr-2" onClick={openModal}>
                Tambah
            </button>
            <button
                type="button"
                className="btn btn-neutral mr-2"
                onClick={handleEdit}
            >
                Edit
            </button>
            <button type="button" className="btn btn-error" onClick={handleDelete}>
                Hapus
            </button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-5">{formTitle}</h3>
                    <form method="dialog" onSubmit={submitForm}>
                        <label className="form-control gap-2 mb-3">
                            <div className="label">
                                <span className="label-text">Judul</span>
                            </div>
                            <input
                                type="text"
                                id="title"
                                className="input input-bordered"
                                placeholder="Judul"
                                autoComplete="off"
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>
                        {/* <label className="input input-bordered flex items-center gap-2 mb-3">
                            <Squares2X2Icon className="w-4 h-4 opacity-70" />
                        </label> */}
                        <label className="form-control gap-2 mb-3">
                            <div className="label">
                                <span className="label-text">Deskripsi</span>
                            </div>
                            <textarea id="description" className="textarea textarea-bordered" placeholder="Deskripsi" autoComplete="off" onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </label>
                        <label className="form-control gap-2 mb-3">
                            <div className="label">
                                <span className="label-text">Kategori</span>
                            </div>
                            <select id="category_id" className="select select-bordered" onChange={(e) => setCategory(e.target.value)} required>
                                <option value={0} disabled selected>Pilih Kategori</option>
                                {categories.map((category) => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className="form-control gap-2 mb-3">
                            <div className="label">
                                <span className="label-text">Deadline</span>
                            </div>
                            <Datepicker 
                                useRange={false} 
                                asSingle={true} 
                                value={due_at} 
                                onChange={handleDate}
                                displayFormat={"DD/MM/YYYY"}
                                inputClassName="input input-bordered w-full"
                            />
                            {/* <input type="text" id="due_at" placeholder="Deadline" onChange={(e) => setDue_at(e.target.value)} required></input> */}
                            {/* <input
                                type="text"
                                id="due_at"
                                className="input input-bordered"
                                placeholder="Deadline"
                                autoComplete="off"
                                onChange={(e) => setDue_at(e.target.value)}
                                required
                            /> */}
                        </label>
                        <label className="form-control gap-2 mb-3">
                            <div className="label">
                                <span className="label-text">Estimasi</span>
                            </div>
                            <input
                                type="text"
                                id="estimation"
                                className="input input-bordered"
                                placeholder="Estimasi"
                                autoComplete="off"
                                onChange={(e) => setEstimation(e.target.value)}
                                required
                            />
                        </label>
                        <label className="form-control gap-2 mb-3" style={profile.is_leader < 1 ? { display: 'none' } : {}
                            // { display: 'block' }
                        }>
                            <div className="label">
                                <span className="label-text">PIC</span>
                            </div>
                            <select id="pic_id" className="select select-bordered" onChange={(e) => setPic(e.target.value)} required>
                                <option value={0} disabled selected>Pilih PIC</option>
                                {users.map((user) => (
                                    <option value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className="form-control gap-2 mb-3">
                            <div className="label">
                                <span className="label-text">Prioritas</span>
                            </div>
                            <select id="priority" className="select select-bordered" onChange={(e) => setPriority(e.target.value)}>
                                <option value={'null'} disabled selected>Pilih Prioritas</option>
                                <option value={'normal'}>Normal</option>
                                <option value={'high'}>High</option>
                                <option value={'urgent'}>Urgent</option>
                            </select>
                        </label>
                        <label className="form-control gap-2 mb-3">
                            <div className="label">
                                <span className="label-text">Effort</span>
                            </div>
                            <select id="effort" className="select select-bordered" onChange={(e) => setEffort(e.target.value)}>
                                <option value={'null'} disabled selected>Pilih Effort</option>
                                <option value={'easy'}>Easy</option>
                                <option value={'medium'}>Medium</option>
                                <option value={'hard'}>Hard</option>
                            </select>
                        </label>
                        <label className="form-control gap-2 mb-3">
                            <div className="label">
                                <span className="label-text">Status</span>
                            </div>
                            <select id="status" className="select select-bordered" onChange={(e) => setStatus(e.target.value)}>
                                <option value={'null'} disabled selected>Pilih Status</option>
                                <option value={'open'}>Open</option>
                                <option value={'resolved'}>Resolved</option>
                                <option value={'in_progress'}>In Progress</option>
                                <option value={'closed'}>Closed</option>
                                <option value={'reopen'}>Reopen</option>
                            </select>
                        </label>
                            {/* style={profile.is_leader < 1 ? { display: 'none' } : { display: 'block' }} */}
                        <label className="form-control gap-2 mb-3">
                            <div className="label">
                                <span className="label-text">Lampiran Pendukung (Opsional)</span>
                            </div>
                            <input type="file" className={errorMessage ? 'file-input file-input-bordered file-input-error' : 'file-input file-input-bordered'} onChange={handleFileChange} />
                            {errorMessage ? (
                                <div className="text-red-600">
                                    <span>{errorMessage}</span>
                                </div>
                            ) : ''}
                        </label>
                            {/* w-full max-w-xs */}
                            {/* <select id="pic_id" className="select select-bordered" onChange={(e) => setPic(e.target.value)} required>
                                <option value={0} disabled selected>Pilih PIC</option>
                                {users.map((user) => (
                                    <option value={user.id}>{user.name}</option>
                                ))}
                            </select> */}
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-neutral"
                                onClick={() => document.getElementById("my_modal_3").close()}
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
            <DataTable
                columns={columns}
                data={data}
                selectableRows
                selectableRowsSingle
                pagination
                onSelectedRowsChange={handleRowSelected}
            />
        </AdminLayout>
    );
}
