import useSEO from '../hooks/useSEO'
import LegalLayout from '../components/LegalLayout'

export default function TermsPage() {
  useSEO({
    title: 'Terms of Service | Echorise Media',
    description: 'The terms that govern use of the Echorise Media website and our music promotion and advertising services.',
    canonical: 'https://echorisemedia.com/terms',
  })

  return (
    <LegalLayout label="Legal" title={<>Terms of <span className="grad-text">Service</span></>} updated="January 2026">
      <p>
        These Terms of Service ("Terms") govern your access to and use of the
        website operated by Echorise Media, Inc. ("Echorise", "we", "us", or
        "our") and the music promotion and advertising services we provide. By
        placing an order, submitting the order form, or otherwise using our
        services, you agree to these Terms. If you do not agree, please do not
        use our services.
      </p>

      <h2>1. Who We Are</h2>
      <p>
        Echorise Media, Inc. is a California General Corporation operating as
        a music promotion and advertising agency. We help artists and labels
        reach listeners across platforms such as Spotify, SoundCloud, YouTube,
        Apple Music, and others, through genre matched targeting, playlist and
        channel placements, and related advertising and marketing activities.
        See our <a href="/legal">Company Information</a> page for our full
        registration details.
      </p>

      <h2>2. The Services</h2>
      <p>
        Our services consist of promotional and advertising campaigns designed
        to increase exposure for a track, artist, or release. The specific
        package, target listener volume, platform, and estimated timeframe for
        a campaign are the ones you select and confirm on the order form or in
        a written quote from us. Timeframes such as "within 24 to 48 hours" are
        estimates and not guaranteed delivery deadlines, though we work to meet
        them for every campaign.
      </p>
      <p>
        We do not use bots or fake accounts to generate activity. All
        promotional activity is directed toward real listener networks,
        channels, and communities. We do not control or guarantee any
        platform's internal algorithm, and we cannot guarantee chart
        placement, algorithmic playlist adds, or any specific change to a
        platform's internal analytics, since these are determined by the
        platform itself.
      </p>

      <h2>3. Orders and Payment</h2>
      <p>
        An order is confirmed once you submit the order form and complete
        payment through the payment link provided. Prices are shown in US
        dollars unless stated otherwise. We accept the payment methods listed
        on the order page at the time of your purchase. Campaigns begin after
        payment is confirmed and, where applicable, after we review the track
        link you provided.
      </p>

      <h2>4. Your Responsibilities</h2>
      <p>You agree that:</p>
      <ul>
        <li>the track link, artist details, and other information you submit are accurate and belong to you or that you have the rights to promote</li>
        <li>you will not use our services to promote content that infringes on someone else's copyright or other rights</li>
        <li>you are responsible for making sure your use of our services complies with the terms of service of the platform being promoted, such as Spotify or SoundCloud</li>
        <li>you will not ask us to use methods that violate a platform's terms of service, such as bots, click farms, or stream manipulation, and we will not provide these regardless of the request</li>
      </ul>

      <h2>5. Refunds and Delivery</h2>
      <p>
        Refunds, top ups, and delivery timeframes are covered in full in our{' '}
        <a href="/refund-policy">Refund and Delivery Policy</a>, which forms
        part of these Terms.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The Echorise name, logo, website design, and written content on this
        site belong to Echorise Media, Inc. and may not be copied or reused
        without our permission. You retain all rights to your own music,
        artwork, and branding submitted to us for a campaign, and you grant us
        a limited right to use that material only to carry out the campaign
        you ordered.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        Our services are promotional and advertising services, not a
        guarantee of commercial outcomes such as revenue, streaming royalties,
        or a specific career result. To the fullest extent permitted by law,
        Echorise Media, Inc. is not liable for indirect, incidental, or
        consequential damages arising from your use of our services. Our
        total liability for any claim will not exceed the amount you paid for
        the specific campaign giving rise to the claim.
      </p>

      <h2>8. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Changes take effect once
        posted on this page. Continuing to use our services after an update
        means you accept the revised Terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these Terms can be sent to{' '}
        <a href="mailto:support@echorisemedia.com">support@echorisemedia.com</a>{' '}
        or through the WhatsApp button available across the site.
      </p>
    </LegalLayout>
  )
}
