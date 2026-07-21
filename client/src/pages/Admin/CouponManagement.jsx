import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Edit2, 
  Copy, 
  Eye, 
  Calendar, 
  Percent, 
  TrendingUp, 
  Check, 
  X, 
  Users, 
  DollarSign, 
  ShoppingBag,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { API_BASE_URL } from '../../lib/api';

const CouponManagement = () => {
  // Tabs: 'list' or 'analytics'
  const [activeTab, setActiveTab] = useState('list');
  const [coupons, setCoupons] = useState([]);
  const [usageLogs, setUsageLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalDiscountGiven: 0,
    mostUsedCoupon: 'N/A',
    totalOrdersViaCoupon: 0,
    revenueGenerated: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const initialFormState = {
    code: '',
    name: '',
    discountType: 'percentage',
    discountValue: 0,
    maxDiscount: '',
    minOrder: 0,
    startDate: '',
    expiryDate: '',
    status: 'active',
    totalUsageLimit: '',
    perUserLimit: 1,
    isUnlimited: false,
    firstOrderOnly: false,
    appliesTo: 'all',
    applicableProducts: [],
    applicableCategories: [],
    customerRestriction: 'all',
    allowedUsers: [],
    freeShipping: false
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch Coupons, Products, Users & Analytics
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch Coupons
      const couponsRes = await fetch(`${API_BASE_URL}/coupons`, { credentials: 'include' });
      const couponsData = await couponsRes.json();
      if (couponsData.success) {
        setCoupons(couponsData.data);
      }

      // Fetch Products (for appliesTo dropdown)
      const productsRes = await fetch(`${API_BASE_URL}/products`);
      const productsData = await productsRes.json();
      if (productsData.success) {
        setProducts(productsData.data);
      }

      // Fetch Users (for customer restriction dropdown)
      const usersRes = await fetch(`${API_BASE_URL}/admin/users`, { credentials: 'include' });
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsersList(usersData.data);
      }

      // Fetch Analytics
      const analyticsRes = await fetch(`${API_BASE_URL}/coupons/analytics`, { credentials: 'include' });
      const analyticsData = await analyticsRes.json();
      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }

      // Fetch Usage Logs
      const logsRes = await fetch(`${API_BASE_URL}/coupons/usages`, { credentials: 'include' });
      const logsData = await logsRes.json();
      if (logsData.success) {
        setUsageLogs(logsData.data);
      }

    } catch (err) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelectChange = (name, id) => {
    setFormData(prev => {
      const current = prev[name] || [];
      const updated = current.includes(id) 
        ? current.filter(item => item !== id)
        : [...current, id];
      return { ...prev, [name]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Prepare payload
    const payload = {
      ...formData,
      maxDiscount: formData.maxDiscount === '' ? null : Number(formData.maxDiscount),
      totalUsageLimit: formData.totalUsageLimit === '' ? null : Number(formData.totalUsageLimit),
      discountValue: Number(formData.discountValue),
      minOrder: Number(formData.minOrder),
      perUserLimit: Number(formData.perUserLimit)
    };

    try {
      const url = editingCoupon 
        ? `${API_BASE_URL}/coupons/${editingCoupon._id}`
        : `${API_BASE_URL}/coupons`;
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Action failed');
      }

      setShowModal(false);
      setEditingCoupon(null);
      setFormData(initialFormState);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount || '',
      minOrder: coupon.minOrder,
      startDate: new Date(coupon.startDate).toISOString().split('T')[0],
      expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
      status: coupon.status,
      totalUsageLimit: coupon.totalUsageLimit || '',
      perUserLimit: coupon.perUserLimit,
      isUnlimited: coupon.isUnlimited,
      firstOrderOnly: coupon.firstOrderOnly,
      appliesTo: coupon.appliesTo,
      applicableProducts: coupon.applicableProducts || [],
      applicableCategories: coupon.applicableCategories || [],
      customerRestriction: coupon.customerRestriction,
      allowedUsers: coupon.allowedUsers || [],
      freeShipping: coupon.freeShipping || false
    });
    setShowModal(true);
  };

  const handleDuplicate = (coupon) => {
    setEditingCoupon(null);
    setFormData({
      code: `${coupon.code}_COPY`,
      name: `Copy of ${coupon.name}`,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount || '',
      minOrder: coupon.minOrder,
      startDate: new Date(coupon.startDate).toISOString().split('T')[0],
      expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
      status: coupon.status,
      totalUsageLimit: coupon.totalUsageLimit || '',
      perUserLimit: coupon.perUserLimit,
      isUnlimited: coupon.isUnlimited,
      firstOrderOnly: coupon.firstOrderOnly,
      appliesTo: coupon.appliesTo,
      applicableProducts: coupon.applicableProducts || [],
      applicableCategories: coupon.applicableCategories || [],
      customerRestriction: coupon.customerRestriction,
      allowedUsers: coupon.allowedUsers || [],
      freeShipping: coupon.freeShipping || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Promo & Coupon Management</h1>
          <p className="text-slate-500 mt-1">Design, edit, and track usage of store discounts and coupons.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCoupon(null);
            setFormData(initialFormState);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-olive text-white text-sm font-bold shadow-lg shadow-olive/20 hover:bg-olive/90 transition-all w-full md:w-auto"
        >
          <Plus size={18} /> Create New Coupon
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-olive/10 text-olive rounded-xl shrink-0"><Ticket size={24} /></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Coupons</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{analytics.activeCoupons} / {analytics.totalCoupons}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><DollarSign size={24} /></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Discount Given</p>
            <p className="text-xl font-bold text-slate-900 mt-1">₹{analytics.totalDiscountGiven.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Orders via Coupon</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{analytics.totalOrdersViaCoupon}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0"><TrendingUp size={24} /></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Revenue Assisted</p>
            <p className="text-xl font-bold text-slate-900 mt-1">₹{analytics.revenueGenerated.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6">
        <button 
          onClick={() => setActiveTab('list')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'list' ? 'border-olive text-olive' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Coupons Directory
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'logs' ? 'border-olive text-olive' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Usage & Audit Logs
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/30">
            <input 
              type="text" 
              placeholder="Search coupon code or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-olive"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold">Code / Name</th>
                  <th className="px-6 py-4 font-semibold">Discount Type & Value</th>
                  <th className="px-6 py-4 font-semibold">Usage Limit</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Expiry</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {filteredCoupons.map(coupon => {
                  const isExpired = new Date(coupon.expiryDate) < new Date();
                  return (
                    <tr key={coupon._id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 uppercase tracking-wide">{coupon.code}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{coupon.name}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}% (Max ₹${coupon.maxDiscount || 'N/A'})`
                          : `Flat ₹${coupon.discountValue}`
                        }
                        {coupon.freeShipping && <span className="block text-[10px] text-olive font-bold uppercase mt-0.5">Free Shipping Included</span>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-700">{coupon.usedCount} used</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {coupon.isUnlimited ? 'Unlimited' : `Limit ${coupon.totalUsageLimit || 'None'}`}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {isExpired ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">Expired</span>
                        ) : (
                          <button 
                            onClick={() => toggleStatus(coupon._id, coupon.status)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                              coupon.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {coupon.status === 'active' ? 'Active' : 'Inactive'}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(coupon.expiryDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(coupon)} className="p-2 text-slate-400 hover:text-olive hover:bg-slate-100 rounded-lg" title="Edit"><Edit2 size={16} /></button>
                          <button onClick={() => handleDuplicate(coupon)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Duplicate"><Copy size={16} /></button>
                          <button onClick={() => handleDelete(coupon._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {loading && <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">Loading coupons...</td></tr>}
                {!loading && !filteredCoupons.length && <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">No coupons found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Redemption History</h3>
            <span className="text-xs text-slate-400 font-semibold">{usageLogs.length} instances</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Coupon Used</th>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Discount Value</th>
                  <th className="px-6 py-4 font-semibold">Redeemed At</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {usageLogs.map(log => (
                  <tr key={log._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{log.userId?.fullName || 'Guest Customer'}</p>
                      <p className="text-xs text-slate-400">{log.userId?.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-olive uppercase tracking-wider">
                      {log.couponId?.code || 'DELETED'}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                      {log.orderId?.razorpayOrderId || log.orderId?._id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-950">
                      ₹{log.discountAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(log.usedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {loading && <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">Loading audit logs...</td></tr>}
                {!loading && !usageLogs.length && <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">No redemptions logged yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <header className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create Discount Coupon'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100 flex items-center gap-2">
                  <Info size={16} /> {error}
                </div>
              )}

              {/* General Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Coupon Code *</label>
                  <input 
                    type="text" 
                    name="code"
                    required
                    placeholder="e.g. WELCOME10"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Coupon Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="e.g. Welcome Customer Discount"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive"
                  />
                </div>
              </div>

              {/* Pricing breakdown values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Discount Type</label>
                  <select 
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Cash (₹)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Discount Value *</label>
                  <input 
                    type="number" 
                    name="discountValue"
                    required
                    min="0"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Max Discount Capped (₹)</label>
                  <input 
                    type="number" 
                    name="maxDiscount"
                    placeholder="e.g. 500"
                    disabled={formData.discountType === 'flat'}
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Min Order Amount (₹)</label>
                  <input 
                    type="number" 
                    name="minOrder"
                    min="0"
                    value={formData.minOrder}
                    onChange={handleInputChange}
                    className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Start Date *</label>
                  <input 
                    type="date" 
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Expiry Date *</label>
                  <input 
                    type="date" 
                    name="expiryDate"
                    required
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Usage Settings */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20 space-y-4">
                <h4 className="font-serif font-bold text-slate-900 flex items-center gap-2">
                  Usage Limits & Configuration
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Total Usage Limit</label>
                    <input 
                      type="number" 
                      name="totalUsageLimit"
                      disabled={formData.isUnlimited}
                      placeholder={formData.isUnlimited ? "Unlimited" : "e.g. 1000"}
                      value={formData.totalUsageLimit}
                      onChange={handleInputChange}
                      className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Per User Limit</label>
                    <input 
                      type="number" 
                      name="perUserLimit"
                      min="1"
                      value={formData.perUserLimit}
                      onChange={handleInputChange}
                      className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive"
                    />
                  </div>

                  <div className="flex flex-col justify-end gap-2 py-1 select-none">
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="isUnlimited"
                        checked={formData.isUnlimited}
                        onChange={handleInputChange}
                        className="rounded text-olive focus:ring-olive"
                      />
                      Unlimited Overall Usages
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="firstOrderOnly"
                        checked={formData.firstOrderOnly}
                        onChange={handleInputChange}
                        className="rounded text-olive focus:ring-olive"
                      />
                      First Order Only
                    </label>
                  </div>
                </div>
              </div>

              {/* Product and category scopes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20 space-y-4">
                  <h4 className="font-serif font-bold text-slate-900">Applies To</h4>
                  <div className="space-y-3">
                    <select 
                      name="appliesTo"
                      value={formData.appliesTo}
                      onChange={handleInputChange}
                      className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive bg-white"
                    >
                      <option value="all">All Products</option>
                      <option value="products">Selected Products Only</option>
                      <option value="categories">Selected Categories Only</option>
                    </select>

                    {formData.appliesTo === 'products' && (
                      <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-white space-y-2">
                        {products.map(prod => (
                          <label key={prod._id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={formData.applicableProducts.includes(prod._id)}
                              onChange={() => handleMultiSelectChange('applicableProducts', prod._id)}
                              className="rounded text-olive focus:ring-olive"
                            />
                            {prod.name}
                          </label>
                        ))}
                      </div>
                    )}

                    {formData.appliesTo === 'categories' && (
                      <div className="flex gap-4">
                        {['Men', 'Women', 'Unisex'].map(cat => (
                          <label key={cat} className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={formData.applicableCategories.includes(cat)}
                              onChange={() => handleMultiSelectChange('applicableCategories', cat)}
                              className="rounded text-olive focus:ring-olive"
                            />
                            {cat}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer restrictions */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20 space-y-4">
                  <h4 className="font-serif font-bold text-slate-900">Customer Access & Shipping</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Restriction Scope</label>
                      <select 
                        name="customerRestriction"
                        value={formData.customerRestriction}
                        onChange={handleInputChange}
                        className="w-full px-4 h-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-olive bg-white"
                      >
                        <option value="all">All Registered Customers</option>
                        <option value="new">New Customers Only</option>
                        <option value="specific">Specific User Whitelist</option>
                      </select>
                    </div>

                    {formData.customerRestriction === 'specific' && (
                      <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-white space-y-2">
                        {usersList.map(usr => (
                          <label key={usr.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={formData.allowedUsers.includes(usr.id)}
                              onChange={() => handleMultiSelectChange('allowedUsers', usr.id)}
                              className="rounded text-olive focus:ring-olive"
                            />
                            {usr.fullName} ({usr.email})
                          </label>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 select-none">
                      <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="freeShipping"
                          checked={formData.freeShipping}
                          onChange={handleInputChange}
                          className="rounded text-olive focus:ring-olive"
                        />
                        Waive shipping charges (Free Shipping)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 bg-slate-50/50 px-6 py-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-11 px-5 border border-slate-200 hover:bg-slate-100 text-xs font-bold uppercase tracking-widest rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 bg-olive text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-olive/90 transition shadow-lg"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CouponManagement;
