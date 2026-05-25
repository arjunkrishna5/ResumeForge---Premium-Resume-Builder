import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { motion } from "motion/react";
import { FileQuestion } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex max-w-md flex-col items-center"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <FileQuestion className="h-12 w-12" />
        </div>
        <h1 className="font-display text-4xl font-bold text-navy mb-3">Page Not Found</h1>
        <p className="mb-8 text-lg text-slate-500">
          We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link to="/">
          <Button size="lg" className="px-8">
            Go Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
