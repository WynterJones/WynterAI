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
- [x] Create cycling slider of app template screenshots
- [x] Add "Use This Template" button to each template
- [x] Add "Browse Library" button
- [x] Highlight selected template in slider
- [x] Add selected template to prompt box
- [x] Use template ZIP URL as starting point for v0 chat with user's prompt

## Project & Tools Management

- [x] Create project dropdown with "Select Project" default
- [x] Add plus button to create new projects
- [x] Add settings icon to manage projects (rename/delete)
- [x] Create project management API endpoints (PATCH/DELETE)
- [x] Add wrench icon for tools/chat management
- [x] Create tools management dialog (view all tools across projects)
- [x] Create chat management API endpoints (PATCH/DELETE)
- [x] Allow renaming and deleting tools/chats

## User Experience

- [x] Add credits dropdown in header (auto-loads v0 API balance)
- [x] Add user menu dropdown (Logout, Help Center, Terms, Privacy)
- [x] Add loading overlay for chat creation
- [x] Remove "New from Latest" from chat dropdown

## Admin Area

- [x] Add profiles with role "admin"
- [x] Basic admin area at /hq with user stats and chats numbers, etc
- [x] Manage templates that are available: name, screenshot, url for zip

## Canvas (chat experience)

- [x] Default to 800px width and 600px height
- [x] Allow easy dimension toggle (fix)
- [x] Make toolbar appear below main header (with logo, etc)
- [x] Ensure corners, borders, etc works on iframe
- [x] Toolbar should be centered nicely with dropdowns with presets and custom inputs for px etc
