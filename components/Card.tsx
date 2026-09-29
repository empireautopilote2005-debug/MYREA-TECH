import type { ReactNode } from 'react'

export default function Card({children}:{children:ReactNode}){
 return <div className="rounded-xl border p-5 shadow">{children}</div>
}
