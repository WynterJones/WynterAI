import { createClient } from './server'
import { decrypt } from '../encryption'

/**
 * Get decrypted tokens for the current user
 * @returns Object containing decrypted vercel_token and v0_api_key
 */
export async function getUserTokens() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('vercel_token, v0_api_key')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    throw new Error('Profile not found')
  }

  return {
    vercelToken: profile.vercel_token ? decrypt(profile.vercel_token) : null,
    v0ApiKey: profile.v0_api_key ? decrypt(profile.v0_api_key) : null,
  }
}

/**
 * Get decrypted Vercel token for the current user
 * @returns Decrypted Vercel token or null
 */
export async function getVercelToken(): Promise<string | null> {
  const tokens = await getUserTokens()
  return tokens.vercelToken
}

/**
 * Get decrypted v0 API key for the current user
 * @returns Decrypted v0 API key or null
 */
export async function getV0ApiKey(): Promise<string | null> {
  const tokens = await getUserTokens()
  return tokens.v0ApiKey
}
