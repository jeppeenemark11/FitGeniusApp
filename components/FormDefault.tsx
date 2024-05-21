"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface FormProps {
  onSubmitCallback: (values: string) => void;
}

const formSchema = z.object({
  query: z.string().min(0).max(50, {
    message: "No More that 50 character search allowed!",
  }),
})


export function FormDefault({ onSubmitCallback }: FormProps) {

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        query: "",
      },
    })
   

    function onSubmit(values: z.infer<typeof formSchema>) {

      onSubmitCallback(values.query);

      form.reset({
        query: ""
      });
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-row items-center justify-center gap-0.5 mt-0 md:mt-1 lg:mt-3">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>

                <FormControl>
                  <Input placeholder="Bench Press"  className='w-56 md:w-72 lg:w-96 rounded border-slate-500 placeholder:text-slate-400'  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className=' hover:cursor-pointer bg-black text-white rounded hover:bg-zinc-800 w-16 md:w-20 lg:w-20 text-xs md:text-sm lg:text-sm' >Search <span className="text-lg  md:text-lg lg:text-xl">🔎</span></Button>
        </form>
      </Form>
    )
  }