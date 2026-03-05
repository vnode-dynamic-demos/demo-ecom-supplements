'use client';

import { useState, Fragment } from 'react';
import { Search, Users, Mail, Phone, Eye, Key, ChevronDown, ChevronUp } from 'lucide-react';

interface Customer {
    id: string; name: string; email: string; phone: string;
    orders: number; spent: number; joined: string; status: 'active' | 'blocked';
}

const MOCK_CUSTOMERS: Customer[] = [
    { id: 'C001', name: 'Rohan Sharma', email: 'rohan@email.com', phone: '+91 98001 11111', orders: 7, spent: 18799, joined: '01 Jan 2026', status: 'active' },
    { id: 'C002', name: 'Priya Nair', email: 'priya@email.com', phone: '+91 87001 22222', orders: 3, spent: 9598, joined: '10 Jan 2026', status: 'active' },
    { id: 'C003', name: 'Arjun Singh', email: 'arjun@email.com', phone: '+91 76001 33333', orders: 1, spent: 2499, joined: '15 Feb 2026', status: 'active' },
    { id: 'C004', name: 'Sneha Patel', email: 'sneha@email.com', phone: '+91 65001 44444', orders: 5, spent: 12340, joined: '20 Dec 2025', status: 'active' },
    { id: 'C005', name: 'Karan Mehta', email: 'karan@email.com', phone: '+91 55001 55555', orders: 0, spent: 0, joined: '01 Mar 2026', status: 'blocked' },
];

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [resetSent, setResetSent] = useState<string | null>(null);

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    const toggleStatus = (id: string) => {
        setCustomers(cs => cs.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c));
    };

    const sendReset = (id: string) => {
        setResetSent(id);
        // Production: await supabase.auth.admin.generateLink({ type:'recovery', email: customer.email })
        setTimeout(() => setResetSent(null), 3000);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Customers</h1>
                    <p className="text-gray-400 text-sm">{customers.length} registered customers</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-[#eef2ff] rounded-xl border border-blue-200 px-4 py-2 text-center">
                        <p className="text-[#1a237e] font-black text-lg">{customers.filter(c => c.status === 'active').length}</p>
                        <p className="text-[#1a237e] text-xs font-bold">Active</p>
                    </div>
                    <div className="bg-green-50 rounded-xl border border-green-200 px-4 py-2 text-center">
                        <p className="text-green-700 font-black text-lg">₹{customers.reduce((s, c) => s + c.spent, 0).toLocaleString('en-IN')}</p>
                        <p className="text-green-600 text-xs font-bold">Total Revenue</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or phone..."
                        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#1a237e]" />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {['Customer', 'Contact', 'Orders', 'Total Spent', 'Joined', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(customer => (
                            <Fragment key={customer.id}>
                                <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#1a237e] flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                                                {customer.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{customer.name}</p>
                                                <p className="text-gray-400 text-xs font-mono">{customer.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-gray-600 text-xs flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</p>
                                        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {customer.phone}</p>
                                    </td>
                                    <td className="px-4 py-4 text-gray-700 font-bold text-sm">{customer.orders}</td>
                                    <td className="px-4 py-4 text-gray-800 font-black text-sm">₹{customer.spent.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-4 text-gray-400 text-sm">{customer.joined}</td>
                                    <td className="px-4 py-4">
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-1.5">
                                            <button onClick={() => setExpanded(expanded === customer.id ? null : customer.id)}
                                                className="flex items-center gap-1 text-xs font-bold text-gray-500 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50">
                                                <Eye className="w-3 h-3" />
                                                {expanded === customer.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                            </button>
                                            <button onClick={() => sendReset(customer.id)}
                                                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border transition-all ${resetSent === customer.id ? 'bg-green-50 border-green-200 text-green-700' : 'border-[#1a237e]/30 text-[#1a237e] hover:bg-[#eef2ff]'}`}>
                                                <Key className="w-3 h-3" />
                                                {resetSent === customer.id ? 'Sent!' : 'Reset PW'}
                                            </button>
                                            <button onClick={() => toggleStatus(customer.id)}
                                                className={`text-xs font-bold px-2 py-1 rounded-lg border transition-all ${customer.status === 'active' ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                                                {customer.status === 'active' ? 'Block' : 'Unblock'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expanded === customer.id && (
                                    <tr key={`${customer.id}-exp`} className="bg-[#f8f9ff]">
                                        <td colSpan={7} className="px-6 py-4">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Account Details</p>
                                                    <p className="text-sm text-gray-700"><span className="font-semibold">Email:</span> {customer.email}</p>
                                                    <p className="text-sm text-gray-700"><span className="font-semibold">Phone:</span> {customer.phone}</p>
                                                    <p className="text-sm text-gray-700"><span className="font-semibold">Joined:</span> {customer.joined}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Purchase Summary</p>
                                                    <p className="text-sm text-gray-700"><span className="font-semibold">Total Orders:</span> {customer.orders}</p>
                                                    <p className="text-sm text-gray-700"><span className="font-semibold">Total Spent:</span> ₹{customer.spent.toLocaleString('en-IN')}</p>
                                                    <p className="text-sm text-gray-700"><span className="font-semibold">Avg Order Value:</span> ₹{customer.orders > 0 ? Math.round(customer.spent / customer.orders).toLocaleString('en-IN') : 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Admin Actions</p>
                                                    <button onClick={() => sendReset(customer.id)}
                                                        className="w-full text-left text-xs font-semibold text-[#1a237e] hover:underline mb-1">
                                                        📧 Send Password Reset Email
                                                    </button>
                                                    <p className="text-xs text-gray-400">Customer will receive a secure link via email to reset their password.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="py-12 text-center">
                        <Users className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No customers found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
