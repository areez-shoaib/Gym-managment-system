// Notification utility
// Each notification: { id, to (email or 'admin'), type, message, read, createdAt }

export const addNotification = (to, type, message) => {
  const key = `notifications_${to}`
  const existing = JSON.parse(localStorage.getItem(key) || '[]')
  const notif = {
    id: `NOTIF${Date.now()}`,
    to, type, message,
    read: false,
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(key, JSON.stringify([notif, ...existing]))
}

export const getNotifications = (to) => {
  return JSON.parse(localStorage.getItem(`notifications_${to}`) || '[]')
}

export const markAllRead = (to) => {
  const key = `notifications_${to}`
  const existing = JSON.parse(localStorage.getItem(key) || '[]')
  localStorage.setItem(key, JSON.stringify(existing.map(n => ({ ...n, read: true }))))
}

export const markOneRead = (to, id) => {
  const key = `notifications_${to}`
  const existing = JSON.parse(localStorage.getItem(key) || '[]')
  localStorage.setItem(key, JSON.stringify(existing.map(n => n.id === id ? { ...n, read: true } : n)))
}

export const clearNotifications = (to) => {
  localStorage.removeItem(`notifications_${to}`)
}
