const USER_KEY = 'user'

export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

export const saveUser = data => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export const deleteUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
