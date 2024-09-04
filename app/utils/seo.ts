export function getSocialMetas({
	title = 'A corner of the internet for people who love building digital products.',
	description = "Hi, I'm Will. A self-taught developer with a background in design, and currently helping Crunchy Data build the best Postgres experience on the web.",
	image = 'https://res.cloudinary.com/dzqdvin5s/image/upload/v1669345694/wking/root.jpg',
	keywords = '',
}: {
	image?: string
	title?: string
	description?: string
	keywords?: string
}) {
	return [
		{ title },
		{ name: 'description', content: description },
		{ name: 'keywords', content: keywords },
		{ property: 'og:url', content: 'https://www.wking.dev' },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
		{ property: 'og:image', content: image },
		{ property: 'og:site_name', content: 'Will King, Design Engineer' },
		{
			name: 'twitter:card',
			content: image ? 'summary_large_image' : 'summary',
		},
		{ name: 'twitter:creator', content: '@wking__' },
		{ name: 'twitter:site', content: '@wking__' },
		{ name: 'twitter:title', content: title },
		{ name: 'twitter:description', content: description },
		{ name: 'twitter:image', content: image },
		{ name: 'twitter:alt', content: title },
	]
}
