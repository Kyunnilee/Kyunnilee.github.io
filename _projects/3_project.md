---
layout: page
title: DayGenie: A Multi-Agent LLM Travel Assistant
description: A multi-agent llm travel assistant that generates personalized trip and transport recommendations based on user preferences and schedules.
img: assets/img/scavengerhunt.png
importance: 1
category: UC Berkeley
related_publications: false
---

# DayGenie: A Multi-Agent LLM Travel Assistant

🔥 This project is a winner of [CalHacks11](https://live.hackberkeley.org). Honorable mentions in Fetch ai track. You can also find our project in [Devpost](https://devpost.com/software/daygeine#updates).

### Inspiration

The inspiration for our auto-scheduling project emerged from the increased need for automated and personalized recommendations in travel planning tools. We recognized that multi-agent LLMs hold immense potential to tackle complex tasks such as personalized scheduling. This potential drove our team to want to explore how these models could offer solutions that can integrate into daily life problems. We were also inspired to create this app because of the tediousness of scheduling, and we recognized that our tool could save lots of time.

### Our Goal

We aim to simplify the process of planning trips and transport for important trips. We also want to introduce users to popular and fun locations along the way. DayGenie automatically generates recommendations based on user preferences and user schedule.

---

## How We Built It

### Agent Workflow

DayGenie is constructed as a decentralized multi-agent large language model. We defined 5 LLM Agents (InfoAgent, MapAgent, RedditAgent, SummaryAgent, FeedbackAgent), each with specific prompting for their purpose.

**Input:**
- User preferences (text input)
- Google Calendar schedule (via Google Calendar API)

**Agent Pipeline:**
- **InfoAgent:** Fetches user input and generates prompts for MapAgent and RedditAgent.
- **MapAgent:** Finds the location of events from calendar input.
- **RedditAgent:** Calls Reddit API to fetch and analyze reviews based on key inputs.
- **SummaryAgent:** Calculates transportation options (time, cost) and provides recommendations based on location and preferences.
- **FeedbackAgent:** Receives user feedback; if negative, reruns the process, otherwise outputs results.

**Output:** A list of personalized recommendations (transportation, restaurants, cafes, events).

### Conversation Construction

We used Fetch AI to facilitate conversations and communication between agents. Each agent is modular and passes information forward through the chain.

### Website Construction

We used **Next.js** and **Tailwind CSS** to build a user-friendly and attractive web interface. Although the site hasn't been deployed yet, we plan to do so soon.

---

## Challenges We Ran Into

- **Agent Design:** Deciding how many and which agents to define.
- **Hallucinations:** Managing hallucinated outputs from LLM agents.
- **Understanding Fetch AI:** Learning the Fetch AI agent communication structure and syntax.

---

## Accomplishments

- Successfully generated conversation workflows between LLM agents.
- Integrated Google Calendar API, Google Maps, and Reddit API.
- Added FeedbackAgent for quality control and iterative improvement.
- Learned a lot from team collaboration and had fun developing a real-world application.

---

## What’s Next for DayGenie

- **Frontend Feedback Integration:** Connect user frontend feedback to trigger FeedbackAgent responses.
- **Speech-to-Text Input:** Add speech recognition for natural user input.
- **ScoringAgent:** Add a new agent to evaluate and rank recommendations.
- **Model Fine-Tuning:** Improve performance and personalization with fine-tuning.
