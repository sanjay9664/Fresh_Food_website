'use client';

import React from 'react';
import { NutritionInfo as NutritionInfoType } from '@/types';
import { motion } from 'framer-motion';
import { Flame, Activity, Leaf, Shield, MapPin, Calendar, Compass, Package } from 'lucide-react';

interface NutritionInfoProps {
  nutrition: NutritionInfoType;
}

export const NutritionInfo: React.FC<NutritionInfoProps> = ({ nutrition }) => {
  const macros = [
    { label: 'Calories', val: nutrition.calories, icon: <Flame className="text-danger" size={18} /> },
    { label: 'Protein', val: nutrition.protein, icon: <Activity className="text-primary" size={18} /> },
    { label: 'Fiber', val: nutrition.fiber, icon: <Leaf className="text-success" size={18} /> },
    { label: 'Carbs', val: nutrition.carbs, icon: <Shield className="text-warning" size={18} /> }
  ];

  const vitamins = [
    { name: 'Vitamin A', dv: nutrition.vitaminA, color: '#FF8F00' },
    { name: 'Vitamin C', dv: nutrition.vitaminC, color: '#4CAF50' },
    { name: 'Iron Content', dv: nutrition.iron, color: '#E53935' }
  ];

  return (
    <div className="bg-white rounded-4 p-4 p-md-5 border shadow-sm my-4">
      <h3 className="font-heading fw-bold text-dark mb-4 pb-2 border-bottom">
        Nutrition & Storage Guide
      </h3>

      <div className="row g-4 mb-4">
        {/* Left Side: Macro & Micronutrients */}
        <div className="col-lg-6">
          <h5 className="font-heading fw-bold text-dark mb-3">Macronutrient Profile</h5>
          <div className="row g-2 mb-4">
            {macros.map((m, idx) => (
              <div key={idx} className="col-6">
                <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 border">
                  <div className="p-2 bg-white rounded-circle shadow-sm">{m.icon}</div>
                  <div>
                    <span className="small text-muted d-block">{m.label}</span>
                    <strong className="text-dark font-heading">{m.val}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h5 className="font-heading fw-bold text-dark mb-3">Daily Micronutrient Values</h5>
          <div className="d-flex flex-column gap-3">
            {vitamins.map((v, idx) => (
              <div key={idx}>
                <div className="d-flex justify-content-between small fw-bold mb-1">
                  <span className="text-dark">{v.name}</span>
                  <span className="text-success">{v.dv}</span>
                </div>
                <div className="progress" style={{ height: '10px', borderRadius: '50px' }}>
                  <motion.div
                    className="progress-bar rounded-pill"
                    style={{ backgroundColor: v.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: v.dv.includes('%') ? v.dv.replace(' DV', '') : '50%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Storage, Origin, How to Consume */}
        <div className="col-lg-6">
          <div className="p-4 bg-light rounded-4 border h-100 d-flex flex-column justify-content-between">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex gap-3">
                <div className="p-2 bg-success bg-opacity-10 text-success rounded-3 h-fit">
                  <Package size={20} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">How to Store</h6>
                  <p className="small text-muted mb-0">{nutrition.storage}</p>
                </div>
              </div>

              <div className="d-flex gap-3">
                <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-3 h-fit">
                  <Compass size={20} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">How to Consume</h6>
                  <p className="small text-muted mb-0">{nutrition.howToConsume}</p>
                </div>
              </div>

              <div className="d-flex gap-3">
                <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 h-fit">
                  <MapPin size={20} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Farm Origin</h6>
                  <p className="small text-muted mb-0">{nutrition.origin}</p>
                </div>
              </div>

              <div className="d-flex gap-3">
                <div className="p-2 bg-danger bg-opacity-10 text-danger rounded-3 h-fit">
                  <Calendar size={20} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Best Before</h6>
                  <p className="small text-muted mb-0">{nutrition.bestBefore}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
