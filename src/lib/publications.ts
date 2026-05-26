import { getCollection, type CollectionEntry } from 'astro:content'
import publicationSource from '@/data/publications.json'

export type Publication = CollectionEntry<'publications'>['data']

export async function getPublications(): Promise<Publication[]> {
	const entries = await getCollection('publications')
	const sourceOrder = new Map(
		publicationSource.map((publication, index) => [publication.id, index]),
	)

	return entries
		.map((entry) => entry.data)
		.sort((left, right) => sourceOrder.get(left.id)! - sourceOrder.get(right.id)!)
}
