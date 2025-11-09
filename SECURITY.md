# Security Implementation

## Token Encryption

All sensitive user data (Vercel tokens, v0 API keys) are encrypted before being stored in the database using AES encryption.

### Setup

1. **Environment Variable** (Required)
   Add to your `.env` file:
   ```
   ENCRYPTION_SECRET_KEY=your-super-secret-encryption-key-change-this-in-production
   ```

   **Important**:
   - Use a strong, random key in production
   - Never commit this key to version control
   - Generate using: `openssl rand -base64 32` or similar

### How It Works

#### Encryption
When a user saves their tokens (during onboarding or profile update):
- Tokens are encrypted using AES-256
- Only encrypted data is stored in the database
- Encryption happens in `/api/auth/profile` route

#### Decryption
When tokens are needed for API calls:
- Use the `getUserTokens()` helper from `lib/supabase/tokens.ts`
- Tokens are decrypted on-the-fly
- Decrypted values are never stored, only used in memory

### Usage

#### In API Routes

```typescript
import { getUserTokens, getVercelToken, getV0ApiKey } from '@/lib/supabase/tokens'

// Get both tokens
const { vercelToken, v0ApiKey } = await getUserTokens()

// Or get individually
const vercelToken = await getVercelToken()
const v0ApiKey = await getV0ApiKey()
```

#### Storing Tokens

```typescript
import { encrypt } from '@/lib/encryption'

// In your API route
const encryptedToken = encrypt(plainTextToken)

// Save to database
await supabase
  .from('profiles')
  .update({ vercel_token: encryptedToken })
```

## Files Involved

- `lib/encryption.ts` - Core encryption/decryption utilities
- `lib/supabase/tokens.ts` - Helper functions to get decrypted tokens
- `app/api/auth/profile/route.ts` - Encrypts tokens on save
- `app/onboarding/page.tsx` - Saves encrypted tokens during onboarding

## Best Practices

1. **Never log decrypted tokens** - Always sanitize logs
2. **Use tokens in memory only** - Don't store decrypted values
3. **Rotate encryption key periodically** - Follow your security policy
4. **Use different keys per environment** - Dev, staging, prod should have unique keys

## Security Checklist

- [x] Tokens encrypted at rest in database
- [x] Encryption key stored in environment variable
- [x] Helper functions for secure token retrieval
- [x] Tokens only decrypted when needed
- [ ] Add encryption key rotation mechanism (future enhancement)
- [ ] Add audit logging for token access (future enhancement)
