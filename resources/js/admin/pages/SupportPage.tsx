import React from 'react';
import { Mail, Phone, BookOpen, ShieldQuestion } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';

const faqs = [
  {
    question: 'How do I reset a staff member\'s password?',
    answer: 'Go to Users, open the member\'s profile, and use "Reset Password" to send them a secure set-password link by email.',
  },
  {
    question: 'Why can\'t I see a menu item another admin has?',
    answer: 'Access is controlled by role. Ask a Super Admin to review your role under Roles & Permissions.',
  },
  {
    question: 'A page I published isn\'t showing on the public site.',
    answer: 'Check that its status is set to "Published" rather than "Draft", and that its publish date is not in the future.',
  },
];

export default function SupportPage() {
  return (
    <div>
      <PageHeader
        title="Support"
        description="Get help using the Horaios CMS."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldQuestion className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                <p className="font-medium text-gray-900">{faq.question}</p>
                <p className="mt-1 text-sm text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Contact administration</h2>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              For account access issues or anything not covered above, reach out to the church office.
            </p>
            <a
              href="mailto:admin@horaiosbaptist.org"
              className="block text-sm font-medium text-primary-red hover:underline"
            >
              admin@horaiosbaptist.org
            </a>
          </div>

          <div className="pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Phone</h3>
            </div>
            <p className="text-sm text-gray-500">+855 23 000 000</p>
          </div>

          <div className="pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Documentation</h3>
            </div>
            <p className="text-sm text-gray-500">
              Module guides are being written and will link here as each one ships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
