export const experiences = [
	{
		company: 'Adobe Inc.',
		time: 'Jun 2024 - Dec 2024',
		title: 'Research Intern',
		location: 'Paris, France',
		description: '',
	},
	{
		company: 'Adobe Inc.',
		time: 'May 2025 - Sep 2025',
		title: 'Research Intern',
		location: 'San Jose, USA',
		description: '',
	},
	// {
	// 	company: 'Radium Institute (Institut du Radium)',
	// 	time: '1914 - 1934',
	// 	title: 'Director',
	// 	location: 'Paris, France',
	// 	description: 'Led groundbreaking studies on radioactivity and mentored future Nobel Prize laureates.',
	// },
];

export const education = [
	{
		school: 'University Rey Juan Carlos',
		time: '2023 - Present',
		degree: 'PhD in Computer Graphics (Physics Simulation & Machine Learning)',
		location: 'Madrid, Spain',
		description: '',
	},
	// {
	// 	school: 'University of Paris',
	// 	time: '1891 - 1895',
	// 	degree: 'Master’s in Physics and Mathematics',
	// 	location: 'Paris, France',
	// 	description: 'Graduated at the top of her class in physics and second in mathematics.',
	// },
];

export const skills = [
	{
		title: '',
		description: '',
	},
	// {
	// 	title: 'Experimental Techniques',
	// 	description: 'Spectroscopy, Isolation of Radioactive Elements, Radiation Measurement',
	// },
];

export const publications = [
	{
		title: 'Resolving Collisions in Dense 3D Crowd Animations',
		authors: 'Gonzalo Gomez-Nogales*, Melania Prieto-Martin*, Cristian Romero, Marc Comino-Trinidad, Pablo Ramon-Prieto, Anne-Helene Olivier, Ludovic Hoyet, Miguel Otaduy, Julien Pettre, Dan Casas',
		journal: 'ACM Transactions on Graphics (SIGGRAPH Asia)',
		time: '2024',
		link: 'https://doi.org/10.1145/3687266',
		abstract: 'We propose a novel contact-aware method to synthesize highly-dense 3D crowds of animated characters. Existing methods animate crowds by, first, computing the 2D global motion approximating subjects as 2D particles and, then, introducing individual character motions without considering their surroundings. This creates the illusion of a 3D crowd, but, with density, characters frequently intersect each other since character-to-character contact is not modeled. We tackle this issue and propose a general method that considers any crowd animation and resolves existing residual collisions. To this end, we take a physics-based approach to model contacts between articulated characters. This enables the real-time synthesis of 3D high-density crowds with dozens of individuals that do not intersect each other, producing an unprecedented level of physical correctness in animations. Under the hood, we model each individual using a parametric human body incorporating a set of 3D proxies to approximate their volume. We then build a large system of articulated rigid bodies, and use an efficient physics-based approach to solve for individual body poses that do not collide with each other while maintaining the overall motion of the crowd. We first validate our approach objectively and quantitatively. We then explore relations between physical correctness and perceived realism based on an extensive user study that evaluates the relevance of solving contacts in dense crowds. Results demonstrate that our approach outperforms existing methods for crowd animation in terms of geometric accuracy and overall realism.',
		pdfLink: 'assets/RCID3DCApaper.pdf',
		videoLink: 'https://www.youtube.com/watch?v=gP8FFeKRqx0&ab_channel=DanCasas',
		webLink: 'https://mslab.es/projects/Dense3DCrowds/'
	},
	// {
	// 	title: 'The Radiation of Uranium Compounds',
	// 	authors: 'Marie Curie',
	// 	journal: 'Comptes Rendus de l'Académie des Sciences',
	// 	time: '1898',
	// 	link: '#',
	// 	abstract: 'Early research leading to the identification of uranium's radioactive properties.',
	// 	pdfLink: '#',
	// 	videoLink: '#',
	// 	webLink: '#',
	// },
];
