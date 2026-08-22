'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Sprout, ShieldCheck, Sparkles } from 'lucide-react';

export const ScrollFloatingVeggies: React.FC = () => {
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 2000], [0, -250]);
  const y2 = useTransform(scrollY, [0, 2000], [0, 300]);
  const y3 = useTransform(scrollY, [0, 2000], [0, -180]);
  const rotate1 = useTransform(scrollY, [0, 2000], [0, 180]);
  const rotate2 = useTransform(scrollY, [0, 2000], [0, -220]);

  return (
    <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Floating SVG Element 1 */}
      <motion.div
        style={{ y: y1, rotate: rotate1, top: '25%', left: '2%', opacity: 0.15 }}
        className="position-fixed text-success"
      >
        <Leaf size={36} />
      </motion.div>

      {/* Floating SVG Element 2 */}
      <motion.div
        style={{ y: y2, rotate: rotate2, top: '50%', right: '2%', opacity: 0.15 }}
        className="position-fixed text-success"
      >
        <Sprout size={40} />
      </motion.div>

      {/* Floating SVG Element 3 */}
      <motion.div
        style={{ y: y3, rotate: rotate1, top: '75%', left: '3%', opacity: 0.15 }}
        className="position-fixed text-success"
      >
        <ShieldCheck size={38} />
      </motion.div>

      {/* Floating SVG Element 4 */}
      <motion.div
        style={{ y: y1, rotate: rotate2, top: '35%', right: '3%', opacity: 0.15 }}
        className="position-fixed text-warning"
      >
        <Sparkles size={34} />
      </motion.div>
    </div>
  );
};
