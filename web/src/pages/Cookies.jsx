import React from 'react';
import { HiOutlineDatabase } from 'react-icons/hi';

const Cookies = () => {
  return (
    <div className="bg-bg-dark min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <HiOutlineDatabase className="text-accent-gold text-5xl mx-auto mb-6 opacity-80" />
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Cookie <span className="italic font-light text-gradient-gold">Policy</span></h1>
          <p className="text-text-secondary text-xs uppercase tracking-[0.3em] font-light opacity-60">How We Use Cookies</p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-8 md:p-12 backdrop-blur-xl space-y-8 text-text-secondary font-light leading-relaxed">
          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">1. What Are Cookies</h2>
            <p>Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.</p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">2. How Luxora Uses Cookies</h2>
            <p>When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To enable certain functions of the Service.</li>
              <li>To provide analytics.</li>
              <li>To store your preferences.</li>
              <li>To enable delivery of advertisements, including behavioral advertising.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">3. Types of Cookies We Use</h2>
            <p>We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Essential cookies. We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
              <li>Preferences cookies. We may use preferences cookies to remember information that changes the way the Service behaves or looks.</li>
              <li>Analytics cookies. We may use analytics cookies to track information how the Service is used so that we can make improvements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4 tracking-wide">4. Your Choices Regarding Cookies</h2>
            <p>If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
