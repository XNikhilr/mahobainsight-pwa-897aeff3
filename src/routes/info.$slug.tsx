import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";

const PWA_NOTE = (
  <>
    <hr />
    <h3>About this app</h3>
    <p>
      This app is the official Progressive Web App (PWA) of{" "}
      <strong>Mahoba Insight</strong>. It runs directly in your browser and can
      be installed to your home screen for a fast, app-like experience — no Play
      Store or App Store download required. All content, comments and
      submissions made through the app are governed by the same policies as our
      website <a href="https://www.mahobainsight.in">mahobainsight.in</a>.
    </p>
  </>
);

const LAST_UPDATED = "30 July 2025";

const PAGES: Record<string, { title: string; body: ReactNode }> = {
  about: {
    title: "About Us",
    body: (
      <>
        <p>
          <strong>Mahoba Insight</strong>, founded in 2022, is a digital media
          platform dedicated to uncovering and showcasing the rich yet often
          forgotten heritage of Mahoba and the greater Bundelkhand region. Our
          mission is to bring local stories to the forefront, empower citizen
          journalism, and raise awareness of the social, cultural and
          historical significance of this land.
        </p>
        <p>
          We strive to amplify voices from the ground and report issues that
          truly matter to the people of Mahoba and Bundelkhand. Through a blend
          of reliable reporting, ground coverage and storytelling in both{" "}
          <strong>Hindi and English</strong>, we connect with audiences across
          India and the global Hindi-speaking diaspora.
        </p>
        <p>
          <strong>Mahoba Insight</strong> is wholly owned and operated under{" "}
          <strong>Bundelkhand Insight Digital</strong>, a registered MSME news
          agency. We are committed to ethical journalism, fact-based reporting
          and transparency in everything we publish.
        </p>
        <h3>Meet Our Team</h3>
        <ul>
          <li>
            <strong>Nitendra Jha</strong> — Founder &amp; Editor-in-Chief. A
            senior journalist from Mahoba with over 15 years of experience in
            journalism, bringing deep understanding of regional issues and media
            ethics.
          </li>
          <li>
            <strong>Nikhil Jha</strong> — Editor. A digital content strategist
            committed to innovative reporting and community-driven journalism.
          </li>
          <li>
            <strong>Janki Vishwakarma</strong> — Research Journalist. Dedicated
            to in-depth research and insightful analysis on socio-cultural and
            historical topics related to Mahoba and Bundelkhand.
          </li>
          <li>
            <strong>Mr. Chandrasekhar Sankar</strong> — Legal Advisor. Providing
            legal guidance and ensuring content compliance for Mahoba Insight
            and Bundelkhand Insight Digital.
          </li>
        </ul>
        <p>
          We believe in responsible journalism that respects facts, encourages
          participation, and makes unheard stories visible to the world.
        </p>
        {PWA_NOTE}
      </>
    ),
  },
  contact: {
    title: "Contact Us",
    body: (
      <>
        <p><em>Get in touch with us — we look forward to hearing from you.</em></p>
        <p>
          If you have any issue or query regarding content published on our
          platforms, kindly report or contact us at{" "}
          <a href="mailto:support@mahobainsight.in">support@mahobainsight.in</a>{" "}
          or use the details below.
        </p>
        <h3>Reach us</h3>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@mahobainsight.in">support@mahobainsight.in</a>
          <br />
          <strong>Address:</strong> 1-A Mahoba Insight, JeekariyPeer, Near
          Railway Station, Mahoba, Uttar Pradesh 210427, India
          <br />
          <strong>Legal Jurisdiction:</strong> Mahoba, U.P. (Allahabad High
          Court)
        </p>
        <h3>Our other platforms</h3>
        <ul>
          <li>Bundelkhand Insight</li>
          <li>Mahoba News Network</li>
        </ul>
        {PWA_NOTE}
      </>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
        <p><em>Last updated: {LAST_UPDATED}</em></p>
        <p>
          This Privacy Policy outlines how <strong>Mahoba Insight</strong>,
          operated by <strong>Bundelkhand Insight Digital</strong>, collects,
          uses, stores and protects your information when you access or use our
          website and services.
        </p>
        <h3>1. Information We Collect</h3>
        <p>We collect the following personal data, only when voluntarily provided by you:</p>
        <ul><li>Name</li><li>Email address</li><li>Mobile number</li></ul>
        <p>We may also collect non-personal information such as IP address, browser type and usage behaviour through cookies and analytics tools.</p>
        <h3>2. How We Use Your Information</h3>
        <ul>
          <li>To send newsletters or updates (with your consent)</li>
          <li>To process donations or subscription payments</li>
          <li>To contact you regarding your submissions, feedback or account</li>
          <li>To improve our services and website functionality</li>
          <li>To comply with legal obligations</li>
        </ul>
        <h3>3. Cookies and Tracking Technologies</h3>
        <p>Mahoba Insight uses cookies and analytics tools (like Google Analytics) to gather non-identifiable information about how users interact with our site. You can control or disable cookies through your browser settings; disabling them may affect your experience.</p>
        <h3>4. Third-Party Services</h3>
        <p>We may use trusted third-party services (e.g. payment gateways, advertising networks) that collect, store or process user data on our behalf. We ensure these services follow industry-standard data protection practices.</p>
        <h3>5. Data Sharing and Disclosure</h3>
        <p>We do not sell, trade or rent your personal information. We may disclose your information if required by law or in response to valid legal processes such as a court order, or to protect the rights and property of Mahoba Insight and its users.</p>
        <h3>6. User-Generated Content</h3>
        <p>If you choose to post content on our website (such as comments, news tips or feedback), please be aware that this information may become public and can be read, collected or used by other users.</p>
        <h3>7. Security Measures</h3>
        <p>We implement reasonable technical and organisational measures to protect your personal data from unauthorised access, loss or misuse. No method of transmission over the Internet is 100% secure.</p>
        <h3>8. International Visitors</h3>
        <p>Our platform is accessible worldwide. If you access Mahoba Insight from outside India, your data will be processed and stored in India under Indian laws and regulations.</p>
        <h3>9. Your Rights and Choices</h3>
        <ul>
          <li>Request access to your personal data</li>
          <li>Request correction or deletion of your data</li>
          <li>Withdraw consent at any time (e.g. unsubscribe from newsletters)</li>
        </ul>
        <h3>10. Links to Other Sites</h3>
        <p>Our site may contain links to external websites. We are not responsible for the privacy practices or content of these sites.</p>
        <h3>11. Updates to This Policy</h3>
        <p>We may update this Privacy Policy from time to time. All changes will be posted on this page with the date of the last revision.</p>
        <h3>12. Contact Us</h3>
        <p>
          <strong>Mahoba Insight</strong>, operated by <strong>Bundelkhand Insight Digital</strong><br />
          1-A Mahoba Insight, JeekariyPeer, Near Railway Station, Mahoba, Uttar Pradesh 210427, India<br />
          <a href="mailto:support@mahobainsight.in">support@mahobainsight.in</a>
        </p>
        {PWA_NOTE}
      </>
    ),
  },
  terms: {
    title: "Terms and Conditions",
    body: (
      <>
        <p><em>Last updated: {LAST_UPDATED}</em></p>
        <p>These Terms and Conditions ("Agreement") govern your use of <strong>Mahoba Insight</strong> ("we", "us", "our", or "the website"). This website is owned and operated by <strong>Bundelkhand Insight Digital</strong>, a sole proprietorship registered under MSME, India.</p>
        <p>By accessing or using Mahoba Insight, you agree to comply with and be legally bound by these Terms and Conditions, our Privacy Policy, and any other guidelines we post. If you do not agree, please refrain from using the website.</p>
        <h3>1. Definitions</h3>
        <ul>
          <li><strong>"User", "you", "your"</strong> — any individual or entity accessing or using the website.</li>
          <li><strong>"Content"</strong> — articles, posts, videos, images, graphics, documents and user submissions.</li>
        </ul>
        <h3>2. Eligibility</h3>
        <p>You must be at least 13 years old to use Mahoba Insight. If you are under 18, you must access the website under parental guidance or legal supervision.</p>
        <h3>3. User Obligations</h3>
        <ul>
          <li>Not to use the website for any unlawful purpose.</li>
          <li>To provide accurate and truthful information where applicable.</li>
          <li>Not to interfere with the website's functioning or security.</li>
          <li>Not to upload or transmit any viruses, malware or malicious code.</li>
        </ul>
        <h3>4. Intellectual Property Rights</h3>
        <p>All original content on Mahoba Insight is the intellectual property of Bundelkhand Insight Digital unless stated otherwise. You may not reproduce, republish, modify, copy, sell or distribute our content, reprint or archive it, or use our logo, name or branding without prior written permission.</p>
        <h3>5. User-Generated Content</h3>
        <p>By submitting news, photos, tips, comments or other materials you grant us a worldwide, non-exclusive, royalty-free license to use, publish and display the content; confirm you own or have the right to submit it; and acknowledge that we may remove, edit or moderate submissions as needed.</p>
        <h3>6. Payments and Donations</h3>
        <p>We may offer premium features and accept donations. All payments must be made through secure gateways. We do not store payment information. Refunds or cancellations (if any) are governed by a separate Donation &amp; Payment Policy.</p>
        <h3>7. Third-Party Links and Ads</h3>
        <p>Our platform may contain advertisements or links to third-party websites. We do not endorse or assume responsibility for external content or services.</p>
        <h3>8. Disclaimers</h3>
        <p>All content is for <strong>general informational purposes only</strong>. We do not guarantee completeness, accuracy or timeliness, and do not provide legal, medical or financial advice. Mahoba Insight is not liable for losses due to reliance on our content, interruptions, downtime, data loss, or harm caused by user interactions or third-party actions.</p>
        <h3>9. Data Collection and Privacy</h3>
        <p>We collect only basic user information — name, email address and mobile number — voluntarily provided in specific cases such as newsletter subscription, comments or donations. See our Privacy Policy for details.</p>
        <h3>10. Account Termination</h3>
        <p>We reserve the right to suspend or delete user accounts at our discretion, and to restrict access to certain services or features without prior notice.</p>
        <h3>11. Jurisdiction and Governing Law</h3>
        <p>This Agreement is governed by the laws of <strong>India</strong>. All disputes shall be subject to the jurisdiction of the competent courts at <strong>Mahoba, Uttar Pradesh</strong>, under the <strong>Allahabad High Court</strong>.</p>
        <h3>12. Changes to These Terms</h3>
        <p>We may revise these Terms and Conditions from time to time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
        <h3>13. Contact Information</h3>
        <p>
          <strong>Mahoba Insight</strong>, operated by <strong>Bundelkhand Insight Digital</strong><br />
          1-A Mahoba Insight, JeekariyPeer, Near Railway Station, Mahoba, Uttar Pradesh 210427, India<br />
          <a href="mailto:support@mahobainsight.in">support@mahobainsight.in</a>
        </p>
        {PWA_NOTE}
      </>
    ),
  },
};

export const Route = createFileRoute("/info/$slug")({
  head: ({ params }) => {
    const page = PAGES[params.slug];
    const title = page ? `${page.title} — Mahoba Insight` : "Mahoba Insight";
    return { meta: [{ title }, { name: "description", content: page?.title ?? "Mahoba Insight" }] };
  },
  loader: ({ params }) => {
    if (!PAGES[params.slug]) throw notFound();
    return null;
  },
  component: InfoPage,
  notFoundComponent: () => (
    <AppShell><div className="p-10 text-center text-muted-foreground">Page not found.</div></AppShell>
  ),
  errorComponent: () => (
    <AppShell><div className="p-10 text-center text-muted-foreground">Something went wrong.</div></AppShell>
  ),
});

function InfoPage() {
  const { slug } = Route.useParams();
  const page = PAGES[slug]!;
  return (
    <AppShell>
      <div className="sticky top-14 z-30 flex items-center gap-2 border-b border-border/60 bg-background/85 px-2 py-2 backdrop-blur-xl">
        <Link to="/" aria-label="Back" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{page.title}</div>
      </div>
      <div className="px-5 py-6">
        <h1 className="font-serif text-3xl font-black leading-tight tracking-tight">{page.title}</h1>
        <div className="prose prose-neutral dark:prose-invert mt-5 max-w-none font-serif prose-a:text-primary" style={{ lineHeight: 1.7 }}>
          {page.body}
        </div>
      </div>
    </AppShell>
  );
}