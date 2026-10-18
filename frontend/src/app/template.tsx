import type { ReactNode } from "react"

type TemplateProps = {
    children: ReactNode
}

const Template = ({ children }: TemplateProps) => {
    return (
        <div className="page-transition">
            {children}
        </div>
    )
}
export default Template;