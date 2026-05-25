import { getCollection, type CollectionEntry } from 'astro:content'

export type Publication = CollectionEntry<'publications'>['data']

export async function getPublications(): Promise<Publication[]> {
	const entries = await getCollection('publications')

	return entries
		.map((entry) => entry.data)
		.sort((left, right) => right.year - left.year || left.title.localeCompare(right.title))
}
