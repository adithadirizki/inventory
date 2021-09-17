import styled from "styled-components";

const ModalWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
`;

const Modal = ({ children, show, afterClose = () => {} }) => {
  return (
    <>
      <ModalWrapper
        className={`fixed top-0 left-0 ${
          show ? "visible opacity-100" : "invisible opacity-0"
        } ease-in-out duration-500 w-full h-screen z-20`}
        style={{
          transitionProperty: "visibility, opacity",
        }}
        onClick={() => {
          afterClose();
        }}>
        <div
          className={`fixed top-1/2 left-1/2 transition-transform duration-700 transform ${
            show ? "-translate-y-1/2" : "translate-y-full"
          } -translate-x-1/2 w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 px-6`}
          onClick={(e) => {
            e.stopPropagation();
          }}>
          {children}
        </div>
      </ModalWrapper>
    </>
  );
};

export default Modal;
