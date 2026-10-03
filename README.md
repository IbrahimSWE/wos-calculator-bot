# حاسبة — Whiteout Survival Upgrade Calculator Bot

A Discord bot that calculates the resources and time needed to upgrade items in **Whiteout Survival**, from any level to any level. It supports Arabic and English.

بوت ديسكورد يحسب الموارد والوقت اللي تحتاجها عشان ترقي عناصر لعبة **النجاة في الصقيع** من أي مستوى لأي مستوى، ويدعم العربي والإنجليزي.

## Features

- **Building calculator**: covers regular buildings and Fire Crystal buildings, including War Academy.
- **Chief Charms calculator**
- **Chief Gear calculator**: from Green up to Red T4.
- **Multi-item plans**: add several items to one plan and get a combined total of cost and time.
- **Bilingual (AR / EN)**: each user's language choice is saved.
- **Persistent control panel**: an interactive panel in the server that uses buttons, select menus and modals. The bot puts it back automatically if it gets deleted.

Upgrade data comes from the official game wiki, [whiteoutsurvival.wiki](https://whiteoutsurvival.wiki).

## Tech

- Node.js
- discord.js v14

## Setup

```bash
npm install
cp .env.example .env   # fill in DISCORD_TOKEN, CLIENT_ID, GUILD_ID
npm run deploy         # register slash commands
npm start
```

## Project structure

```
src/        bot logic (commands, interactions, calculator, i18n, panel)
data/       upgrade data (JSON) for every building and system
locales/    ar.json / en.json
```
