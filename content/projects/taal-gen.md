---
title: TaalGen — Generative Kathak Rhythm Patterns
slug: taal-gen
date: 2025-01-10
tags: [kathak, generative-art, music, creative-coding]
excerpt: An experimental project that uses algorithmic composition to generate traditional Kathak rhythm patterns (bols) and visualize them as geometric art.
url: https://github.com/anushkasingh/taal-gen
status: active
---

# TaalGen — Generative Kathak Rhythm Patterns

TaalGen is a creative coding project that sits squarely at the intersection of my two worlds: Kathak dance and software engineering. It algorithmically generates traditional Kathak rhythm patterns (called **bols**) and renders them as interactive geometric visualizations.

## Concept

In Kathak, rhythm patterns are expressed as sequences of syllables — **dha**, **dhin**, **ta**, **tirkita**, **dhage** — each representing a specific sound made by the tabla or the dancer's feet. These patterns follow strict mathematical rules within a rhythmic cycle (taal), but within those rules, there's enormous room for creativity.

TaalGen models these rules computationally and generates new patterns that are:
- **Rhythmically valid** — they respect the taal structure and always land on sam
- **Musically interesting** — they use variation, repetition, and escalation like a real composition
- **Visually represented** — each bol maps to a geometric element, creating mandala-like patterns

## How It Works

### Pattern Generation
A rule-based system models the grammar of Kathak bols within different taals (teentaal, jhaptaal, rupak). It uses weighted random selection with constraints to generate patterns that sound authentic.

### Visualization
Each syllable maps to a shape, color, and position on a circular canvas. The result is a radial visualization where you can *see* the rhythm — repetitions create symmetry, variations create asymmetry, and the sam (beat one) is always the anchor point.

### Audio
Using the Web Audio API, TaalGen can play back generated patterns with synthesized tabla sounds, so you can hear what you see.

## Tech Stack

- **Generation Engine**: JavaScript, custom grammar system
- **Visualization**: Canvas API, custom rendering engine
- **Audio**: Web Audio API, sampled tabla sounds
- **Framework**: Vanilla JS — no frameworks, no build step, just rhythm

## What I Learned

Building TaalGen forced me to formalize knowledge I'd held intuitively for years. Translating the "feel" of Kathak rhythm into explicit rules was humbling — it made me appreciate both the mathematical precision and the irreducible human artistry of the form.
