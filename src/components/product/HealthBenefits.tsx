'use client';

import React from 'react';
import { HealthBenefit } from '@/types';
import { motion } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';

interface HealthBenefitsProps {
  benefits: HealthBenefit[];
  productName: string;
}

export const HealthBenefits: React.FC<HealthBenefitsProps> = ({ benefits, productName }) => {
  return (
    <div className="bg-white rounded-4 p-4 p-md-5 border shadow-sm my-4">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 text-success fw-bold small mb-1">
            <Sparkles size={18} />
            <span>ORGANIC NUTRITIONAL VITALITY</span>
          </div>
          <h3 className="font-heading fw-bold text-dark mb-0">
            Why Eat {productName}?
          </h3>
        </div>
        <div className="bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 small fw-semibold d-flex align-items-center gap-1">
          <Info size={14} />
          <span>Informational Nutrition Profile</span>
        </div>
      </div>

      {/* Grid of Circular Meters */}
      <div className="row g-4">
        {benefits.map((benefit, idx) => {
          // Circumference math for SVGs
          const radius = 36;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (benefit.percentage / 100) * circumference;

          return (
            <div key={idx} className="col-md-6 col-lg-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-3 rounded-4 h-100 bg-light text-center d-flex flex-column align-items-center justify-content-between border"
              >
                {/* Meter SVG */}
                <div className="position-relative mb-3" style={{ width: '90px', height: '90px' }}>
                  <svg className="w-100 h-100 transform -rotate-90" viewBox="0 0 90 90">
                    {/* Track */}
                    <circle
                      cx="45"
                      cy="45"
                      r={radius}
                      stroke="#E2ECE6"
                      strokeWidth="7"
                      fill="transparent"
                    />
                    {/* Animated Fill */}
                    <motion.circle
                      cx="45"
                      cy="45"
                      r={radius}
                      stroke="#2D7A4D"
                      strokeWidth="7"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      whileInView={{ strokeDashoffset }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  {/* Center percentage & icon */}
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <span className="fs-5 d-block lh-1 mb-1">{benefit.icon}</span>
                    <span className="font-heading fw-extrabold text-success small">
                      {benefit.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-100">
                  <h6 className="font-heading fw-bold text-dark mb-1">{benefit.title}</h6>
                  <p className="small text-muted mb-0" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Disclaimer Badge */}
      <div className="mt-4 p-3 rounded-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 d-flex align-items-center gap-2 small text-dark">
        <Info size={16} className="text-warning flex-shrink-0" />
        <span>
          <strong>Disclaimer:</strong> Nutritional indicators are for informational dietary reference only and do not replace personalized medical advice or clinical healthcare treatments.
        </span>
      </div>
    </div>
  );
};
