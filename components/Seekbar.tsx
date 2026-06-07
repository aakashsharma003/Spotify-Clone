import { Root, Track, Range, Thumb } from '@radix-ui/react-slider';

interface SeekbarProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Seekbar = ({ value = 0, onChange }: SeekbarProps) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <Root
      className='relative flex items-center select-none touch-none w-full h-full cursor-pointer group'
      defaultValue={[0]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.001}
      aria-label='Seekbar'
    >
      <Track className='bg-[#3e3e3e] relative grow rounded-full h-[4px] group-hover:h-[6px] transition-all duration-150'>
        <Range className='absolute bg-[#b3b3b3] group-hover:bg-[#1db954] rounded-full h-full transition-colors duration-150' />
      </Track>
      <Thumb className='opacity-0 group-hover:opacity-100 block w-3 h-3 bg-white rounded-full transition-opacity duration-150 shadow-md focus:outline-none' />
    </Root>
  );
};

export default Seekbar;
