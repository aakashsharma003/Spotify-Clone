import { PropsWithChildren } from 'react';
import {
  Root,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
} from '@radix-ui/react-dialog';
import { IoMdClose } from 'react-icons/io';

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
}

const Modal = ({
  isOpen,
  onChange,
  title,
  description,
  children,
}: ModalProps) => {
  return (
    <Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Portal>
        <Overlay className='bg-neutral-900/90 backdrop-blur-sm fixed inset-0' />
        <Content
          className='fixed drop-shadow-md border border-neutral-700/50 top-[50%]
          left-[50%] max-h-full h-full md:h-auto md:max-h[85vh] w-full md:w-[90vw] 
          md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-xl 
          bg-[#181818] p-[30px] focus:outline-none shadow-2xl'
        >
          <Title className='text-xl text-center font-bold mb-4'>{title}</Title>
          <Description className='mb-5 text-sm leading-normal text-center text-neutral-400'>
            {description}
          </Description>
          <div>{children}</div>
          <Close asChild>
            <button
              className='text-neutral-400 hover:text-white absolute 
              top-[12px] right-[12px] inline-flex h-[25px] w-[25px] appearance-none
              items-center justify-center rounded-full focus:outline-none transition duration-150'
              onClick={() => {}}
            >
              <IoMdClose size={18} />
            </button>
          </Close>
        </Content>
      </Portal>
    </Root>
  );
};

export default Modal;
