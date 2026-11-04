'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface StockAdjustModalProps {
  isOpen: boolean;
  item: any;
  onClose: () => void;
  onConfirm: (item: any, type: string, qty: number, reason: string) => void;
}

export default function StockAdjustModal({ isOpen, item, onClose, onConfirm }: StockAdjustModalProps) {
  const [adjustType, setAdjustType] = useState('add');
  const [qty, setQty] = useState<number | string>(10);
  const [reason, setReason] = useState('Warehouse restock received');

  if (!isOpen || !item) return null;

  const numericQty = Number(qty) || 0;
  const resultingStock = 
    adjustType === 'add' ? item.available + numericQty : 
    adjustType === 'remove' ? Math.max(0, item.available - numericQty) : 
    numericQty;

  const handleSubmit = () => {
    onConfirm(item, adjustType, numericQty, reason);
    setQty(10);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 p-6 shadow-xl text-xs space-y-5">
        
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-base font-semibold text-zinc-900">Adjust Stock Quantity</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
          <div className="font-semibold text-zinc-900">{item.name}</div>
          <div className="text-[11px] text-zinc-500 font-mono mt-1">
            SKU: {item.sku} {item.variant && `• Variant: ${item.variant}`}
          </div>
          <div className="mt-2 text-zinc-700 font-medium">
            Current Available Stock: <span className="text-zinc-900">{item.available} units</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'add', label: '+ Add Stock' },
            { id: 'remove', label: '- Remove Stock' },
            { id: 'set', label: '= Set Exact' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setAdjustType(t.id)}
              className={`py-2 rounded-lg border font-medium transition-colors ${
                adjustType === t.id ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1.5">Quantity *</label>
            <input
              type="number"
              min="0"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full h-[38px] px-3 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block font-medium text-zinc-700 mb-1.5">Resulting Stock</label>
            <div className="w-full h-[38px] px-3 flex items-center bg-zinc-100 border border-zinc-200/80 rounded-lg font-semibold text-zinc-900">
              {resultingStock} units
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1.5">Reason for Adjustment *</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-[38px] px-3 border border-zinc-200 rounded-lg bg-white focus:border-zinc-900 focus:outline-none transition-colors"
          >
            <option value="Warehouse restock received">Warehouse restock received</option>
            <option value="Physical cycle count correction">Physical cycle count correction</option>
            <option value="Damaged / showroom allocation">Damaged / showroom allocation</option>
          </select>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-zinc-200 font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors shadow-sm">
            Confirm Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}