import React from "react";

import "./modal.css";

const Modal = ({ title, children, canConfirm, canCancel, onCancel,onConfirm}) => {
  return (
    <div className='modal'>
      <header className='modal__header'>{title}</header>
      <section className='modal__content'>{children} </section>
      <section className='modal__actions'>
        {canCancel && <button className='btn' onClick={onCancel}>cancel</button>}
        {canConfirm && <button className='btn' onClick={onConfirm}>confirm</button>}
      </section>
    </div>
  );
};

export default Modal;
