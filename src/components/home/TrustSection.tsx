'use client';

import React from 'react';
import { Sprout, CreditCard, ShieldCheck, RotateCcw } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustFeatures = [
    {
      icon: <Sprout size={24} className="text-success" />,
      title: 'Farm to Home',
      description: 'Direct from our farms'
    },
    {
      icon: <CreditCard size={24} className="text-success" />,
      title: 'Secure Payment',
      description: '100% safe & secure'
    },
    {
      icon: <ShieldCheck size={24} className="text-success" />,
      title: 'Quality Assured',
      description: 'Handpicked with care'
    },
    {
      icon: <RotateCcw size={24} className="text-success" />,
      title: 'Easy Returns',
      description: 'No questions asked'
    }
  ];

  return (
    <section className="py-4 bg-cream">
      <div className="container">
        <div className="bg-white rounded-4 p-4 shadow-sm border">
          <div className="row g-4 align-items-center">
            {trustFeatures.map((feat, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-md-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-3 rounded-circle bg-success bg-opacity-10 flex-shrink-0">
                    {feat.icon}
                  </div>
                  <div>
                    <strong className="d-block text-dark font-heading fw-bold">{feat.title}</strong>
                    <span className="text-muted small">{feat.description}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
