import React from 'react';
import { HiShieldCheck } from 'react-icons/hi';

const PrivacyPolicy = () => {
  return (
    <div className="bg-bg-dark min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <HiShieldCheck className="text-accent-gold text-5xl mx-auto mb-6 opacity-80" />
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Privacy <span className="italic font-light text-gradient-gold">Policy</span></h1>
          <p className="text-text-secondary text-xs uppercase tracking-[0.3em] font-light opacity-60">Your Privacy is Our Priority</p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-8 md:p-12 backdrop-blur-xl space-y-8 text-text-secondary font-light leading-relaxed">
          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">1. Introduction</h2>
            <p>Welcome to Luxora. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Identity Data includes first name, last name, username or similar identifier.</li>
              <li>Contact Data includes email address and telephone numbers.</li>
              <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
              <li>Transaction Data includes details about payments to and from you and other details of products you have purchased from us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To register you as a new customer.</li>
              <li>To process and deliver your order.</li>
              <li>To manage our relationship with you.</li>
              <li>To improve our website, products/services, marketing or customer relationships.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">5. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: privacy@luxora.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
