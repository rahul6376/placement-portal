import { useState, useEffect } from 'react';
import { Briefcase, Building2, CheckCircle, Clock, AlertTriangle, Send, Megaphone, Shield } from 'lucide-react';
import { orderService } from '../services/api';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [newOrder, setNewOrder] = useState({ title: '', content: '', targetRole: 'STUDENT' });
  const [message, setMessage] = useState('');

  const currentUserRole = localStorage.getItem('userRole') || 'STUDENT';
  const isAdmin = currentUserRole === 'ADMIN';

  useEffect(() => {
    fetchOrders();
  }, [currentUserRole]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      let data;
      if (isAdmin) {
        data = await orderService.getAllOrders();
      } else {
        data = await orderService.getOrdersByRole(currentUserRole);
      }
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const senderId = localStorage.getItem('userId');
      await orderService.createOrder({ ...newOrder, senderId });
      setMessage('Order broadcasted successfully!');
      setNewOrder({ title: '', content: '', targetRole: 'STUDENT' });
      fetchOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to create order.');
    }
  };

  const stats = [
    { label: 'Total Jobs', value: '124', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
    { label: 'Companies', value: '45', icon: Building2, color: 'bg-purple-100 text-purple-600' },
    { label: 'Applications', value: '12', icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { label: 'Shortlisted', value: '3', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Welcome back! Here's an overview of your placement journey.
        </p>
      </div>

      {/* Eligibility Status Bar */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm flex items-start sm:items-center gap-4">
        <div className="rounded-full bg-emerald-100 p-2">
          <CheckCircle className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-emerald-900">Placement Eligible</h3>
          <p className="mt-1 text-sm text-emerald-700">
            You meet the baseline criteria (CGPA: 8.9 | Active Backlogs: 0). You are eligible to apply for drives.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <dt>
                <div className={`absolute rounded-xl p-3 ${item.color}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.label}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Admin Broadcast Creation */}
      {isAdmin && (
        <div className="mt-8 bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-indigo-900">Broadcast Official Order</h2>
          </div>
          {message && <div className="mb-4 text-sm font-medium text-emerald-600 bg-emerald-50 p-2 rounded">{message}</div>}
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Order Title (e.g., Mandatory Setup)"
                required
                className="w-full rounded-xl border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                value={newOrder.title}
                onChange={(e) => setNewOrder({...newOrder, title: e.target.value})}
              />
              <select
                className="w-full rounded-xl border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                value={newOrder.targetRole}
                onChange={(e) => setNewOrder({...newOrder, targetRole: e.target.value})}
              >
                <option value="STUDENT">All Students</option>
                <option value="COORDINATOR">Coordinators Only</option>
                <option value="COMPANY">Registered Companies</option>
              </select>
            </div>
            <textarea
              placeholder="Write the official directive or announcement here..."
              required
              rows={3}
              className="w-full rounded-xl border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm resize-none"
              value={newOrder.content}
              onChange={(e) => setNewOrder({...newOrder, content: e.target.value})}
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" /> Broadcast Order
            </button>
          </form>
        </div>
      )}

      {/* Orders & Announcements Feed */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-medium leading-6 text-gray-900">Official Orders & Announcements</h2>
        </div>
        <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
          {loadingOrders ? (
            <div className="p-8 text-center text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No official orders at this time.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {orders.map((order) => (
                <li key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{order.title}</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {new Date(order.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{order.content}</p>
                  {isAdmin && (
                    <div className="mt-3 text-xs font-medium text-indigo-600">
                      Targeted towards: {order.targetRole}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
