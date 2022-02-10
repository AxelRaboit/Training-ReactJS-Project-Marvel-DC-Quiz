import React from 'react'

const Modal = ({ showModal, closeModal, children }) => {
    return (
        showModal && (
            <div className='modalBackground' onClick={closeModal}>
                <div className='modalContainer'>
                    { children }
                </div>
            </div>
        )
    )
}

export default Modal