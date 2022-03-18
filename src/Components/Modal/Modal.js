import styles from "./Modal.module.css"

export default function Modal({ deleteUser, setOpenModal }) {
  return (
    <>
      <div className={styles.ModalBack}>
        <div className={styles.ModalContent}>
          <p className={styles.ModalText}>Вы уверены, что хотите удалить пользователя?</p>
          <div>
            <button className={styles.ButtonModal} onClick={setOpenModal}>
              No
            </button>
            <button className={styles.ButtonModal} onClick={deleteUser}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
