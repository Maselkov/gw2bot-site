<template>
  <main>
    <div class="page-width page-padding">
      <header>
        <h1>GW2Bot Terms of Service</h1>

        <p>Last Updated: August 13, 2022</p>
      </header>

      <BotDescription />

      <p>These Terms of Service (&ldquo;Terms&rdquo;) are a binding contract between GW2Bot (&ldquo;We&rdquo;, &ldquo;Us&rdquo; and &ldquo;Our&rdquo;) and You as the user of Our Website or GW2Bot (Our &ldquo;Services&rdquo;). By using Our Services, You agree to be bound by these Terms and Our <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>, which You should also&nbsp;read. If You do not accept all of these Terms, then You may not use Our&nbsp;Services.</p>

      <p>We may modify these Terms for any reason at any time by posting a new version on Our Website; these changes do not affect rights and obligations that applied prior to such&nbsp;changes. Your continued use of Our Services following the posting of modified Terms will be subject to the Terms in effect at the time of Your&nbsp;use. Please review these Terms periodically for&nbsp;changes. If You object to any provision of these Terms, or any subsequent modifications to these Terms, or become dissatisfied with Our Services in any way, Your only recourse is to immediately terminate Your usage of Our&nbsp;Services.</p>

      <h2>Our Services</h2>

      <p>You will only use Our Services for Your own use, and not on behalf of, or for the benefit of any third party, and only in a manner that complies with all laws that apply to&nbsp;You. If Your use of Our Services is prohibited by applicable laws, then You aren&rsquo;t authorised to use Our&nbsp;Services. We cannot and will not be responsible for You using Our Services in a way that breaks the&nbsp;law.</p>

      <p>We are also free to terminate (or suspend access to) Your use of Our Services for any reason in Our discretion, including Your breach of these&nbsp;Terms. We have the sole right to decide whether You are in violation of any of the restrictions set forth in these&nbsp;Terms. Termination of Our Services will result in the destruction of any data associated with Your Discord account, as per <ExternalLink href="https://gdpr-info.eu/">GDPR guidelines</ExternalLink> and our <NuxtLink to="/privacy-policy">Privacy&nbsp;Policy</NuxtLink>.</p>

      <p>If a dispute occurs between users of Our Services, or between users and any third party, We are under no obligation to become&nbsp;involved. In the event that You have a dispute with any third party or other users, You release Us from any and all claims, demands, and damages arising out of or in any way related to such disputes and/or Our&nbsp;Services.</p>

      <h2>External Services</h2>

      <p>Our Services contain links and connections to third-party websites and services (&ldquo;External Services&rdquo;) that are not owned or controlled by&nbsp;Us. When You access External Services, You accept that there are risks in doing so, and that We are not responsible for such&nbsp;risks. We have no control over, and assume no responsibility for the content, policies, practices, or opinions of any third party that You interact with through Our&nbsp;Services. In addition, We cannot and will not monitor, verify, censor or edit the content of any External&nbsp;Services. We encourage You to be aware when You leave Our Services and to read the terms and conditions and policies of each External Service that You visit or&nbsp;utilise. By using Our Services, You hold Us harmless to any and all liability arising from Your use of any External&nbsp;Services.</p>

      <p>Your interactions with External Services found via Our Services are solely between You and such External&nbsp;Services. You should investigate as necessary before proceeding with any transaction with any of these External&nbsp;Services. You agree that We shall not be responsible or liable for any loss or damage incurred as a result of any such&nbsp;dealings.</p>

      <h2>Disclaimer</h2>

      <p>Our Services use images and icons which are copyright &copy;&nbsp;NCSOFT&nbsp;Corporation.<br>Please read the <ExternalLink href="https://us.ncsoft.com/legal/ncsoft/content-terms-of-use">NCSoft Content Terms of Use</ExternalLink> for further&nbsp;information.</p>

      <h2>How to Contact Us</h2>

      <p>We are not an organisation or registered company, and therefore We do not have a business address, public email, or telephone&nbsp;number; the best way to contact Us is via the <ExternalLink :href="$supportServerLink">GW2Bot Discord&nbsp;Server</ExternalLink>.</p>
    </div>
  </main>
</template>

<script>
import BotDescription from '@/components/bot-description.vue'
import metadata from '@/assets/js/metadata'

export default defineNuxtComponent({
  name: 'TermsOfServicePage',
  components: {
    BotDescription
  },
  head () {
    return metadata({
      title: 'Terms of Service | GW2Bot',
      description: 'GW2Bot terms of service'
    })
  }
})
</script>
