import Container from '@/components/layout/container';
import { HeaderSection } from '@/components/shared/header-section';
import { Card, CardContent } from '@/components/ui/card';

type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  afterItems?: string[];
};

function LegalDocument({
  title,
  sections,
}: {
  title: string;
  sections: LegalSection[];
}) {
  const effectiveDate = new Date().toISOString().slice(0, 10);

  return (
    <Container className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <HeaderSection
          subtitle={title}
          subtitleAs="h1"
          className="mb-8"
          subtitleClassName="text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
        />
        <Card>
          <CardContent className="p-6 sm:p-10">
            <article className="prose prose-neutral max-w-none dark:prose-invert">
              <p>Effective Date: {effectiveDate}</p>
              {sections.map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items ? (
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.afterItems?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </article>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

const privacySections: LegalSection[] = [
  {
    title: '1. Information We Collect',
    items: [
      'Usage and analytics data: We use analytics tools (such as Google Analytics) that may collect IP address (truncated or pseudonymized per provider settings), device and browser information, approximate location, pages viewed, and interactions to understand how the Service is used.',
      'Local storage data: We store certain preferences locally in your browser (e.g., theme, language, and simulator session data) to improve your experience. This data generally does not leave your device.',
      'Voluntary communications: If you contact us, we receive the information you provide (e.g., your email address and message content).',
    ],
  },
  {
    title: '2. How We Use Information',
    items: [
      'Operate, maintain, and improve the Service.',
      'Monitor performance, reliability, and usage patterns.',
      'Detect, prevent, or address security and technical issues.',
      'Respond to your communications and support requests.',
    ],
  },
  {
    title: '3. Sharing of Information',
    items: [
      'Service providers and analytics: We may share limited information with service providers, such as analytics platforms, solely to help us operate and improve the Service. These providers process data on our behalf in accordance with their privacy terms.',
      'Legal and safety: We may disclose information when required by law or when we believe it is necessary to protect the rights, safety, or property of users, the public, or the Service.',
      'We do not sell your personal information.',
    ],
  },
  {
    title: '4. Cookies and Local Storage',
    paragraphs: [
      'We use cookies or similar technologies (e.g., localStorage) to remember preferences (such as theme and language) and to enable core functionality. You can control cookies at the browser level; disabling cookies may affect certain features.',
    ],
  },
  {
    title: '5. Data Retention',
    paragraphs: [
      'Analytics data is retained per the policies of our analytics providers. Locally stored preferences remain on your device until you clear your browser data or remove them. We retain communications for as long as needed to address your inquiry and as required by law.',
    ],
  },
  {
    title: '6. Your Choices',
    items: [
      'You may disable or clear cookies and local storage through your browser settings.',
      'You may contact us to request deletion of communications you have sent to us, where feasible.',
      'Some browsers and devices offer privacy settings (e.g., Do Not Track); our behavior may vary by provider.',
    ],
  },
  {
    title: '7. International Transfers',
    paragraphs: [
      'Information may be processed in countries other than your own. We take steps designed to ensure appropriate protections consistent with applicable laws.',
    ],
  },
  {
    title: '8. Security',
    paragraphs: [
      'We use reasonable administrative, technical, and organizational measures designed to protect information. However, no method of transmission or storage is completely secure.',
    ],
  },
  {
    title: '9. Children’s Privacy',
    paragraphs: [
      'The Service is not directed to children under the age where parental consent is required under applicable law. If you believe we have collected information from a child in violation of applicable law, please contact us so we can take appropriate action.',
    ],
  },
  {
    title: '10. Changes to This Policy',
    paragraphs: [
      'We may update this Policy from time to time. Material changes will be indicated by updating the “Effective Date” above. Your continued use of the Service after changes take effect constitutes acceptance of the updated Policy.',
    ],
  },
  {
    title: '11. Contact',
    paragraphs: ['Questions about privacy? Contact us at jinmazk@gmail.com.'],
  },
];

const userAgreementSections: LegalSection[] = [
  {
    title: '1. Nature of the Service',
    paragraphs: [
      'ChartMini is an educational trading simulator. It provides simulated charts and interactions intended solely for learning and practice. It does not provide brokerage services, order execution, or the ability to place real trades.',
    ],
  },
  {
    title: '2. No Investment or Financial Advice',
    paragraphs: [
      'The Service is for informational and educational purposes only and does not constitute investment, financial, legal, tax, or other professional advice. You are solely responsible for any decisions you make. Past simulated performance does not guarantee future results.',
    ],
  },
  {
    title: '3. Eligibility and Acceptable Use',
    items: [
      'You must use the Service in compliance with all applicable laws and regulations.',
      'Do not attempt to interfere with or disrupt the Service or its infrastructure.',
      'Do not use the Service to harass, abuse, or harm others, or to engage in fraudulent activity.',
      'Do not reverse engineer, copy, or misuse any part of the Service beyond permitted use.',
    ],
  },
  {
    title: '4. Data and Accuracy',
    paragraphs: [
      'Market data, prices, and other information may be delayed, incomplete, simulated, or inaccurate. The Service is provided on an “as is” and “as available” basis without any warranty as to accuracy, timeliness, completeness, or fitness for a particular purpose.',
    ],
  },
  {
    title: '5. Intellectual Property',
    paragraphs: [
      'The Service, including its content, design, and software, is protected by intellectual property laws. You may use the Service only as permitted by this Agreement and applicable law. All rights not expressly granted are reserved.',
    ],
  },
  {
    title: '6. Prohibited Commercial Use',
    paragraphs: [
      'You may not use any part of the content on this website, including but not limited to charts, data, graphics, and analysis tools, for commercial purposes without first obtaining the necessary license from the respective rights holders. This includes, but is not limited to:',
    ],
    items: [
      'Reproducing, redistributing, or reselling any charts or market data displayed on this Service.',
      'Using screenshots, recordings, or exports from the Service in commercial publications, reports, or products.',
      'Incorporating any part of the Service into commercial software, applications, or services.',
    ],
    afterItems: [
      'For any commercial use inquiries, please contact us to discuss licensing options.',
    ],
  },
  {
    title: '7. Disclaimer of Warranties',
    paragraphs: [
      'To the maximum extent permitted by law, ChartMini disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. ChartMini does not warrant that the Service will be uninterrupted, error-free, secure, or free from harmful components.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by law, ChartMini and its owners, contributors, and affiliates will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or any loss of profits, revenues, data, or goodwill, arising from or related to your use of the Service. Some jurisdictions do not allow certain limitations; in such cases, this clause applies only to the extent permitted by applicable law.',
    ],
  },
  {
    title: '9. Changes to the Service and Agreement',
    paragraphs: [
      'We may modify the Service and/or this Agreement from time to time. Material changes will be indicated by updating the “Effective Date” above. Continued use after changes take effect constitutes your acceptance of the updated Agreement.',
    ],
  },
  {
    title: '10. Termination',
    paragraphs: [
      'We may suspend or terminate access to the Service at any time for any reason, including violations of this Agreement. You may stop using the Service at any time.',
    ],
  },
  {
    title: '11. Contact',
    paragraphs: [
      'Questions about this Agreement? Contact us at jinmazk@gmail.com.',
    ],
  },
];

export function PrivacyPolicyPage() {
  return <LegalDocument title="Privacy Policy" sections={privacySections} />;
}

export function UserAgreementPage() {
  return (
    <LegalDocument title="User Agreement" sections={userAgreementSections} />
  );
}
