// Product configuration data (not user mock data)
export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Student Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for casual learners just getting started.',
    features: ['Access to 500+ free courses', 'Community feed & posts', '10 AI Tutor queries/month', 'Basic study streak tracking', 'Join up to 3 communities'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'StudyVerse Pro',
    price: 299,
    period: 'month',
    description: 'For serious students who want to accelerate their learning.',
    features: ['All Free features', 'Unlimited AI Tutor queries', 'AI quiz & notes generation', 'Download verified certificates', 'Priority community access', 'Offline download — PDFs & notes', 'Advanced analytics dashboard'],
    cta: 'Start 7-Day Free Trial',
    popular: true,
  },
  {
    id: 'institute',
    name: 'Institute',
    price: 999,
    period: 'month',
    description: 'For schools, colleges, and coaching centers.',
    features: ['Everything in Pro', 'Up to 500 student seats', 'Custom branding & domain', 'Teacher analytics dashboard', 'Bulk certificate generation', 'Dedicated account manager', 'API access & LMS integration'],
    cta: 'Contact Sales',
    popular: false,
  },
];