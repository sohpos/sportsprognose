// apps/web/app/team/[id]/page.tsx
import { TeamPage } from '@/components/TeamPage';

interface Props {
  params: { id: string };
  searchParams?: { league?: string };
}

export default function TeamDetailPage({ params, searchParams }: Props) {
  // Convert ID safely to number
  const teamId = Number(params.id) || 1;

  // Extract league from URL, fallback to BL1
  const leagueId = searchParams?.league || 'BL1';

  // Locale currently static (can be replaced with context)
  const locale = 'de';

  return (
    <TeamPage
      teamId={teamId}
      leagueId={leagueId}
      locale={locale}
    />
  );
}
