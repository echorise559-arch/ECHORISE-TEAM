import useSEO from '../hooks/useSEO'
import LegalLayout from '../components/LegalLayout'

export default function RefundPolicyPage() {
  useSEO({
    title: 'Refund and Delivery Policy | Echorise Media',
    description: 'What qualifies for a top up or refund on an Echorise Media promotion campaign, the timeframe, and how to make a claim.',
    canonical: 'https://echorisemedia.com/refund-policy',
  })

  return (
    <LegalLayout label="Legal" title={<>Refund and <span className="grad-text">Delivery Policy</span></>} updated="January 2026">
      <p>
        This policy explains how campaign delivery works, what qualifies for
        a top up or refund, and how to make a claim. It applies to all
        packages ordered through the Echorise Media order form or invoice.
      </p>

      <h2>1. Delivery Timeframes</h2>
      <p>
        Each package lists an estimated timeframe for your campaign to go
        live, for example within 24 to 48 hours of payment confirmation. This
        is an estimate based on typical campaign setup and placement time,
        not a fixed guarantee, though we aim to meet it for every order. You
        will receive a confirmation email once your campaign has started.
      </p>

      <h2>2. What Is Guaranteed</h2>
      <p>
        We guarantee the listener, play, or reach volume stated in the
        package you purchased, delivered through real, genre matched
        listener networks within the agreed campaign period. We do not
        guarantee specific outcomes that are outside our control, such as
        chart placement, algorithmic playlist adds, or changes to a
        platform's internal analytics.
      </p>

      <h2>3. Top Ups</h2>
      <p>
        If a campaign does not reach the promised listener or reach volume
        within the agreed timeframe, we will extend the campaign at no extra
        charge until it reaches the promised volume. This is our standard
        first remedy for a shortfall.
      </p>

      <h2>4. Refunds</h2>
      <p>
        If we are unable to deliver the promised listener numbers or
        placements within a reasonable extended timeframe after a top up, or
        if you would prefer a refund instead of a top up, you may request a
        full or partial refund based on the portion of the campaign not
        delivered. Refunds are issued to the original payment method used for
        the order, and processing times can vary by payment provider.
      </p>
      <p>Refunds are not available in the following cases:</p>
      <ul>
        <li>the campaign has fully delivered the promised volume within the agreed timeframe</li>
        <li>the track link, artist page, or account was removed, made private, or taken down by you or the platform after the campaign started</li>
        <li>the request is based on platform metrics we do not control or guarantee, such as algorithmic exposure or chart position</li>
        <li>the order was for a custom campaign where delivery terms were agreed separately in writing, in which case those terms apply</li>
      </ul>

      <h2>5. How to Request a Top Up or Refund</h2>
      <p>
        Email <a href="mailto:support@echorisemedia.com">support@echorisemedia.com</a>{' '}
        with your invoice number, order details, and the reason for your
        request, or reach out through the WhatsApp button available across
        the site. We aim to respond within 24 hours and to resolve most
        requests within 7 business days of receiving the information we need.
      </p>

      <h2>6. Cancellations</h2>
      <p>
        If a campaign has not yet started, you can request a full refund by
        contacting us before your campaign goes live. Once a campaign has
        started, the sections above on top ups and refunds apply instead.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. The version in effect
        on the date your order was placed applies to that order.
      </p>
    </LegalLayout>
  )
}
