import React from "react";
import Button from "./components/ui/Button";
import { Card, CardContent } from "./components/ui/Card";
import Input from "./components/ui/Input";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function FrontPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4 text-indigo-700">TaskFlow</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Organize, prioritize, and conquer your day with ease. Your personal
          task manager for ultimate productivity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Input placeholder="Enter your email" className="max-w-xs" />
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        {[
          {
            title: "Create Tasks",
            description: "Easily add new tasks and manage them on the go.",
          },
          {
            title: "Set Priorities",
            description:
              "Mark tasks by urgency and importance to stay focused.",
          },
          {
            title: "Track Progress",
            description: "Visualize your productivity with progress tracking.",
          },
        ].map((feature, i) => (
          <Card key={i}>
            <CardContent>
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                {feature.title}
              </h2>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </main>
  );
}
