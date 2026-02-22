import { useState } from "react";
import { svgPacket } from "../../utils/svgPacket";

// --- Static Data ---
const staticEmployees = [
  { id: 1, name: "John Doe",    email: "john@souviktechagency.com",   role: "employee" },
  { id: 2, name: "Sarah Khan",  email: "sarah@souviktechagency.com",  role: "employee" },
  { id: 3, name: "Mike Ross",   email: "mike@souviktechagency.com",   role: "employee" },
];

const staticClients = [
  { id: 1, name: "ABC Corp",    email: "abc@souviktechagency.com",    company: "ABC Corp" },
  { id: 2, name: "XYZ Ltd",     email: "xyz@souviktechagency.com",    company: "XYZ Ltd" },
  { id: 3, name: "Nova Studio", email: "nova@souviktechagency.com",   company: "Nova Studio" },
];

// --- Reusable Table ---
const UserTable = ({ data, columns, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-primary/8 text-xs uppercase tracking-wide text-primary/60">
          {columns.map((col) => (
            <th key={col} className="px-5 py-3 text-left font-semibold">{col}</th>
          ))}
          <th className="px-5 py-3 text-left font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="border-b border-primary/5 last:border-0 hover:bg-primary/2 transition">
            <td className="px-5 py-3 font-medium text-primary">{row.name}</td>
            <td className="px-5 py-3 text-primary/60">{row.email}</td>
            {row.company && <td className="px-5 py-3 text-primary/60">{row.company}</td>}
            <td className="px-5 py-3">
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(row)} className="text-xs px-3 py-1 rounded-lg border border-primary/15 text-primary hover:bg-primary hover:text-secondary transition font-semibold">
                  Edit
                </button>
                <button onClick={() => onDelete(row.id)} className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition font-semibold">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Add User Modal ---
const AddUserModal = ({ onClose }) => {
  const [role, setRole] = useState("employee");
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-secondary rounded-2xl w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
          <h3 className="text-primary font-bold text-base">Add User</h3>
          <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Role toggle */}
          <div>
            <p className="text-primary/60 text-xs font-semibold uppercase tracking-widest mb-2">Role</p>
            <div className="flex gap-2">
              {["employee", "client"].map((r) => (
                <button key={r} onClick={() => setRole(r)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition capitalize ${role === r ? "bg-primary text-secondary border-primary" : "border-primary/15 text-primary/60 hover:border-primary/40"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* General Info */}
          <p className="text-primary/60 text-xs font-semibold uppercase tracking-widest">General Info</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-primary text-xs font-semibold block mb-1">Full Name <span className="text-red-400">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
            </div>
            <div className="col-span-2">
  <label className="text-primary text-xs font-semibold block mb-1">Email <span className="text-red-400">*</span></label>
  <div className="flex items-center border border-primary/15 rounded-lg bg-white overflow-hidden focus-within:border-primary/40 transition">
    <input name="email" value={form.email} onChange={handleChange} placeholder="john"
      className="flex-1 min-w-0 px-3 py-2 text-sm text-primary placeholder:text-primary/30 focus:outline-none bg-transparent" />
    <span className="px-3 py-2 text-xs text-primary/50 border-l border-primary/10 bg-primary/4 shrink-0 whitespace-nowrap">
      @souviktechagency.com
    </span>
  </div>
</div>
          </div>

          <div>
            <label className="text-primary text-xs font-semibold block mb-1">Password <span className="text-red-400">*</span></label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
          </div>

          {role === "client" && (
            <div>
              <label className="text-primary text-xs font-semibold block mb-1">Company</label>
              <input name="company" value={form.company} onChange={handleChange} placeholder="ABC Corp"
                className="w-full px-3 py-2 rounded-lg border border-primary/15 bg-white text-primary text-sm placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-primary/8 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition">Cancel</button>
          <button className="px-4 py-2 text-sm font-semibold bg-primary text-secondary rounded-lg transition">Save</button>
        </div>
      </div>
    </div>
  );
};

// --- Main ---
const AllUsers = () => {
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (user) => console.log("Edit", user);
  const handleDelete = (id) => console.log("Delete", id);

  return (
    <div className="space-y-4">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-primary font-display text-2xl font-bold">Users</h2>
          <p className="text-primary/60 text-sm mt-1">Manage employees and clients</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-secondary flex justify-center items-center gap-1 text-sm font-semibold rounded-lg transition">
          {svgPacket["plusIcon"]}
          Add User
        </button>
      </div>

      {/* Employees table */}
      <div className="bg-white border border-primary/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-primary/8">
          <h3 className="text-primary font-semibold text-sm">Employees <span className="text-primary/60">({staticEmployees.length})</span></h3>
        </div>
        <UserTable data={staticEmployees} columns={["Name", "Email"]} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Clients table */}
      <div className="bg-white border border-primary/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-primary/8">
          <h3 className="text-primary font-semibold text-sm">Clients <span className="text-primary/60">({staticClients.length})</span></h3>
        </div>
        <UserTable data={staticClients} columns={["Name", "Email", "Company"]} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Modal */}
      {showModal && <AddUserModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AllUsers;