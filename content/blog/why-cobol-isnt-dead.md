---
title: Why COBOL Isn't Dead (And What That Means for AI)
slug: why-cobol-isnt-dead
date: 2025-01-15
tags: [legacy, cobol, ai, modernization]
excerpt: 95% of ATM transactions still run on COBOL. Instead of declaring it dead, maybe we should figure out what that means for the AI era.
---

# Why COBOL Isn't Dead (And What That Means for AI)

Every few months, someone writes a thinkpiece declaring COBOL dead. And every few months, the 95% of ATM transactions that still run on COBOL politely disagree.

## The Numbers Don't Lie

There are an estimated **220 billion lines of COBOL** still in production. That's not a rounding error. That's the backbone of global finance, healthcare, and government systems. The IRS runs on COBOL. So do most major banks. So does a terrifying amount of critical infrastructure.

The problem isn't that COBOL is bad — it's actually remarkably reliable. The problem is that the people who understand it are retiring, and the systems built on it weren't designed for the world we live in now.

## Enter AI (But Carefully)

This is where it gets interesting. AI — specifically large language models — can actually help here, but not in the way most people think.

The naive approach is "use AI to rewrite COBOL in Java/Python/whatever." This is tempting and almost always wrong. Here's why:

1. **Decades of business logic are embedded in that code.** Rewriting it means understanding it first, and much of it is undocumented.
2. **Testing is nearly impossible** when you don't fully understand what the code is supposed to do.
3. **The risk tolerance is zero.** These systems process trillions of dollars. You don't YOLO a migration.

## What Actually Works

Instead of rewriting, I've found success with a more nuanced approach:

- **AI-assisted code comprehension**: Using LLMs to analyze and document existing COBOL codebases, generating documentation that should have existed 30 years ago.
- **Incremental strangler patterns**: Wrapping legacy systems in modern APIs, gradually moving functionality to new services while keeping the COBOL core running.
- **Automated testing generation**: Using AI to generate test cases based on production behavior, building a safety net before you touch anything.

## The Takeaway

COBOL isn't dead. It's not even dying. It's just waiting for us to figure out how to work with it instead of pretending it doesn't exist. And AI, used thoughtfully, might be the bridge we need.

The irony? The most cutting-edge AI technology might be most valuable when applied to the oldest code still running.
