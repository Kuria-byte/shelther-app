import { useState } from 'react'

export interface Contact {
  id: string
  name: string
  status: "notified" | "seen" | "responding" | "arrived"
  eta?: string
}

interface UseContactsReturn {
  contacts: Contact[]
  isLoading: boolean
  error: Error | null
  addContact: (contact: Omit<Contact, "id">) => Promise<void>
  removeContact: (id: string) => Promise<void>
  notifyContacts: () => Promise<void>
}

export function useContacts(): UseContactsReturn {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // ...existing code...

  const notifyContacts = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to notify contacts
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update contacts with notified status
      setContacts(currentContacts =>
        currentContacts.map(contact => ({
          ...contact,
          status: "notified"
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to notify contacts'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const removeContact = async (id: string) => {
    setIsLoading(true)
    try {
      // Simulate API call to remove contact
      await new Promise(resolve => setTimeout(resolve, 1000))
      setContacts(currentContacts => currentContacts.filter(contact => contact.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove contact'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const addContact = async (contact: Omit<Contact, "id">) => {
    setIsLoading(true)
    try {
      // Simulate API call to add contact
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newContact = {
        ...contact,
        id: Math.random().toString(36).substr(2, 9)
      }
      setContacts(currentContacts => [...currentContacts, newContact])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add contact'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    contacts,
    isLoading,
    error,
    addContact,
    removeContact,
    notifyContacts
  }
}