// apps/web/app/team/[id]/page.tsx
import { TeamPage } from '@/components/TeamPage';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TeamDetailPage({ params }: Props) {
  const resolved = await params;
  const teamId = Number(resolved.id) || 1;
  
  // Get locale from query params or default
  const locale = 'de'; // Could be derived from next-intl or similar
  
  return <TeamPage teamId={teamId} locale={locale} />;
}
