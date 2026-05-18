#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

function parseArgs(argv) {
  const result = { mode: 'medications', email: '', password: '' }

  for (let index = 2; index < argv.length; index += 1) {
    const current = argv[index]
    const next = argv[index + 1]

    if (current === '--mode' && next) {
      result.mode = next
      index += 1
      continue
    }

    if (current === '--email' && next) {
      result.email = next
      index += 1
      continue
    }

    if (current === '--password' && next) {
      result.password = next
      index += 1
    }
  }

  return result
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return
  }

  const content = readFile(filePath, 'utf8')
  return content.then((raw) => {
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) {
        continue
      }

      const key = trimmed.slice(0, separatorIndex).replace(/^export\s+/, '').trim()
      let value = trimmed.slice(separatorIndex + 1).trim()

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

function fail(message) {
  console.error(`Smoke check failed: ${message}`)
  process.exit(1)
}

function assert(condition, message) {
  if (!condition) {
    fail(message)
  }
}

function buildUniqueEmail(prefix) {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '')
  return `${prefix}-${timestamp}@example.com`
}

async function waitForProfileRow(supabase, userId) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, created_at')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (data) {
      return data
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return null
}

async function main() {
  await loadEnvFile(path.join(projectRoot, '.env.local'))

  const { mode, email: cliEmail, password: cliPassword } = parseArgs(process.argv)
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

  assert(supabaseUrl, 'VITE_SUPABASE_URL is required')
  assert(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY is required')

  const smokeEmail = cliEmail || process.env.SMOKE_EMAIL || buildUniqueEmail('health-y-smoke')
  const smokePassword = cliPassword || process.env.SMOKE_PASSWORD || 'SmokeCheck123!'

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })

  console.log(`Running Supabase smoke check in ${mode} mode`)

  const { data: medications, error: medicationsError } = await supabase
    .from('medications')
    .select('id, name')
    .order('name')

  if (medicationsError) {
    throw medicationsError
  }

  assert(Array.isArray(medications) && medications.length > 0, 'Expected medications to exist in the database')
  console.log(`Loaded ${medications.length} medication rows`)

  if (mode === 'medications') {
    console.log('Medication read smoke check passed')
    return
  }

  if (mode === 'new-user') {
    const { data, error } = await supabase.auth.signUp({
      email: smokeEmail,
      password: smokePassword,
    })

    if (error) {
      throw error
    }

    const userId = data.user?.id
    assert(userId, 'Expected signUp to return a user id')

    const profileRow = await waitForProfileRow(supabase, userId)
    assert(profileRow, 'Expected profile row to be created for the new signup')

    console.log(`Verified profile row for new signup: ${profileRow.email}`)

    if (!data.session) {
      console.log('Signup completed but no session was returned; prescription creation step skipped')
      return
    }

    const firstMedication = medications[0]
    const prescriptionPayload = {
      user_id: userId,
      medication_id: firstMedication.id,
      medication_name: firstMedication.name,
      dosage: '500',
      unit: 'mg',
      frequency: 'Once daily',
      frequency_per_day: 1,
      start_date: new Date().toISOString().slice(0, 10),
      notes: 'Supabase smoke check',
    }

    const { data: createdPrescription, error: createError } = await supabase
      .from('prescriptions')
      .insert(prescriptionPayload)
      .select('id, user_id, medication_name')
      .single()

    if (createError) {
      throw createError
    }

    assert(createdPrescription?.id, 'Expected prescription creation to return a row')

    const { data: reloadedPrescription, error: reloadError } = await supabase
      .from('prescriptions')
      .select('id, user_id, medication_name')
      .eq('id', createdPrescription.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (reloadError) {
      throw reloadError
    }

    assert(reloadedPrescription, 'Expected created prescription to be readable after insert')

    const { error: deleteError } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', createdPrescription.id)
      .eq('user_id', userId)

    if (deleteError) {
      throw deleteError
    }

    console.log('Verified prescription creation and cleanup for new signup')
    return
  }

  if (mode === 'full') {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: smokeEmail,
      password: smokePassword,
    })

    if (error) {
      throw error
    }

    const session = data.session
    const userId = data.user?.id
    assert(session, 'Expected a session after sign-in')
    assert(userId, 'Expected a user id after sign-in')

    const firstMedication = medications[0]
    const prescriptionPayload = {
      user_id: userId,
      medication_id: firstMedication.id,
      medication_name: firstMedication.name,
      dosage: '500',
      unit: 'mg',
      frequency: 'Once daily',
      frequency_per_day: 1,
      start_date: new Date().toISOString().slice(0, 10),
      notes: 'Supabase smoke check',
    }

    const { data: createdPrescription, error: createError } = await supabase
      .from('prescriptions')
      .insert(prescriptionPayload)
      .select('id, user_id, medication_name')
      .single()

    if (createError) {
      throw createError
    }

    assert(createdPrescription?.id, 'Expected prescription creation to return a row')

    const { data: reloadedPrescription, error: reloadError } = await supabase
      .from('prescriptions')
      .select('id, user_id, medication_name')
      .eq('id', createdPrescription.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (reloadError) {
      throw reloadError
    }

    assert(reloadedPrescription, 'Expected created prescription to be readable after insert')

    const { error: deleteError } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', createdPrescription.id)
      .eq('user_id', userId)

    if (deleteError) {
      throw deleteError
    }

    console.log('Verified full auth-to-prescription flow')
    return
  }

  fail(`Unknown mode: ${mode}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
