import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { svgPacket } from "../../utils/svgPacket";
import { getEmployees, getClients, createUser, deleteUser, getDeletedUsers } from "../../api/user";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import useToast from "../../hooks/useToast";

// --- Active User Table ---
const UserTable = ({ data, columns, onDelete, isLoading, showCompany = false }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-primary/8 text-xs uppercase tracking-wide text-primary/60">
          {columns.map((col) => (
            <th key={col} className="px-5 py-3 text-left font-semibold">
              {col}
            </th>
          ))}
          <th className="px-5 py-3 text-left font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={columns.length + 1} className="px-5 py-6 text-center text-primary/30 text-xs">
              Loading...
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} className="px-5 py-6 text-center text-primary/30 text-xs">
              No users found.
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={row._id} className="border-b border-primary/5 last:border-0 hover:bg-primary/2 transition">
              <td className="px-5 py-3 font-medium text-primary">{row.name}</td>
              <td className="px-5 py-3 text-primary/60">{row.email}</td>
              {showCompany && row.company !== undefined && <td className="px-5 py-3 text-primary/60">{row.company || "—"}</td>}
              <td className="px-5 py-3">
                <button onClick={() => onDelete(row)} className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition font-semibold">
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// --- Deleted User Table ---
const DeletedUserTable = ({ data, isLoading }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-primary/8 text-xs uppercase tracking-wide text-primary/60">
          <th className="px-5 py-3 text-left font-semibold">Name</th>
          <th className="px-5 py-3 text-left font-semibold">Email</th>
          <th className="px-5 py-3 text-left font-semibold">Role</th>
          <th className="px-5 py-3 text-left font-semibold">Company</th>
          <th className="px-5 py-3 text-left font-semibold">Status</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={5} className="px-5 py-6 text-center text-primary/30 text-xs">
              Loading...
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-5 py-6 text-center text-primary/30 text-xs">
              No deleted users.
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={row._id} className="border-b border-primary/5 last:border-0 opacity-50">
              <td className="px-5 py-3 font-medium text-primary line-through">{row.name}</td>
              <td className="px-5 py-3 text-primary/60">{row.email}</td>
              <td className="px-5 py-3 text-primary/60 capitalize">{row.role}</td>
              <td className="px-5 py-3 text-primary/60">{row.company || "—"}</td>
              <td className="px-5 py-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-500">Deleted</span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// --- Add User Modal ---
const AddUserModal = ({ onClose, onSave, isPending }) => {
  const [role, setRole] = useState("employee");
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;
    const payload = {
      name: form.name,
      email: `${form.email}@souviktechagency.com`,
      password: form.password,
      role,
      ...(role === "client" && { company: form.company }),
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-secondary rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
          <h3 className="text-primary font-bold text-base">Add User</h3>
          <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-primary/60 text-xs font-semibold uppercase tracking-widest mb-2">Role</p>
            <div className="flex gap-2">
              {["employee", "client"].map((r) => (
                <button key={r} onClick={() => setRole(r)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition capitalize ${role === r ? "bg-primary text-secondary border-primary" : "border-primary/15 text-primary/60 hover:border-primary/40"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <p className="text-primary/60 text-xs font-semibold uppercase tracking-widest">General Info</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-primary text-xs font-semibold block mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm font-semibold placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
            </div>
            <div className="col-span-2">
              <label className="text-primary text-xs font-semibold block mb-1">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center border border-primary/15 rounded-lg bg-white overflow-hidden focus-within:border-primary/40 transition">
                <input name="email" value={form.email} onChange={handleChange} placeholder="john" className="flex-1 min-w-0 px-3 py-2 text-sm text-primary placeholder:text-primary/30 font-semibold focus:outline-none bg-transparent" />
                <span className="px-3 py-2 text-xs text-primary/50 font-semibold border-l border-primary/10 bg-primary/4 shrink-0 whitespace-nowrap">@souviktechagency.com</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-primary text-xs font-semibold block mb-1">
              Password <span className="text-red-400">*</span>
            </label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm font-semibold placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
          </div>

          {role === "client" && (
            <div>
              <label className="text-primary text-xs font-semibold block mb-1">Company</label>
              <input name="company" value={form.company} onChange={handleChange} placeholder="ABC Corp" className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white font-semibold text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={isPending} className="px-4 py-2 text-sm font-semibold bg-primary text-secondary rounded-lg transition disabled:opacity-50">
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Tab Toggle ---
const TabToggle = ({ active, onChange }) => (
  <div className="flex items-center bg-primary/6 ml-auto rounded-full p-1 gap-0.5">
    {["active", "deleted"].map((t) => (
      <button key={t} onClick={() => onChange(t)} className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${active === t ? "bg-primary text-secondary shadow" : "text-primary/50 hover:text-primary"}`}>
        {t}
      </button>
    ))}
  </div>
);

// --- Main ---
const AllUsers = () => {
  const { toast, ToastContainer } = useToast();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [tab, setTab] = useState("active");

  const { data: empData, isLoading: empLoading } = useQuery({ queryKey: ["employees"], queryFn: getEmployees });
  const { data: cliData, isLoading: cliLoading } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const { data: deletedData, isLoading: deletedLoading } = useQuery({
    queryKey: ["deletedUsers"],
    queryFn: getDeletedUsers,
  });

  const employees = empData?.users || empData || [];
  const clients = cliData?.users || cliData || [];
  const deletedUsers = deletedData?.users || deletedData || [];

  const { mutate: addUser, isPending: addPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      queryClient.invalidateQueries(["clients"]);
      toast("success", "User created successfully.");
      setShowModal(false);
    },
    onError: (err) => toast("error", err.message || "Failed to create user."),
  });

  const { mutate: removeUser } = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      queryClient.invalidateQueries(["clients"]);
      queryClient.invalidateQueries(["deletedUsers"]);
      toast("success", "User deleted successfully.");
      setDeleteTarget(null);
    },
    onError: (err) => toast("error", err.message || "Failed to delete user."),
  });

  return (
    <div className="space-y-4">
      <ToastContainer />
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Row 1 — title + add button */}
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="text-primary font-display text-2xl font-bold">Users</h2>
            <p className="text-primary/60 text-sm mt-1">Manage employees and clients</p>
          </div>
          {tab === "active" && (
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary text-secondary flex justify-center items-center gap-1 text-sm font-semibold rounded-lg transition">
              {svgPacket["plusIcon"]} Add User
            </button>
          )}
        </div>

        {/* Row 2 — tab toggle */}
        <TabToggle active={tab} onChange={setTab} />
      </div>

      {tab === "active" ? (
        <>
          {/* Employees */}
          <div className="bg-white border border-primary/8 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-primary/8">
              <h3 className="text-primary font-semibold text-sm">
                Employees <span className="text-primary/60">({employees.length})</span>
              </h3>
            </div>
            <UserTable data={employees} columns={["Name", "Email"]} onDelete={setDeleteTarget} isLoading={empLoading} showCompany={false} />
          </div>

          {/* Clients */}
          <div className="bg-white border border-primary/8 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-primary/8">
              <h3 className="text-primary font-semibold text-sm">
                Clients <span className="text-primary/60">({clients.length})</span>
              </h3>
            </div>
            <UserTable data={clients} columns={["Name", "Email", "Company"]} onDelete={setDeleteTarget} isLoading={cliLoading} showCompany={true} />
          </div>
        </>
      ) : (
        <div className="bg-white border border-primary/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-primary/8">
            <h3 className="text-primary font-semibold text-sm">
              Deleted Users <span className="text-primary/60">({deletedUsers.length})</span>
            </h3>
          </div>
          <DeletedUserTable data={deletedUsers} isLoading={deletedLoading} />
        </div>
      )}

      {showModal && <AddUserModal isPending={addPending} onClose={() => setShowModal(false)} onSave={addUser} />}

      {deleteTarget && <ConfirmDeleteModal title="Delete User" description={`Are you sure you want to delete "${deleteTarget.name}"? This is a soft delete — record will be preserved.`} onConfirm={() => removeUser(deleteTarget._id)} onClose={() => setDeleteTarget(null)} />}
    </div>
  );
};

export default AllUsers;
