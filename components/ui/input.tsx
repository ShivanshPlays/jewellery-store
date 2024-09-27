import { Field, Input, Label } from '@headlessui/react'
import clsx from 'clsx'

interface InputboxProps{
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    data: string;
}
const Inputbox:React.FC<InputboxProps>=({
    label,
    onChange,
    data
})=> {
  return (
    <div className="w-full max-w-md px-4">
      <Field>
        <Label className="text-sm/6 font-medium text-white">{label}</Label>
        {/* <Description className="text-sm/6 text-white/50">Use your real name so people will recognize you.</Description> */}
        <Input
            type="text"
            value={data}
            onChange={onChange}
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
        />
      </Field>
    </div>
  )
}

export default Inputbox