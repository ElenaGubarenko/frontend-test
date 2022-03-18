import getUsers from "../../Api/Api"
import React, { useState, useEffect } from "react"
import styles from "./UsersList.module.css"
import Modal from "../Modal/Modal"
import clean from "../../Svg/clean.svg"
import search from "../../Svg/search.svg"

export default function UsersList() {
  const [users, setUsers] = useState([])
  const [usersToFind, setUsersToFind] = useState([])
  const [sortingDirection, setSortingDirection] = useState("ascending")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5
  const [openModal, setOpenModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState()
  const [clearFiltersButton, setClearFiltersButton] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isActive, setIsActive] = useState(false)

  let pages = []

  useEffect(() => {
    getUsers.getUsers().then((res) => {
      setUsers(res)
      setFilteredUsers(res.slice(Number(currentPage), Number(currentPage + usersPerPage)))
      setUsersToFind(res.slice(Number(currentPage), Number(currentPage + usersPerPage)))
    })
  }, [])

  useEffect(() => {
    setFilteredUsers(users.slice(Number((currentPage - 1) * usersPerPage), Number(currentPage * usersPerPage)))
    setUsersToFind(users.slice(Number((currentPage - 1) * usersPerPage), Number(currentPage * usersPerPage)))
  }, [currentPage])

  if (users.length > 0) {
    for (let i = 1; i <= Math.ceil(users.length / usersPerPage); i++) {
      pages.push(i)
    }
  }

  const sortUsers = (fildName) => {
    if (sortingDirection === "ascending") {
      filteredUsers.sort(function (a, b) {
        if (a[fildName] > b[fildName]) {
          return 1
        }
        return -1
      })
      setSortingDirection("descending")
    }

    if (sortingDirection === "descending") {
      filteredUsers.sort(function (a, b) {
        if (a[fildName] > b[fildName]) {
          return -1
        }
        return 1
      })
      setSortingDirection("ascending")
    }
    setClearFiltersButton(true)
    // setIsActive(true)
  }

  const findUser = (e) => {
    setInputValue(e.target.value)
    setFilteredUsers(
      usersToFind.filter(
        (user) =>
          user.username.trim().toLowerCase().includes(e.target.value.trim().toLowerCase()) ||
          user.email.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())
      )
    )
    setClearFiltersButton(true)
  }

  const paginate = (data) => {
    setCurrentPage(data)
  }

  const deleteUser = (id) => {
    setFilteredUsers((prevState) => prevState.filter((user) => user.id !== id))
    setOpenModal(false)
  }

  const handleModal = (id) => {
    setOpenModal(true)
    setIdToDelete(id)
  }

  const clearFilters = () => {
    setClearFiltersButton(false)
    setInputValue("")
    setFilteredUsers(users.slice(Number((currentPage - 1) * usersPerPage), Number(currentPage * usersPerPage)))
  }

  return (
    <>
      <div className={styles.Title}>Список пользователей</div>
      <div className={styles.SearchInputDiv}>
        <label className={styles.SearchInputLabel}>
          <input className={styles.SearchInput} value={inputValue} placeholder="Поиск по имени или e-mail" onChange={findUser}></input>{" "}
          <img className={styles.SvgSearch} src={search}></img>
        </label>
        {clearFiltersButton ? (
          <button className={styles.ClearButton} onClick={clearFilters}>
            <img className={styles.SvgClean} src={clean}></img>
            Очистить фильтр
          </button>
        ) : null}
      </div>
      <div className={styles.SortingDiv}>
        <p className={styles.SortingTekst}>Сортировка: </p>
        <button className={`${styles.SortingButton}`} onClick={() => sortUsers("registration_date")}>
          Дата регистрации
        </button>
        <button className={`${styles.SortingButton} ${styles.SortingRating}`} onClick={() => sortUsers("rating")}>
          Рейтинг
        </button>
      </div>
      <table className={styles.Table}>
        <tr>
          <th>Имя пользователя</th>
          <th>E-mail</th>
          <th>Дата регистрации</th>
          <th>Рейтинг</th>
          <th></th>
        </tr>

        {users.length === 0 ? (
          <p className={styles.Loading}>Загружаем список пользователей...</p>
        ) : (
          filteredUsers.map((user) => (
            <tr>
              <td className={styles.UserName} key={user.username}>
                {user.username}
              </td>
              <td className={styles.UserData} key={user.email}>
                {user.email}
              </td>
              <td className={styles.UserData} key={user.registration_date}>
                {`${user.registration_date.split("T")[0].split("-")[2]}.${user.registration_date.split("T")[0].split("-")[1]}.${
                  user.registration_date.split("T")[0].split("-")[0].split("")[2] + user.registration_date.split("T")[0].split("-")[0].split("")[3]
                }`}
              </td>
              <td className={styles.UserData} key={user.rating}>
                {user.rating}
              </td>
              <td>
                <button className={styles.DeleteButton} onClick={() => handleModal(user.id)}>
                  X
                </button>
              </td>
            </tr>
          ))
        )}
      </table>
      <div className={styles.PaginateButtonsDiv}>
        {pages.map((page) => (
          <button className={styles.PaginateButton} onClick={() => paginate(page)}>
            {page}
          </button>
        ))}
      </div>
      {openModal ? <Modal deleteUser={() => deleteUser(idToDelete)} setOpenModal={() => setOpenModal(false)}></Modal> : null}
    </>
  )
}
