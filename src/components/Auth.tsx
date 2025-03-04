import * as React from "react";
import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <Form.Root onSubmit={handleSubmit(onSubmit)} className="w-80 p-4 border rounded-lg shadow-lg space-y-4">
      <Form.Field name="email" className="grid gap-2">
        <Form.Label className="text-sm font-medium">Email</Form.Label>
        <Form.Control asChild>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            className="border p-2 rounded w-full"
          />
        </Form.Control>
        {errors.email && <Form.Message className="text-red-500 text-sm">{errors.email.message}</Form.Message>}
      </Form.Field>

      <Form.Field name="password" className="grid gap-2">
        <Form.Label className="text-sm font-medium">Password</Form.Label>
        <Form.Control asChild>
          <input
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Must be at least 6 characters" } })}
            type="password"
            className="border p-2 rounded w-full"
          />
        </Form.Control>
        {errors.password && <Form.Message className="text-red-500 text-sm">{errors.password.message}</Form.Message>}
      </Form.Field>

      <Form.Submit asChild>
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Submit</button>
      </Form.Submit>
    </Form.Root>
  );
};

export default LoginForm;
