const URL = "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users"

const getUsers = () => {
  return fetch(URL).then((res) => res.json())
}

export default {
  getUsers,
}
