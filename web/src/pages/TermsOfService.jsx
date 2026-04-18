import React from 'react';
import { HiDocumentText } from 'react-icons/hi';

const TermsOfService = () => {
  return (
    <div className="bg-bg-dark min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <HiDocumentText className="text-accent-gold text-5xl mx-auto mb-6 opacity-80" />
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Terms of <span className="italic font-light text-gradient-gold">Service</span></h1>
          <p className="text-text-secondary text-xs uppercase tracking-[0.3em] font-light opacity-60">Rules of the Luxora Society</p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-8 md:p-12 backdrop-blur-xl space-y-8 text-text-secondary font-light leading-relaxed">
          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">1. Acceptance of Terms</h2>
            <p>By accessing and using Luxora, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">2. Use of License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on Luxora's website for personal, non-commercial transitory viewing only.</p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">3. Disclaimer</h2>
            <p>The materials on Luxora's website are provided on an 'as is' basis. Luxora makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">4. Limitations</h2>
            <p>In no event shall Luxora or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Luxora's website.</p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">5. Governing Law</h2>
            <p>Any claim relating to Luxora's website shall be governed by the laws of the operating country without regard to its conflict of law provisions.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
