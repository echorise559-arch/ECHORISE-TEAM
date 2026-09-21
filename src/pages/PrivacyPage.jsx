import useSEO from '../hooks/useSEO'
import LegalLayout from '../components/LegalLayout'

export default function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy | Echorise Media',
    description: 'How Echorise Media collects, uses, and protects the personal information of artists and visitors who use our music promotion services.',
    canonical: 'https://echorisemedia.com/privacy',
  })

  return (
    <LegalLayout label="Legal" title={<>Privacy <span className="grad-text">Policy</span></>} updated="January 2026">
      <p>
        Echorise Media, Inc. ("Echorise", "we", "us", or "our") respects your
        privacy. This Privacy Policy explains what information we collect
        when you use our website and music promotion services, how we use it,
        and the choices you have. It applies to visitors, artists, and
        clients located in any country, including the European Union, the
        United Kingdom, and elsewhere.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect the following types of information:</p>
      <ul>
        <li><strong>Contact information</strong> you give us directly, such as your name, artist or stage name, email address, and country, when you submit the order form, contact form, or an invoice request</li>
        <li><strong>Campaign information</strong> such as track links, platform, package selected, target country or genre, and any notes you add about your campaign</li>
        <li><strong>Communications</strong> you send us by email, the contact form, WhatsApp, or Telegram</li>
        <li><strong>Technical information</strong> collected automatically, such as pages visited, general location by country, browser type, and referring links, used for basic analytics and to keep the site secure</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>set up, run, and report on the promotion campaign you ordered</li>
        <li>send order confirmations, invoices, campaign updates, and receipts</li>
        <li>respond to support requests and messages</li>
        <li>maintain records for accounting and legal purposes</li>
        <li>improve our website and services</li>
      </ul>
      <p>
        We do not sell your personal information. We do not use your track
        links or campaign notes for anything other than delivering and
        reporting on your campaign.
      </p>

      <h2>3. How We Share Information</h2>
      <p>
        We share information only where needed to run our business, and
        always under confidentiality or data protection commitments where
        applicable:
      </p>
      <ul>
        <li>with service providers who help us operate the site and send communications, such as our email delivery provider and payment processors</li>
        <li>with promotion partners, channels, and networks only to the extent needed to place your campaign, and only the campaign details relevant to that placement</li>
        <li>where required by law, such as in response to a valid legal request</li>
      </ul>

      <h2>4. Data Retention</h2>
      <p>
        We keep order, invoice, and communication records for as long as
        needed to provide our services, meet accounting and legal
        obligations, and resolve any disputes. You can ask us to delete
        personal information that is no longer required to be kept, as
        described in Section 6 below.
      </p>

      <h2>5. International Transfers</h2>
      <p>
        Because our artists and listener networks are based in many
        countries, your information may be processed in countries other than
        your own, including the United States. Where required, we take
        reasonable steps to protect information transferred internationally.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Depending on where you live, you may have the right to access,
        correct, delete, or export your personal information, and to object
        to or restrict certain uses of it. To exercise any of these rights,
        contact us at{' '}
        <a href="mailto:support@echorisemedia.com">support@echorisemedia.com</a>.
        We will respond within a reasonable timeframe.
      </p>

      <h2>7. Cookies and Similar Technologies</h2>
      <p>
        Our website may use cookies or similar technologies for basic
        functionality and analytics. You can control cookies through your
        browser settings. Blocking cookies may affect some site features.
      </p>

      <h2>8. Children's Privacy</h2>
      <p>
        Our services are intended for artists, labels, and businesses, and
        are not directed at children. We do not knowingly collect personal
        information from children.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The updated
        version will be posted on this page with a new "last updated" date.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        For any privacy related question or request, email{' '}
        <a href="mailto:support@echorisemedia.com">support@echorisemedia.com</a>{' '}
        or reach out through the WhatsApp button available across the site.
      </p>
    </LegalLayout>
  )
}
