import type { ImageMetadata } from 'astro'

const teaserAssets = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/publications/**/*.{avif,jpeg,jpg,png,webp}',
	{ eager: true }
)

const pdfAssets = import.meta.glob<string>('/src/assets/publications/**/*.pdf', {
	eager: true,
	import: 'default',
	query: '?url',
})

function requireAsset<T>(assets: Record<string, T>, assetPath: string, kind: string): T {
	const asset = assets[`/src/assets/${assetPath}`]

	if (!asset) {
		throw new Error(`Publication ${kind} asset "${assetPath}" was not found in src/assets/publications.`)
	}

	return asset
}

export function getPublicationTeaser(assetPath?: string): ImageMetadata | undefined {
	return assetPath ? requireAsset(teaserAssets, assetPath, 'teaser').default : undefined
}

export function getPublicationPdf(assetPath?: string): string | undefined {
	return assetPath ? requireAsset(pdfAssets, assetPath, 'PDF') : undefined
}
