"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, Send } from "lucide-react";
import * as React from "react";
import { Button, type ButtonProps } from "./button";

const chatInputVariants = cva(
	"group/chat-input w-full relative overflow-hidden rounded-lg",
	{
		variants: {
			variant: {
				default:
					"border border-input focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px] focus-within:shadow-primary/10 transition-shadow duration-300",
				ghost: "border-none focus-within:border-none focus-within:shadow-none",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface ChatInputProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof chatInputVariants> {
	value?: string;
	loading?: boolean;
	onStop?: () => void;
	onSubmit?: () => void;
	onValueChange?: (value: string) => void;
}

const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
	(
		{ className, variant, value, loading, onStop, onSubmit, ...props },
		ref,
	) => {
		const [inputValue, setInputValue] = React.useState(value);

		const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
			e?.preventDefault();
			onSubmit?.();
		};

		return (
			<div
				className={cn(chatInputVariants({ variant }), className)}
				ref={ref}
				{...props}
			>
				<form className="relative" onSubmit={handleSubmit}>
					{props.children}
				</form>
				{loading && (
					<div className="absolute inset-x-0 bottom-16 flex justify-center">
						<Button
							variant={"outline"}
							size={"sm"}
							className="rounded-full"
							onClick={onStop}
						>
							<Loader2 className="animate-spin mr-2" size={16} />
							Stop generating
						</Button>
					</div>
				)}
			</div>
		);
	},
);

ChatInput.displayName = "ChatInput";

const ChatInputTextArea = React.forwardRef<
	HTMLTextAreaElement,
	React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
	const { onValueChange, value } = React.useContext(ChatInputContext);
	const internalRef = React.useRef<HTMLTextAreaElement>(null);
	React.useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			const form = e.currentTarget.form;
			if (form) {
				const submitEvent = new Event("submit", {
					bubbles: true,
					cancelable: true,
				});
				form.dispatchEvent(submitEvent);
			}
		}
	};
	
	return (
		<textarea
			ref={internalRef}
			className={cn(
				"w-full h-full resize-none bg-transparent outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 placeholder:text-muted-foreground disabled:opacity-50 min-h-12 p-3 pr-12 text-sm",
				className,
			)}
			value={value}
			onChange={(e) => onValueChange?.(e.target.value)}
			onKeyDown={handleKeyDown}
			{...props}
		/>
	);
});

ChatInputTextArea.displayName = "ChatInputTextArea";

const ChatInputSubmit = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, ...props }, ref) => {
		const { loading, value } = React.useContext(ChatInputContext);
		return (
			<Button
				ref={ref}
				type="submit"
				size={"icon"}
				className={cn("absolute right-2 bottom-2 w-8 h-8", className)}
				disabled={!value || loading}
				{...props}
			>
				<Send size={16} />
			</Button>
		);
	},
);

ChatInputSubmit.displayName = "ChatInputSubmit";


const ChatInputContext = React.createContext<ChatInputProps>({});

const ChatInputProvider: React.FC<React.PropsWithChildren<ChatInputProps>> = ({
	children,
	...props
}) => {
	return (
		<ChatInputContext.Provider value={props}>{children}</ChatInputContext.Provider>
	);
};

const OriginalChatInput = ChatInput;

const ChatInputWithProvider = React.forwardRef<HTMLDivElement, ChatInputProps>(
	(props, ref) => (
		<ChatInputProvider {...props}>
			<OriginalChatInput ref={ref} {...props} />
		</ChatInputProvider>
	),
) as (props: ChatInputProps & React.RefAttributes<HTMLDivElement>) => React.ReactElement;


export {
	ChatInputWithProvider as ChatInput,
	ChatInputTextArea,
	ChatInputSubmit,
};

