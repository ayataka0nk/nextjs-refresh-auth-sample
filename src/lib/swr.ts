import Cookies from 'js-cookie'

export const authFetcher = (url: string) => {
  const accessToken = Cookies.get('accessToken')
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then((r) => {
    return r.json()
  })
}
