# WynterAI Todo

## Authentication & User Management
- [ ] Add Supabase integration
- [ ] Implement user authentication system
- [ ] Connect users to database

## Onboarding Flow
- [ ] Lock homepage features for unauthenticated users
- [ ] Add registration from homepage
- [ ] Create step-by-step onboarding flow
  - [ ] Step: Add Vercel Token
  - [ ] Step: Add v0 API Key
  - [ ] Step: Payment ($100 one-time)
  - [ ] Step: Order bump for template library ($200, skippable)
  - [ ] Mock checkout step for Stripe integration
- [ ] Redirect to homepage after onboarding completion

## User Tiers & Limits
- [ ] Free tier: 1 free chat limit
- [ ] Free tier: Disable chat deletion
- [ ] Add upgrade button in UI
- [ ] Show upgrade prompts for limited features

## Database & Projects
- [ ] Connect projects to database per user
- [ ] Connect chats to database per user
- [ ] Save chat details (deploy URL, etc) as required by v0

## Chat Functionality
- [ ] Create new chat flow
- [ ] Store v0 required details for each chat

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
- [ ] Add headline and subheadline
- [ ] Keep existing prompt box
- [ ] Create cycling slider of app template screenshots
- [ ] Add "Use This Template" button to each template
- [ ] Add "Browse Library" button
- [ ] Highlight selected template in slider
- [ ] Add selected template to prompt box
- [ ] Use template ZIP URL as starting point for v0 chat with user's prompt

## Embedded Micro Tools
- [ ] Ensure all created apps deploy as iframe-embeddable tools
- [ ] Configure iframe settings for embedded apps
