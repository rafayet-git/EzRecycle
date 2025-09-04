import { Leaf, Info, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function EzRecycleHome() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100 text-gray-800">

      {/* Main */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
            >
              Recycling made <span className="text-green-600">simple</span> and rewarding
            </motion.h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              EzRecycle guides you with clear steps, local resources, and personalized planning to make eco‑friendly habits stick.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link
                to="/guide"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl shadow"
              >
                Take the Quick Quiz
              </Link>
              <Link
                to="https://github.com/rafayet-git/EzRecycle"
                className="inline-block bg-black hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-2xl shadow"
              >
                View Source Code @ GitHub
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Info className="w-8 h-8 text-green-600" />}
              title="Know What to Recycle"
              description="Learn exactly which materials your city accepts and how to prepare them."
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-green-600" />}
              title="Find Drop‑Off Points"
              description="Quickly locate recycling centers, donation spots, and swap events near you."
            />
            <FeatureCard
              icon={<Leaf className="w-8 h-8 text-green-600" />}
              title="Build Sustainable Habits"
              description="Set reminders and track progress with our Planner to stay on the green path."
            />
          </div>
        </section>

        {/* Resources CTA */}
        <section id="resources" className="py-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-4">Helpful Resources</h3>
            <p className="max-w-2xl mx-auto mb-8">
              Dive deeper with guides on local regulations, upcycling ideas, and downloadable sorting charts.
            </p>
            <Link
              to="/resources"
              className="inline-block bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-2xl border border-green-600"
            >
              Explore Resources
            </Link>
          </div>
        </section>
      </main>

    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-green-50 rounded-2xl shadow p-6 flex flex-col items-center text-center"
    >
      {icon}
      <h4 className="font-bold text-lg mt-4 mb-2">{title}</h4>
      <p className="text-sm">{description}</p>
    </motion.div>
  );
}
