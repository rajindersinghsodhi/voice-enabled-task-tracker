import { Loader2 } from 'lucide-react'
import React from 'react'

const Button = ({ buttonTitle, loading, buttonType = 'button', classname, action }: { buttonTitle: string, loading?: boolean, buttonType?: 'submit' | 'button', action?: () => void, classname?: string }) => {
  return (
    <button type={buttonType} className={`flex justify-center items-center p-1 rounded-md shadow-md cursor-pointer ${classname}`} onClick={action}>
        { loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" strokeWidth={3} />
        ): (
                <span>{buttonTitle}</span>
            )
        }   
    </button>
  )
}

export default Button;