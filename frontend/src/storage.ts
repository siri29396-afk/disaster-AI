import { openDB } from 'idb'

export type SavedPlan = {
  id: string
  title: string
  disasterType: string
  body: string
  createdAt: string
  mode: 'online' | 'offline-template'
}

export type SavedContact = {
  id: string
  name: string
  phone: string
  note: string
}

const database = openDB('disasterai-local', 1, {
  upgrade(db) {
    db.createObjectStore('plans', { keyPath: 'id' })
    db.createObjectStore('settings', { keyPath: 'key' })
    db.createObjectStore('contacts', { keyPath: 'id' })
  },
})

export async function getPlans() {
  return (await database).getAll('plans') as Promise<SavedPlan[]>
}

export async function savePlan(plan: SavedPlan) {
  await (await database).put('plans', plan)
}

export async function deletePlan(id: string) {
  await (await database).delete('plans', id)
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const value = await (await database).get('settings', key)
  return value ? value.value as T : fallback
}

export async function saveSetting(key: string, value: unknown) {
  await (await database).put('settings', { key, value })
}

export async function getContacts() {
  return (await database).getAll('contacts') as Promise<SavedContact[]>
}

export async function saveContact(contact: SavedContact) {
  await (await database).put('contacts', contact)
}

export async function deleteContact(id: string) {
  await (await database).delete('contacts', id)
}