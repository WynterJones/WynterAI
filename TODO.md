# WynterAI Todo

## Authentication & User Management

- [x] Add Supabase integration
- [x] Implement user authentication system
- [x] Connect users to database

## Onboarding Flow

- [x] Lock homepage features for unauthenticated users
- [x] Add registration from homepage
- [ ] Create step-by-step onboarding flow
  - [ ] Step: Add Vercel Token
  - [ ] Step: Add v0 API Key
  - [ ] Step: Payment ($100 one-time)
  - [ ] Step: Order bump for template library ($200, skippable)
  - [ ] Mock checkout step for Stripe integration
- [ ] Redirect to homepage after onboarding completion

## User Tiers & Limits

- [x] Free tier: 1 free chat limit
- [ ] Free tier: Disable chat deletion
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

- [ ] Add toolbar at top when chat is started
- [ ] Add dimension controls (width, height, auto-height, full width, static sizes)
- [ ] Add corners control
- [ ] Add shadow control
- [ ] Add border control
- [ ] "Add to Your Site" button opens right drawer
- [ ] Right drawer: Publish/Publish Changes button
- [ ] Show deployment status when deploying to Vercel
- [ ] Generate iframe embed code with deployed link
- [ ] Add auto-height option for iframe with parent JS

## Homepage Main Flow

- [x] Add headline and subheadline
- [x] Keep existing prompt box
- [ ] Create cycling slider of app template screenshots
- [ ] Add "Use This Template" button to each template
- [ ] Add "Browse Library" button
- [ ] Highlight selected template in slider
- [ ] Add selected template to prompt box
- [ ] Use template ZIP URL as starting point for v0 chat with user's prompt

## Embedded Micro Tools

- [ ] Ensure all created apps deploy as iframe-embeddable tools
- [ ] Configure iframe settings for embedded apps

## Admin Area

- [ ] Add profiles with role "admin"
- [ ] Basic admin area at /hq with user stats and chats numbers, etc
- [ ] Manage templates that are avaialbe name, screenshot, url for zip
