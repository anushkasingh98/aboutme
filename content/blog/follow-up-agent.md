---
title: I Built an Agent So I Never Miss a Reply Again
slug: follow-up-agent
date: 2026-11-07
tags: [ai, agents, productivity, automation]
excerpt: My chats are spread across iMessage, Slack and WhatsApp, and I kept forgetting who I owed a reply. So I built a follow-up agent that turns them into a clear Linear task list.
---
Lately, keeping up with my messages has been giving me real anxiety.

My conversations are spread across iMessage, Slack and WhatsApp. Each app asks for attention all day, and there's a quiet pressure to stay on top of every single chat. Personal, business, and everything in between all land in the same place. A message from a friend sits next to a work question, which sits next to a promo text. It's all gummed together.

That makes it hard to filter out the noise and see what actually matters. The result is a constant low-level worry: *who am I forgetting to answer?*

## The idea

I didn't need another inbox. I needed something that does the remembering for me.

So I built a **follow-up agent** with [Switch](https://github.com/sandbox-quantum/switch). The goal is simple: catch up on the replies I owe, and make that a regular habit, so I'm never too late to respond to people.

## How it works

When I tell the agent "followups", it:

1. **Reads my chats** across iMessage, WhatsApp and Slack.
2. **Finds the ones that need me**: personal messages and individual tags where I haven't replied yet.
3. **Skips the noise**: group chatter, newsletters, automated messages and spam.
4. **Creates a Linear task** for each one, with a short summary of the conversation and a suggested reply.

I end up with one clear list instead of dozens of chats to scroll through.

## See it in action

Here's a short video of how the follow-up agent works:

[Watch the demo on YouTube](https://youtu.be/Iivc2v3LUI8)

## One rule: it never sends anything

The agent only reads and creates tasks. It never replies, drafts into a chat or sends a message for me. The suggested reply is just a starting point, and I decide what to say and when to send it. These are my relationships, so the last step stays mine.

## Set it up yourself

The step-by-step setup guide is on GitHub: [follow-up-switch-agent](https://github.com/anushkasingh98/follow-up-switch-agent).

## Making it a habit

The agent is useful on the first run, but the real change comes from repeating it. A quick "followups" check each day turns a pile of guilt into a short list I can clear in a few minutes.

If you're juggling too many chats, try building something similar. You don't have to answer faster. You just have to stop forgetting.
