import { NextRequest, NextResponse } from 'next/server';
import { OrganisationsDb } from '@/lib/organisations-db';
import {
  matchHostsClientSide,
  CLIENT_SEED_HOSTS,
  mapStoredHostToClientRecord,
} from '@/lib/matching-engine';
import { MatchHostsRequestDto } from '@mobility-nexus/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const query: MatchHostsRequestDto = await request.json();

    // 1. Fetch real host organisations from storage/database
    const registeredRawHosts = await OrganisationsDb.getAllHosts();

    // 2. Map stored host records to client matching format
    const registeredClientHosts = registeredRawHosts
      .filter((h) => h && h.name && h.isActive !== false)
      .map(mapStoredHostToClientRecord);

    // 3. Combine registered hosts with demo seed hosts (deduplicating by ID)
    const registeredIds = new Set(registeredClientHosts.map((h) => h.id));
    const remainingSeedHosts = CLIENT_SEED_HOSTS.filter((h) => !registeredIds.has(h.id));

    // Registered hosts placed first in the pool
    const combinedPool = [...registeredClientHosts, ...remainingSeedHosts];

    // 4. Run full 10-hard-filter & two-tier scoring matching engine
    const result = matchHostsClientSide(query, combinedPool);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error running host matching engine:', error);
    return NextResponse.json(
      { success: false, message: 'Eşleştirme motoru çalıştırılamadı', error: error.message },
      { status: 500 }
    );
  }
}
