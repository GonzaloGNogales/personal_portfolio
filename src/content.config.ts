import { defineCollection } from "astro:content";
import { z } from "astro/zod";

import { file, glob } from "astro/loaders";

const blog = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/BlogPosts",
    }),
    schema: z.object({
        title: z.string(),
        date: z.string(),
        excerpt: z.string(),
        tags: z.array(z.string()).optional(),
    }),
});

const publications = defineCollection({
    loader: file("src/data/publications.json"),
    schema: z.object({
        id: z.string(),
        title: z.string(),
        authors: z.array(
            z.object({
                name: z.string(),
                highlighted: z.boolean().optional(),
                equalContribution: z.boolean().optional(),
            })
        ).min(1),
        venue: z.string(),
        year: z.number().int(),
        primaryUrl: z.string().url(),
        teaser: z.string().optional(),
        teaserUrl: z.string().optional(),
        teaserWidth: z.number().int().positive().optional(),
        teaserHeight: z.number().int().positive().optional(),
        teaserFit: z.enum(["cover", "contain"]).optional(),
        pdfAsset: z.string().optional(),
        paperUrl: z.string().url().optional(),
        videoUrl: z.string().url().optional(),
        projectUrl: z.string().url().optional(),
        abstract: z.string().optional(),
    }),
});

export const collections = { blog, publications };
