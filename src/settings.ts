export const profile = {
	fullName: 'Gonzalo Gómez-Nogales',
	title: '',
	institute: '',
	author_name: '', // Author name to be highlighted in the papers section
	research_areas: [
		{ title: 'Computer Graphics', description: '3D rendering, visualization, and graphics programming', field: 'computer-graphics' },
		{ title: 'Physics Simulation', description: 'Cloth and human body interaction and motion', field: 'physics-simulation' },
		{ title: 'Machine Learning', description: 'Generative models and physics-based learning', field: 'machine-learning' },
		// { title: 'Physics', description: 'Brief description of the research interest', field: 'physics' },
	],
}

// Set equal to an empty string to hide the icon that you don't want to display
export const social = {
	email: 'gonzalo.gomez@urjc.es',
	linkedin: 'https://www.linkedin.com/in/gonzalogomeznogales/',
	x: '',
	github: '',
	gitlab: '',
	scholar: 'https://scholar.google.com/citations?user=0l16gSgAAAAJ&hl=en',
	inspire: '',
	arxiv: '',
	orcid: 'https://orcid.org/0009-0000-1309-8383'
}

export const template = {
	website_url: 'https://localhost:4321', // Astro needs to know your site's deployed URL to generate a sitemap. It must start with http:// or https://
	transitions: true,
	lightTheme: 'light', // Select one of the Daisy UI Themes or create your own
	darkTheme: 'light', // Keep light theme for both
	excerptLength: 200,
	postPerPage: 5,
    base: '' // Repository name starting with /
}

export const seo = {
	default_title: 'Gonzalo Gomez-Nogales',
	default_description: 'Gonzalo is a last year PhD student at Universidad Rey Juan Carlos in Madrid (MSLab). His research interests lie at the intersection of Computer Graphics, Physics Simulation and Machine Learning, with a particular focus on developing novel ways of enhancing 3D Graphics realism, control and interactivity with AI.',
	default_image: '/images/profile_photo.jpeg',
}
