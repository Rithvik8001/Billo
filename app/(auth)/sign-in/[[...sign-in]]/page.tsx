import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 antialiased">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white backdrop-blur-xl border border-gray-100 shadow-xl rounded-2xl",
            headerTitle: "text-gray-900",
            headerSubtitle: "text-gray-500",
            socialButtonsBlockButton:
              "bg-white border border-gray-200 hover:border-gray-300 text-gray-900 hover:bg-gray-50",
            socialButtonsBlockButtonText: "text-gray-900",
            dividerLine: "bg-gray-200",
            dividerText: "text-gray-500",
            formFieldLabel: "text-gray-500",
            formFieldInput:
              "bg-white border-gray-200 text-gray-900 focus:border-[#2997ff] focus:ring-[#2997ff]",
            formButtonPrimary:
              "bg-[#2997ff] hover:bg-[#0077ed] text-white rounded-full",
            footerActionLink: "text-[#2997ff] hover:text-[#0077ed]",
            formFieldInputShowPasswordButton:
              "text-gray-500 hover:text-gray-700",
            identityPreviewEditButton: "text-[#2997ff] hover:text-[#0077ed]",
            formFieldWarning: "text-[#ff2d55]",
            alert: "bg-white border-gray-200 text-gray-900",
          },
          variables: {
            borderRadius: "1rem",
          },
        }}
      />
    </div>
  );
}
