// apps/web/app/team/[id]/page.tsx
import { TeamPage } from '@/components/TeamPage';
import { headers } from 'next/headers';

interface Props {
  params: { id: string };
}

export default async function TeamDetailPage({ params, searchParams }: Props & {
  searchParams: Promise<{ league?: string }>;
}) {
  const teamId = Number(params.id) || 1;
  const search = await searchParams;
  const leagueId = search?.league || 'BL1';
  const locale = 'de';
  
  return (
    <TeamPage 
      teamId={teamId} 
      leagueId={leagueId}
      locale={locale} 
    />
  );
}
