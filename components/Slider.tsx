import { Root, Track, Range, Thumb } from '@radix-ui/react-slider';

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

const Slider = ({
  value = 1,
  onChange,
  orientation = 'horizontal',
}: SliderProps) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <Root
      className={`relative flex ${
        orientation === 'vertical'
          ? 'flex-col w-[20px] h-[100px]'
          : 'flex-row w-[100px] h-[20px]'
      } items-center select-none touch-none cursor-pointer group`}
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.01}
      orientation={orientation}
      aria-label='Volume'
    >
      <Track
        className={`bg-[#3e3e3e] relative grow rounded-full ${
          orientation === 'vertical' ? 'w-[4px] group-hover:w-[6px]' : 'h-[4px] group-hover:h-[6px]'
        } transition-all duration-150`}
      >
        <Range
          className={`absolute bg-[#b3b3b3] group-hover:bg-[#1db954] rounded-full transition-colors duration-150 ${
            orientation === 'vertical' ? 'w-[100%]' : 'h-[100%]'
          }`}
        />
      </Track>
      {orientation === 'horizontal' && (
        <Thumb className='opacity-0 group-hover:opacity-100 block w-3 h-3 bg-white rounded-full transition-opacity duration-150 shadow-md focus:outline-none' />
      )}
    </Root>
  );
};

export default Slider;
