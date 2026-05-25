import type { Experience, Internship } from '@/types/cv'

export const internships = [
	{
		company: 'Adobe',
		brand: 'adobe',
		office: 'Paris Office',
		time: 'May 2024 - December 2024',
		title: 'Research Intern',
		location: 'Paris, France',
		description: '',
	},
	{
		company: 'Adobe',
		brand: 'adobe',
		office: 'Headquarters',
		time: 'May 2025 - September 2025',
		title: 'Research Intern',
		location: 'San Jose, California, USA',
		description: '',
	},
	{
		company: 'Roblox',
		brand: 'roblox',
		office: 'Headquarters',
		time: 'May 2026 - September 2026',
		title: 'Applied Scientist Intern',
		location: 'San Mateo, California, USA',
		description: '',
		current: true,
	},
] satisfies Internship[]

export const experiences: Experience[] = internships

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
