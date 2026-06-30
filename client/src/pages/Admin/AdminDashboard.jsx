import React from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '2,543', change: '+12.5%', isPositive: true, icon: <Users className="text-olive" />, bg: 'bg-olive/10' },
    { label: 'Total Sales', value: '₹45,230', change: '+8.2%', isPositive: true, icon: <ShoppingBag className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Conversion Rate', value: '3.24%', change: '-1.5%', isPositive: false, icon: <TrendingUp className="text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Active Visitors', value: '154', change: '+24%', isPositive: true, icon: <Eye className="text-purple-600" />, bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, Super Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.isPositive ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <button className="text-sm text-olive font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Product</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { id: '#ORD-7421', user: 'Aanya Sharma', product: 'Boxy Tee (M)', amount: '₹990', status: 'Delivered', statusColor: 'text-emerald-600 bg-emerald-50' },
                  { id: '#ORD-7420', user: 'Rohan Verma', product: 'Joggers (L)', amount: '₹1,490', status: 'Processing', statusColor: 'text-olive bg-olive/10' },
                  { id: '#ORD-7419', user: 'Priya Das', product: 'Harem Pants (S)', amount: '₹1,290', status: 'Shipped', statusColor: 'text-amber-600 bg-amber-50' },
                  { id: '#ORD-7418', user: 'Kartik Iyer', product: 'Combos - Set 1', amount: '₹2,690', status: 'Delivered', statusColor: 'text-emerald-600 bg-emerald-50' },
                ].map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-medium text-slate-900">{order.id}</td>
                    <td className="py-4 text-slate-600">{order.user}</td>
                    <td className="py-4 text-slate-600">{order.product}</td>
                    <td className="py-4 font-bold text-slate-900">{order.amount}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Logs / Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">System Logs</h2>
            <Clock size={18} className="text-slate-400" />
          </div>
          <div className="space-y-6">
            {[
              { time: '2 mins ago', msg: 'Super Admin updated Hero Section', color: 'bg-olive' },
              { time: '15 mins ago', msg: 'New user registered: Amit K.', color: 'bg-emerald-500' },
              { time: '1 hour ago', msg: 'Server health check passed', color: 'bg-slate-400' },
              { time: '3 hours ago', msg: 'Database backup completed', color: 'bg-purple-500' },
              { time: '5 hours ago', msg: 'Inventory low: Boxy Tee (L)', color: 'bg-red-500' },
            ].map((log, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="relative">
                  <div className={`w-2.5 h-2.5 rounded-full ${log.color} mt-1.5`}></div>
                  {idx !== 4 && <div className="absolute top-4 left-[4.5px] bottom-[-20px] w-[1px] bg-slate-100"></div>}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{log.msg}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl bg-slate-50 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            View Full Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
