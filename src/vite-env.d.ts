/// <reference types="vite/client" />

declare module "*?react" {
  const reactComponent: React.ComponentType<React.PropsWithChildren<{}>>
  export default reactComponent
}

declare module "@/lib/utils" {
  export function cn(...classes: (string | undefined | null)[]): string
}

declare module "@/components/ui/button" {
  import { forwardRef, ButtonHTMLAttributes } from "react"
  export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "md" | "lg" | "icon"
  }>
}

declare module "@/components/ui/input" {
  import { forwardRef, InputHTMLAttributes } from "react"
  export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>
}

declare module "@/components/ui/label" {
  import { forwardRef, LabelHTMLAttributes } from "react"
  export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>
}

declare module "@/components/ui/card" {
  import { forwardRef, HTMLAttributes } from "react"
  export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
  export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
  export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>
  export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>
  export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
  export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
}

declare module "@/components/ui/badge" {
  import { forwardRef, HTMLAttributes } from "react"
  export const Badge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline"
  }>
}

declare module "@/components/ui/tabs" {
  import { ReactNode } from "react"
  export function Tabs({ defaultValue, value, onValueChange, className, children }: {
    defaultValue?: string; value?: string; onValueChange?: (v: string) => void; className?: string; children: ReactNode
  }): React.ReactElement
  export function TabsList({ className, children }: { className?: string; children: ReactNode }): React.ReactElement
  export function TabsTrigger({ value, className, children, ...props }: { value: string; className?: string; children?: ReactNode; [k: string]: unknown }): React.ReactElement
  export function TabsContent({ value, className, children, ...props }: { value: string; className?: string; children?: ReactNode; [k: string]: unknown }): React.ReactElement
}

declare module "@/components/ui/textarea" {
  import { forwardRef, TextareaHTMLAttributes } from "react"
  export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>
}

declare module "@/components/ui/avatar" {
  import { forwardRef, HTMLAttributes } from "react"
  export const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
  export const AvatarImage = forwardRef<HTMLImageElement, HTMLAttributes<HTMLImageElement>>
  export const AvatarFallback = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
}

declare module "@/components/ui/alert" {
  import { forwardRef, HTMLAttributes, ReactNode } from "react"
  export const Alert = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { variant?: "default" | "destructive" }>
  export const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>
  export const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>
  export const AlertAction = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
}

declare module "@/components/ui/bubble" {
  import { forwardRef, HTMLAttributes, ReactNode } from "react"
  export const Bubble = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
  export const BubbleContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
}

declare module "@/components/ui/message" {
  import { forwardRef, HTMLAttributes, ReactNode } from "react"
  export const Message = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }>
  export const MessageAvatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
  export const MessageContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
  export const MessageHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
  export const MessageFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
  export const MessageGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
}

declare module "@/components/ui/calendar" {
  import { DayPicker, DayPickerProps } from "react-day-picker"
  export function Calendar(props: DayPickerProps & {
    className?: string; classNames?: import("react-day-picker").ClassNames; buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"; mode?: "single" | "range" | "multiple";
  }): React.ReactElement
}
