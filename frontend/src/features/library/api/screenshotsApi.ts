import type { Screenshot } from '@/shared/types'
import { sampleScreenshots } from './sampleScreenshots'

// Stand-in for the backend. Swap the body for a fetch() call in the API stage.
export async function fetchScreenshots(): Promise<Screenshot[]> {
  await new Promise((resolve) => setTimeout(resolve, 900))
  return sampleScreenshots
}
