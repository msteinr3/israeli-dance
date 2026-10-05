import { Suspense } from "react";
import SubmitForm from "./SubmitForm";

export default function SubmitPage() {
  return (
    <Suspense>
      <SubmitForm />
    </Suspense>
  );
}
