import Link from "next/link";
import Image from "next/image";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="border-x border-border/60 max-w-4xl mx-auto w-full">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 bg-background/80 backdrop-blur-md border-b border-border/60">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/web-logo.png"
              alt="Billo"
              width={32}
              height={32}
              className="object-contain"
            />
          </Link>
        </nav>

        {/* Content */}
        <div className="px-4 md:px-6 py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="space-y-4 border-b border-border/60 pb-8">
              <h1 className="text-h1 md:text-[48px] font-semibold text-foreground tracking-[-0.03em]">
                Privacy Policy
              </h1>
              <p className="text-body text-muted-foreground">
                Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Introduction */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Introduction
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                At Billo, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our bill splitting service ("Service").
              </p>
              <p className="text-body text-muted-foreground leading-relaxed">
                By using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Information We Collect
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                We collect information that you provide directly to us and information that is automatically collected when you use our Service.
              </p>

              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                    Account Information
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    When you create an account, we collect your email address, name (if provided), and profile picture (if provided). This information is necessary to create and manage your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                    Receipt and Transaction Information
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    When you use our Service to split bills, we collect information from receipts you upload, including images, merchant information, purchase dates, items purchased, and amounts. This information is used to calculate and track expenses and settlements between group members.
                  </p>
                </div>

                <div>
                  <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                    Group and Social Information
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    When you create or join groups, we collect group names, descriptions, and information about group memberships. This allows you to split expenses with specific people.
                  </p>
                </div>

                <div>
                  <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                    Payment and Subscription Information
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    If you subscribe to our premium service, we collect payment information through our third-party payment processor. We do not store your full payment card details on our servers.
                  </p>
                </div>

                <div>
                  <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                    Usage Information
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    We automatically collect certain information about how you use our Service, such as the features you access and the frequency of use. This helps us improve our Service and enforce usage limits.
                  </p>
                </div>

                <div>
                  <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                    Preferences
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    We store your preferences, including currency settings and email notification preferences, to personalize your experience.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                How We Use Your Information
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 text-body text-muted-foreground ml-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process your receipts and calculate expense splits</li>
                <li>Facilitate communication between group members</li>
                <li>Send you important updates, notifications, and summaries related to your expenses</li>
                <li>Process payments and manage subscriptions</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and enforce our terms of service</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Information Sharing and Disclosure
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:
              </p>

              <div className="space-y-4 mt-6">
                <div>
                  <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                    With Other Users
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    When you add receipts to a group, the information in those receipts (including items and amounts) is visible to all members of that group. Your email address may be visible to group members for the purpose of group invitations and communication.
                  </p>
                </div>

                <div>
                  <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                    With Service Providers
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    We work with third-party service providers who help us operate our Service, including cloud storage providers, payment processors, email delivery services, and authentication services. These providers are contractually obligated to protect your information and use it only for the purposes we specify.
                  </p>
                </div>

                <div>
                  <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                    For Legal Reasons
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, property, or safety, or that of our users or others.
                  </p>
                </div>

                <div>
                  <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                    Business Transfers
                  </h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Data Security
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 text-body text-muted-foreground ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
              </ul>
              <p className="text-body text-muted-foreground leading-relaxed mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Your Rights and Choices
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 text-body text-muted-foreground ml-4">
                <li><strong>Access:</strong> You can access and review your personal information through your account settings</li>
                <li><strong>Correction:</strong> You can update or correct your personal information at any time through your account settings</li>
                <li><strong>Deletion:</strong> You can delete your account at any time, which will result in the permanent deletion of your personal information and associated data</li>
                <li><strong>Email Preferences:</strong> You can opt out of certain email communications by using the unsubscribe links in our emails or adjusting your preferences in your account settings</li>
                <li><strong>Data Portability:</strong> You may request a copy of your data in a portable format</li>
              </ul>
              <p className="text-body text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </section>

            {/* Data Retention */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Data Retention
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide you with our Service. When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal, regulatory, or legitimate business purposes.
              </p>
              <p className="text-body text-muted-foreground leading-relaxed mt-4">
                Some information may remain in our backup systems for a limited period after account deletion, but will not be accessible through our Service.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Third-Party Services
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                Our Service integrates with third-party services for authentication, payment processing, cloud storage, email delivery, and other functions. These services have their own privacy policies governing how they handle your information. We encourage you to review their privacy policies:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 text-body text-muted-foreground ml-4">
                <li>Authentication services (Clerk)</li>
                <li>Cloud storage providers (Cloudinary)</li>
                <li>Payment processors (Polar.sh)</li>
                <li>Email delivery services (Resend)</li>
                <li>AI and machine learning services (Google Gemini via Vercel AI SDK)</li>
              </ul>
              <p className="text-body text-muted-foreground leading-relaxed mt-4">
                We are not responsible for the privacy practices of these third-party services. Your use of these services is subject to their respective privacy policies.
              </p>
            </section>

            {/* Mobile Applications */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Mobile Applications
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                If you use our Service through a mobile application, this Privacy Policy applies to your use of the mobile app as well. Mobile applications may request certain permissions (such as camera access for receipt scanning) that are necessary for the app to function properly. You can manage these permissions through your device settings.
              </p>
              <p className="text-body text-muted-foreground leading-relaxed mt-4">
                We may send push notifications to your mobile device. You can opt out of push notifications by adjusting your device settings or app preferences.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Children's Privacy
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
              </p>
            </section>

            {/* International Users */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                International Data Transfers
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our Service, you consent to the transfer of your information to these countries.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="space-y-4 border-b border-border/60 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Changes to This Privacy Policy
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 text-body text-muted-foreground ml-4">
                <li>Posting the updated policy on this page</li>
                <li>Updating the "Last updated" date at the top of this policy</li>
                <li>Sending you an email notification (if you have email notifications enabled)</li>
                <li>Displaying a prominent notice in our Service</li>
              </ul>
              <p className="text-body text-muted-foreground leading-relaxed mt-4">
                Your continued use of our Service after any changes to this Privacy Policy constitutes your acceptance of the updated policy. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </section>

            {/* Contact Us */}
            <section className="space-y-4 pb-8">
              <h2 className="text-h2 font-semibold text-foreground tracking-[-0.03em]">
                Contact Us
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-body text-muted-foreground leading-relaxed mt-4">
                <strong>Email:</strong> 1017rithvik@gmail.com
              </p>
              <p className="text-body text-muted-foreground leading-relaxed">
                We will respond to your inquiry within a reasonable timeframe.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 px-4 md:px-6 border-t border-border/60">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/web-logo.png"
                  alt="Billo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span className="text-body font-medium text-foreground">
                  Billo
                </span>
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href="/privacy"
                  className="text-small text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <p className="text-small text-muted-foreground">
                  © {new Date().getFullYear()} Billo. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
