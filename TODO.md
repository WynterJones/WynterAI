# WynterAI Todo

## Authentication & User Management

- [x] Add Supabase integration
- [x] Implement user authentication system
- [x] Connect users to database

## Onboarding Flow

- [x] Lock homepage features for unauthenticated users
- [x] Add registration from homepage
- [x] Create step-by-step onboarding flow
  - [x] Step: Add Vercel Token
  - [x] Step: Add v0 API Key
  - [x] Step: Payment ($100 one-time)
  - [x] Step: Order bump for template library ($200, skippable)
  - [x] Mock checkout step for Stripe integration
- [x] Redirect to homepage after onboarding completion

## User Tiers & Limits

- [x] Free tier: 1 free chat limit
- [x] Free tier: Disable chat deletion
- [x] Add upgrade button in UI
- [x] Show upgrade prompts for limited features

## Database & Projects

- [x] Connect projects to database per user
- [x] Connect chats to database per user
- [x] Save chat details (deploy URL, etc) as required by v0

## Chat Functionality

- [x] Create new chat flow
- [x] Store v0 required details for each chat

## Canvas Tools Toolbar

- [x] Add toolbar at top when chat is started
- [x] Add dimension controls (width, height, auto-height, full width, static sizes)
- [x] Add corners control
- [x] Add shadow control
- [x] Add border control
- [x] "Add to Your Site" button opens right drawer
- [x] Right drawer: Publish/Publish Changes button
- [x] Show deployment status when deploying to Vercel
- [x] Generate iframe embed code with deployed link
- [x] Add auto-height option for iframe with parent JS

## Homepage Main Flow

- [x] Add headline and subheadline
- [x] Keep existing prompt box
- [ ] Create cycling slider of app template screenshots
- [ ] Add "Use This Template" button to each template
- [ ] Add "Browse Library" button
- [ ] Highlight selected template in slider
- [ ] Add selected template to prompt box
- [ ] Use template ZIP URL as starting point for v0 chat with user's prompt

## Admin Area

- [x] Add profiles with role "admin"
- [x] Basic admin area at /hq with user stats and chats numbers, etc
- [x] Manage templates that are available: name, screenshot, url for zip
