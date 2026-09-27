import { redirect } from 'next/navigation';

export default function MarketplaceCoursesPage() {
  redirect('/marketplace?tab=COURSES');
}
