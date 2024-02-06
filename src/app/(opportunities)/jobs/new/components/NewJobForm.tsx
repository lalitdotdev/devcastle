import H1 from "@/components/h1";
import { Form } from "@/components/ui/Form";
import { CreateJobValues, createJobSchema } from "@/lib/validators/jobFilter";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface NewJobFormProps {}

const NewJobForm: FC<NewJobFormProps> = ({}) => {
  const form = useForm<CreateJobValues>({
    resolver: zodResolver(createJobSchema),
  });

  return (
    <main className="m-auto my-10 max-w-3xl space-y-10">
      <div className="space-y-5 text-center">
        <H1>Find your perfect developer.</H1>

        <p
          className=" text-muted-foreground"
          //   style={{ maxWidth: "40ch", margin: "auto" }}
        >
          Post a job to reach thousands of developers and engineers. We&apos;ll
          help you find the best candidates.
        </p>
      </div>
      <div className="space-y-6 rounded-lg border border-zinc-400 p-4">
        <div>
          <h2 className="font-semibold">Job details</h2>
          <p className="text-muted-foreground">
            Provide a job description and details
          </p>
        </div>
        <Form {...form}></Form>
      </div>
    </main>
  );
};

export default NewJobForm;
