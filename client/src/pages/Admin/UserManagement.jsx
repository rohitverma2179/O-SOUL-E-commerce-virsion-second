import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Shield, 
  Mail,
  Trash2,
  Edit2
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Rohit Verma', email: 'rohit@osoul.com', role: 'Super Admin', status: 'Active', avatar: 'RV' },
    { id: 2, name: 'Aanya Sharma', email: 'aanya@gmail.com', role: 'User', status: 'Active', avatar: 'AS' },
    { id: 3, name: 'Rohan Gupta', email: 'rohan.g@yahoo.com', role: 'Admin', status: 'Inactive', avatar: 'RG' },
    { id: 4, name: 'Priya Das', email: 'priya@outlook.com', role: 'User', status: 'Active', avatar: 'PD' },
    { id: 5, name: 'Amit Kumar', email: 'amit.k@gmail.com', role: 'User', status: 'Active', avatar: 'AK' },
  ]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage permissions and monitor user activity across the platform.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or role..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white transition-colors w-full md:w-auto justify-center">
              <Filter size={16} />
              Filters
            </button>
            <select className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500/20 outline-none w-full md:w-auto">
              <option>All Roles</option>
              <option>Super Admin</option>
              <option>Admin</option>
              <option>User</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
                <th className="px-6 py-4 font-medium">User Details</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Login</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail size={12} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Shield size={14} className={user.role === 'Super Admin' ? 'text-purple-500' : 'text-blue-500'} />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    2 hours ago
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit User">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete User">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-500 bg-slate-50/20">
          <p>Showing 5 of 24 users</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-slate-200 hover:bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded bg-blue-600 text-white font-medium">1</button>
            <button className="px-3 py-1 rounded border border-slate-200 hover:bg-white">2</button>
            <button className="px-3 py-1 rounded border border-slate-200 hover:bg-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
