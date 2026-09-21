import useSEO from '../hooks/useSEO'
import LegalLayout from '../components/LegalLayout'

export default function LegalInfoPage() {
  useSEO({
    title: 'Company Information | Echorise Media',
    description: 'Legal and registration details for Echorise Media, Inc., including entity type, registration number and official verification link.',
    canonical: 'https://echorisemedia.com/legal',
  })

  return (
    <LegalLayout label="Legal Notice" title={<>Company <span className="grad-text">Information</span></>}>
      <p>
        This page provides the legal and registration details for the company operating
        the Echorise Media website and services, in line with standard legal notice
        requirements.
      </p>

      <h2>Legal Name</h2>
      <p><strong>Echorise Media, Inc.</strong></p>

      <h2>Entity Type</h2>
      <p>California General Corporation</p>

      <h2>Registration Number</h2>
      <p>Document No. 6441368, filed with the California Secretary of State.</p>

      <h2>Verify Our Registration</h2>
      <p>
        You can confirm this registration directly with the California Secretary of
        State's business search rather than relying on this page alone. Search for
        "Echorise Media, Inc." or enter Document No. 6441368.
      </p>
      <p>
        <a href="https://bizfileonline.sos.ca.gov/search/business" target="_blank" rel="noopener noreferrer">
          California Secretary of State Business Search
        </a>
      </p>

      <h2>Contact</h2>
      <p>
        Email: <a href="mailto:support@echorisemedia.com">support@echorisemedia.com</a>
      </p>
      <p>
        For faster responses, you can also reach us on WhatsApp using the chat button
        found across the site.
      </p>

      <h2>Related Policies</h2>
      <p>
        See our <a href="/terms">Terms of Service</a>,{' '}
        <a href="/privacy">Privacy Policy</a>, and{' '}
        <a href="/refund-policy">Refund and Delivery Policy</a> for the terms that
        govern use of this website and our services.
      </p>
    </LegalLayout>
  )
}
